import { BadRequestException, HttpException } from '@nestjs/common';

import { APP_ERROR } from 'common/errors';

export const generateResponseError = (
  error: unknown,
  errorMessage?: string,
) => {
  throw error instanceof HttpException
    ? error
    : new BadRequestException(
        errorMessage ? errorMessage : APP_ERROR.BAD_REQUEST,
      );
};
