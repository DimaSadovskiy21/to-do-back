import { IsString, IsEmail, IsArray } from 'class-validator';

import { Types } from 'mongoose';

export class UserDto {
  @IsString()
  readonly _id: Types.ObjectId;

  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsArray()
  readonly subscriptions: Types.ObjectId[];

  @IsArray()
  readonly subscribers: Types.ObjectId[];
}
