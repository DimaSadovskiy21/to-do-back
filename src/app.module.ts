import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { configurations } from 'configurations';
import { UsersModule } from './models/users/users.module';
import { TokenModule } from './models/token/token.module';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './models/todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('host'),
      }),
    }),
    AuthModule,
    UsersModule,
    TokenModule,
    TodosModule,
  ],
})
export class AppModule {}
