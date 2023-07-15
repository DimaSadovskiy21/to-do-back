import { IsString } from 'class-validator';

import { Types } from 'mongoose';

export class DeleteTodoDto {
  @IsString()
  readonly userId: Types.ObjectId;

  @IsString()
  readonly todoId: string;
}
