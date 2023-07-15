import { IsString } from 'class-validator';

import { Types } from 'mongoose';

export class DeleteUserDto {
  @IsString()
  readonly userId: Types.ObjectId;

  @IsString()
  readonly refreshToken: string;
}
