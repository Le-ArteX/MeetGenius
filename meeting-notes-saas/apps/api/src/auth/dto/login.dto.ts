import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty({ message: 'Please enter your email' })
    email: string;


    @IsString()
    @IsNotEmpty({ message: 'Please enter your password' })
    password: string
}   