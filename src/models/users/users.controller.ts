import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Response } from 'express';

import { ROUTES, SUBROUTES } from 'common/constants';
import { GetTokens, GetUserId, GetUsersQueryParams } from 'common/decorators';
import { AccessJwtAuthGuard, RefreshJwtAuthGuard } from 'common/guards';
import { generateResponseError } from 'common/utils';
import { TokensDto } from 'models/token/dto';

import { UsersDto } from './dto';
import { UsersService } from './users.service';

@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async getUsers(@GetUsersQueryParams() usersDto: UsersDto) {
    try {
      return await this.usersService.getUsers(usersDto);
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Delete()
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async deleteUser(
    @GetUserId() userId: Types.ObjectId,
    @GetTokens() tokens: TokensDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { refreshToken } = tokens;

      await this.usersService.deleteUser({ userId, refreshToken });

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      return true;
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Post(SUBROUTES.TOGGLE_SUBSCRIBE)
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async toggleSubscribe(
    @GetUserId() subscriberId: Types.ObjectId,
    @Param('userId') userId: Types.ObjectId,
  ) {
    try {
      return await this.usersService.toggleSubscribe({ subscriberId, userId });
    } catch (error) {
      generateResponseError(error);
    }
  }
}
