import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ROUTES, SUBROUTES } from 'common/constants';
import { Types } from 'mongoose';

import { AccessJwtAuthGuard, RefreshJwtAuthGuard } from 'common/guards';
import { GetTodosQueryParams, GetUserId } from 'common/decorators';
import { generateResponseError } from 'common/utils';

import { TodoDto, TodosDto } from './dto';
import { TodosService } from './todos.service';

@Controller(ROUTES.TODOS)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async getTodos(
    @GetTodosQueryParams() todosDto: TodosDto,
    @GetUserId() userId: Types.ObjectId,
  ) {
    try {
      return await this.todosService.getTodos({ userId, ...todosDto });
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async createTodo(@Body() body: TodoDto, @GetUserId() userId: Types.ObjectId) {
    try {
      const { content } = body;

      return await this.todosService.createTodo({ content, author: userId });
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Delete(SUBROUTES.DELETE_TODO)
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async deleteTodo(
    @Param('todoId') todoId: string,
    @GetUserId() userId: Types.ObjectId,
  ) {
    try {
      return await this.todosService.deleteTodo({ userId, todoId });
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Patch(SUBROUTES.UPDATE_TODO)
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async updateTodo(
    @Body() body: TodoDto,
    @Param('todoId') todoId: string,
    @GetUserId() userId: Types.ObjectId,
  ) {
    try {
      const { content } = body;

      return await this.todosService.updateTodo({ userId, todoId, content });
    } catch (error) {
      generateResponseError(error);
    }
  }
}
