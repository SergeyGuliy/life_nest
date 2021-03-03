import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(16)
  @MaxLength(16)
  phone: string;

  phoneCountryCode: string;

  @IsString()
  password: string;

  firstName: string;

  lastName: string;

  country: string;
  //
  // @IsString()
  // password: string;
  //
  // @IsString()
  // password: string;
}
