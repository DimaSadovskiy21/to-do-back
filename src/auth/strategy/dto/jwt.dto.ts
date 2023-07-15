import { IsNumber } from 'class-validator';

import { UserDto as user } from 'models/users/dto';

export class JwtDto {
  readonly user: user;

  @IsNumber()
  readonly iat: number;

  @IsNumber()
  readonly exp: number;
}
