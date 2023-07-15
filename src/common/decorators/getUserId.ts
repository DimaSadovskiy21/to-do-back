import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Types } from 'mongoose';

export const GetUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Types.ObjectId => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user['_id'];

    return userId;
  },
);
