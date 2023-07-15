import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'express';

import { UserDto } from 'models/users/dto';

import { Token, TokenDocument } from './schema';
import { AuthUserDto } from './dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private accessSecretKeyToken = this.configService.get('secret_jwt_access');
  private accessExpire = this.configService.get('expire_jwt_access');
  private refreshSecretKeyToken = this.configService.get('secret_jwt_refresh');
  private refreshExpire = this.configService.get('expire_jwt_refresh');

  async generateJwtToken(userDto: UserDto) {
    const payload = { user: userDto };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecretKeyToken,
      expiresIn: this.accessExpire,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecretKeyToken,
      expiresIn: this.refreshExpire,
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const token = await this.tokenModel.findOne({ user: userId });

    if (token) {
      token.refreshToken = refreshToken;
      return await token.save();
    }

    return await this.tokenModel.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken: string) {
    return await this.tokenModel.deleteOne({ refreshToken });
  }

  async findToken(userId: Types.ObjectId) {
    return await this.tokenModel.findOne({ user: userId });
  }

  async generateAndSaveTokens(userDto: UserDto) {
    const tokens = await this.generateJwtToken(userDto);

    const { _id } = userDto;

    await this.saveToken(_id, tokens.refreshToken);

    return tokens;
  }

  async setCookie(res: Response, authUserDto: AuthUserDto) {
    const { tokens } = authUserDto;

    const refreshExpire = this.configService.get('expire_jwt_refresh');
    const accessExpire = this.configService.get('expire_jwt_access');

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: refreshExpire,
      httpOnly: true,
    });

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: accessExpire,
      httpOnly: true,
    });
  }
}
