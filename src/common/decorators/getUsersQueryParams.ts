import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UsersDto } from 'models/users/dto';

export const GetUsersQueryParams = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UsersDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search;

    return { page, limit, search };
  },
);
