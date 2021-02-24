import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  content: string;

  @IsString()
  title: string;
}
