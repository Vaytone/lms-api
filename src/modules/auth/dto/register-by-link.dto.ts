import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterByLinkDto {
  @ApiProperty({
    example: 'vcdsf23sdzdsa',
    description: 'Sign Up code',
  })
  @Length(1)
  @IsString({ message: 'Must be a string' })
  readonly code: string;
  @Length(2, 30)
  @ApiProperty({
    example: 'Viktor',
    description: 'User first name',
  })
  @IsString({ message: 'Must be a string' })
  readonly firstName: string;
  @ApiProperty({
    example: 'Bonov',
    description: 'User last name',
  })
  @Length(2, 30)
  @IsString({ message: 'Must be a string' })
  readonly lastName: string;
  @ApiProperty({
    example: 'vikbon',
    description: 'User login',
  })
  @Length(6, 30)
  @IsString({ message: 'Must be a string' })
  readonly login: string;
  @ApiProperty({
    example: 'vikbon291x',
    description: 'User password',
  })
  @Length(8, 50, {
    message: 'Password must be at least 8 characters and less than 25 ',
  })
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
