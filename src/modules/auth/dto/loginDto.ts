import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/;
const phoneRegex = /^[+][0-9]{1}[(][0-9]{3}[)][ ][0-9]{3}[-][0-9]{3}$/;

export class LoginDto {
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  @MinLength(5)
  @MaxLength(20)
  email: string;

  @ValidateIf((o) => !o.email)
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
