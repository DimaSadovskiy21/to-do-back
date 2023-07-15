import { IsString } from 'class-validator';

export class TokensDto {
  @IsString()
  readonly refreshToken: string;

  @IsString()
  readonly accessToken: string;
}
