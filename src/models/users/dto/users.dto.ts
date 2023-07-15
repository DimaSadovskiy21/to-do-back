import { IsNumber, IsString } from 'class-validator';

export class UsersDto {
  @IsNumber()
  readonly page: number;

  @IsNumber()
  readonly limit: number;

  @IsString()
  readonly search: string;
}
