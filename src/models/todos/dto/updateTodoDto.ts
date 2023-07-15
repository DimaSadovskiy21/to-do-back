import { IsString } from 'class-validator';

import { Types } from 'mongoose';

export class UpdateTodoDto {
  @IsString()
  readonly userId: Types.ObjectId;

  @IsString()
  readonly todoId: string;

  @IsString()
  readonly content: string;
}
