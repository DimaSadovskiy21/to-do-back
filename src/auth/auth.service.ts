import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { TokenService } from 'models/token/token.service';
import { UsersService } from 'models/users/users.service';
import { CreateUserDto } from 'models/users/dto';

import { LoginDto } from './dto';
import { ERROR } from './common/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    const candidate = await this.usersService.hasUser({ email, username });

    if (candidate) throw new BadRequestException(ERROR.USER_EXIST);

    const user = await this.usersService.createUser(createUserDto);

    const userDto = await this.usersService.getPublicUser(user);

    const tokens = await this.tokenService.generateAndSaveTokens(userDto);

    return { user: userDto, tokens };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) throw new BadRequestException(ERROR.USER_NOT_EXIST);

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) throw new BadRequestException(ERROR.INCORRECT_DATA);

    const userDto = await this.usersService.getPublicUser(user);

    const tokens = await this.tokenService.generateAndSaveTokens(userDto);

    return { user: userDto, tokens };
  }

  async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
  }

  async getUserProfile(userId: Types.ObjectId) {
    const user = await this.usersService.findUserById(userId);

    return await this.usersService.getPublicUser(user);
  }

  async refresh(userId: Types.ObjectId) {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new BadRequestException();
    }

    const userDto = await this.usersService.getPublicUser(user);

    const tokens = await this.tokenService.generateAndSaveTokens(userDto);

    return { user: userDto, tokens };
  }
}
