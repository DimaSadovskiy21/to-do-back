import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const client_url = configService.get('client_url');

  const corsOptions = {
    origin: client_url,
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.enableCors(corsOptions);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('port');

  await app.listen(port);
}
bootstrap();
