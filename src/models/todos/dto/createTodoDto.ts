import { IsString } from 'class-validator';

import { Types } from 'mongoose';

export class CreateTodoDto {
  @IsString()
  readonly content: string;

  @IsString()
  readonly author: Types.ObjectId;
}
