import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { TokensDto } from 'models/token/dto';

export const GetTokens = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokensDto => {
    const request = ctx.switchToHttp().getRequest();
    const cookies = request.cookies;

    const { accessToken, refreshToken } = cookies;

    return { accessToken, refreshToken };
  },
);
