import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { TodosDto } from 'models/todos/dto';

export const GetTodosQueryParams = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TodosDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const myTodos = Boolean(query.myTodos) || false;

    return { page, limit, myTodos };
  },
);
