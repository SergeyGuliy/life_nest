import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/;

export class RegistrationDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(passwordRegex, {
    message: 'password must contain 1 letter and 1 digit',
  })
  password: string;
}
