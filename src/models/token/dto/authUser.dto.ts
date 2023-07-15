import { UserDto } from 'models/users/dto';

import { TokensDto } from './tokens.dto';

export class AuthUserDto {
  readonly user: UserDto;
  readonly tokens: TokensDto;
}
