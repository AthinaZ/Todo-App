import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { GetTaskFilterDto } from 'src/dto/getTodofilter.dto';
import { UpdateTodoDto } from 'src/dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodosController {
  constructor(private todoService: TodoService) {}

  @Get('/:id')
  getTodoById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.getTodoById(id, user);
  }

  @Get()
  getTodos(
    @Query() filerDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Todo[]> {
    return this.todoService.getTodos(filerDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTodo(
    @Body() createDto: CreateTodoDto,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.createTodo(createDto, user);
  }

  @Delete('/:id')
  deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<object> {
    return this.todoService.deleteTodo(id, user);
  }

  @Put('/:id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, updateTodoDto, user);
  }

  @Patch('priorities')
  async updatePriorities(
    @Body() todoUpdates: { id: number; priority: number }[],
  ): Promise<void> {
    for (const todoUpdate of todoUpdates) {
      await this.todoService.updatePriorities(todoUpdate);
    }
  }
}
