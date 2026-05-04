import { IsEmail, IsNotEmpty, IsString, MinLength, Validate, Matches } from 'class-validator';
import { EmailUnique } from '../../users/validation/email-unique.validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Validate(EmailUnique, { message: 'Email already exists' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Please confirm your password' })
  confirmPassword: string;
}