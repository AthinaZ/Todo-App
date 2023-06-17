import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Todo } from './todo.entity';
import { TodoService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule],
  controllers: [TodosController],
  providers: [TodoService],
})
export class TodosModule {}
