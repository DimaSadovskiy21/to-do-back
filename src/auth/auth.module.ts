import { Module } from '@nestjs/common';

import { UsersModule } from 'models/users/users.module';
import { TokenModule } from 'models/token/token.module';

import { AccessJwtStrategy, RefreshJwtStrategy } from './strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
