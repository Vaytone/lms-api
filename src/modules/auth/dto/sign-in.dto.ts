import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'vikbon',
    description: 'User email',
  })
  readonly email: string;
  @ApiProperty({
    example: 'vikbon291x',
    description: 'User password',
  })
  readonly password: string;
}
