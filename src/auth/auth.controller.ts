import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';

import { ROUTES, SUBROUTES } from 'common/constants';
import { generateResponseError } from 'common/utils';
import { AccessJwtAuthGuard, RefreshJwtAuthGuard } from 'common/guards';
import { GetTokens, GetUserId } from 'common/decorators';
import { TokenService } from 'models/token/token.service';
import { CreateUserDto } from 'models/users/dto';
import { TokensDto } from 'models/token/dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post(SUBROUTES.REGISTER)
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const userData = await this.authService.register(createUserDto);

      await this.tokenService.setCookie(res, userData);

      return userData;
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Post(SUBROUTES.LOGIN)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const userData = await this.authService.login(loginDto);

      await this.tokenService.setCookie(res, userData);

      return userData;
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Delete(SUBROUTES.LOGOUT)
  @UseGuards(RefreshJwtAuthGuard)
  async logout(
    @GetTokens() tokens: TokensDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    try {
      const { refreshToken } = tokens;

      await this.authService.logout(refreshToken);

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      return true;
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Get()
  @UseGuards(AccessJwtAuthGuard, RefreshJwtAuthGuard)
  async getUserProfile(@GetUserId() userId: Types.ObjectId) {
    try {
      return await this.authService.getUserProfile(userId);
    } catch (error) {
      generateResponseError(error);
    }
  }

  @Post(SUBROUTES.REFRESH)
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(
    @GetUserId() userId: Types.ObjectId,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const userData = await this.authService.refresh(userId);

      await this.tokenService.setCookie(res, userData);

      return userData;
    } catch (error) {
      generateResponseError(error);
    }
  }
}
