import { IsString } from 'class-validator';

export class TodoDto {
  @IsString()
  readonly content: string;
}
