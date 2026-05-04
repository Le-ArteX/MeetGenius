import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, Validate } from 'class-validator';
import { EmailUnique } from 'src/users/validation/email-unique.validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Validate(EmailUnique, { message: 'Email already exists' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  })
  password: string;

}