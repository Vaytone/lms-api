import { User, Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SimpleUserDto {
  constructor(user: User) {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.login = user.login;
    this.id = user.id;
    this.active = user.active;
    this.closed = user.closed;
    this.role = user.role;
  }
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
    description: 'User token',
    example: 'xcdsjknskjnkm342nmxc.gdfgmktrmnkn.zxc21q312dsv.sdfsdffsd',
  })
  token?: string;

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
}
