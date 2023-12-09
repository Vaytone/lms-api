import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: 1,
  })
  id: string | number;
  @ApiProperty({
    description: 'User login',
    example: 'login',
  })
  login: string;
  @ApiProperty({
    description: 'User first name',
    example: 'Viktor',
  })
  firstName: string;
  @ApiProperty({
    description: 'User surname',
    example: 'Viktorov',
  })
  lastName: string;

  @ApiProperty({
    description: 'User active status in organisation',
    example: false,
  })
  active: boolean;

  @ApiProperty({
    description: 'User closed status in organisation',
    example: false,
  })
  closed: boolean;

  @ApiProperty({
    description: 'User role in organisation',
    enum: ['admin', 'student', 'guest', 'watcher', 'owner'],
  })
  role: Role;

  @ApiProperty({
    description: 'User access token',
    example: 'vsfsdxcvw8we.sdfs.bcvbgdgdf',
  })
  token: string;
}
