import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'vikbon',
    description: 'User login',
  })
  readonly login: string;
  @ApiProperty({
    example: 'vikbon291x',
    description: 'User password',
  })
  readonly password: string;
}
