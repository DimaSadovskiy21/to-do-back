import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'models/users/users.module';

import { Todo, TodoSchema } from './schema';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    UsersModule,
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
