import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { GetTaskFilterDto } from 'src/dto/getTodofilter.dto';
import { UpdateTodoDto } from 'src/dto/update-todo.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async getTodoById(id: number, user: User): Promise<Todo> {
    const found = await this.todoRepository.findOne({
      where: { id, createBy: user.id },
    });
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async getTodos(filterDto: GetTaskFilterDto, user: User): Promise<Todo[]> {
    const { id, completed } = filterDto;
    const query = this.todoRepository.createQueryBuilder('todo');
    query.where('todo.createBy = :createBy', { createBy: user.id });

    if (id) {
      query.andWhere('todo.id = :id', { id: id });
    }

    if (completed) {
      query.andWhere('todo.completed = :completed', { completed: completed });
    }

    query.orderBy('todo.priority', 'ASC'); // Order by priority in ascending order

    const todos = await query.getMany();
    return todos;
  }

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    const { todo, completed, category } = createTodoDto;

    const maxPriority = await this.todoRepository
      .createQueryBuilder('todo')
      .select('MAX(todo.priority)', 'maxPriority')
      .where('todo.user = :userId', { userId: user.id }) // Retrieve maximum priority for current user
      .getRawOne();

    const todoEntity = new Todo();
    todoEntity.todo = todo;
    todoEntity.completed = completed;
    todoEntity.user = user;
    todoEntity.category = category
      ? category
      : { color: '#A9ACA8', label: 'Misc' };
    todoEntity.priority = (maxPriority.maxPriority || 0) + 1;

    await todoEntity.save();

    delete todoEntity.user;
    return todoEntity;
  }

  async deleteTodo(id: number, user: User): Promise<object> {
    const result = await this.todoRepository.delete({ id, createBy: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`not found id ${id}`);
    }
    return {
      mes: 'delete success',
    };
  }

  async updateTodo(
    id: number,
    updateTodoDto: UpdateTodoDto,
    user: User,
  ): Promise<Todo> {
    const { todo, completed, category } = updateTodoDto;

    const todoEntity = await this.getTodoById(id, user);

    todoEntity.todo = todo;
    todoEntity.completed = completed;
    todoEntity.category =
      typeof category === 'string' ? todoEntity.category : category;

    await this.todoRepository.save(todoEntity);
    return todoEntity;
  }

  async updatePriorities(todoUpdate: {
    id: number;
    priority: number;
  }): Promise<Todo> {
    const { id, priority } = todoUpdate;

    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.priority = priority;
    await this.todoRepository.save(todo);

    return todo;
  }
}
