import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ValidateOtpDto {
  @ApiProperty({
    example: 'vikbon@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  readonly email: string;
  @ApiProperty({
    example: 'X41SGF',
    description: 'User OTP',
  })
  @IsString()
  @Length(6, 6, {
    message: 'Invalid OTP',
  })
  readonly otp: string;
}
