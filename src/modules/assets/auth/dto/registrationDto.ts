import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/;
const phoneRegex = /^[+][0-9]{1}[(][0-9]{3}[)][ ][0-9]{3}[-][0-9]{4}$/;

export class RegistrationDto {
  @IsEmail()
  @MinLength(5)
  @MaxLength(30)
  email: string;

  @IsString()
  @Matches(phoneRegex, {
    message: 'phone is invalid. Example: +1(234) 567-890',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(passwordRegex, {
    message: 'password must contain 1 letter and 1 digit',
  })
  password: string;
}
