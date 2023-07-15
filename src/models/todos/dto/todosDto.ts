import { IsNumber, IsString, IsBoolean } from 'class-validator';

import { Types } from 'mongoose';

export class TodosDto {
  @IsString()
  readonly userId?: Types.ObjectId;

  @IsNumber()
  readonly page: number;

  @IsNumber()
  readonly limit: number;

  @IsBoolean()
  readonly myTodos: boolean;
}
