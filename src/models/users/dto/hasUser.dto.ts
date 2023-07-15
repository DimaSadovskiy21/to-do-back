import { IsString, IsEmail } from 'class-validator';

export class HasUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;
}
