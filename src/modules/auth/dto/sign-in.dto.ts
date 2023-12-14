import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'vikbon',
    description: 'User login',
  })
  @Length(5, 30)
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
}
