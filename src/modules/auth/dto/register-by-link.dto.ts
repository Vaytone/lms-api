import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LOGIN_REGEX, NAME_REGEX, PASSWORD_REGEX } from '../constants/regex';

export class RegisterByLinkDto {
  @ApiProperty({
    example: 'vcdsf23sdzdsa',
    description: 'Sign Up code',
  })
  @Length(1)
  @IsString({ message: 'Must be a string' })
  readonly code: string;
  @Length(1, 25)
  @ApiProperty({
    example: 'Viktor',
    description: 'User first name',
  })
  @IsString({ message: 'Must be a string' })
  @Matches(NAME_REGEX)
  readonly firstName: string;
  @ApiProperty({
    example: 'Bonov',
    description: 'User last name',
  })
  @Length(1, 25)
  @IsString({ message: 'Must be a string' })
  @Matches(NAME_REGEX)
  readonly lastName: string;
  @ApiProperty({
    example: 'vikbon',
    description: 'User login',
  })
  @Length(5, 30)
  @IsString({ message: 'Must be a string' })
  @Matches(LOGIN_REGEX)
  readonly login: string;
  @ApiProperty({
    example: 'vikbon291x',
    description: 'User password',
  })
  @Length(8, 50, {
    message: 'Password must be at least 8 characters and less than 25 ',
  })
  @Matches(PASSWORD_REGEX)
  readonly password: string;
  @ApiProperty({
    example: 'vikbon291x',
    description: 'User confirm password',
  })
  @Length(8, 50, {
    message: 'Password must be at least 8 characters and less than 25 ',
  })
  readonly confirmPassword: string;
}
