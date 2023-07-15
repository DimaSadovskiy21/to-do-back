import { IsString } from 'class-validator';

import { Types } from 'mongoose';

export class ToggleSubscribeDto {
  @IsString()
  readonly subscriberId: Types.ObjectId;

  @IsString()
  readonly userId: Types.ObjectId;
}
