import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 3,
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  @Matches(/^[a-zA-Z-ا-ی ]+$/, {
    message: 'Full name must contain only letters and spaces',
  })
  @MaxLength(100, {
    message: 'Full name must not exceed 100 characters',
  })
  fullName!: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password@123!',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, {
    message:
      'Password must contain at least one letter, one number, and one special character (@$!%*#?&)',
  })
  password!: string;
}
