import { Role } from '@prisma/client';
import { UserWithOrg } from '../../user/types/user.types';

export class SimpleUserDto {
  constructor(user: UserWithOrg) {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.login = user.login;
    this.id = user.id;
    this.active = user.active;
    this.closed = user.closed;
    this.role = user.role;
    this.organisation = {
      name: user.organisation.name,
      short_name: user.organisation.short_name,
    };
  }
  id: string | number;
  login: string;
  firstName: string;
  lastName: string;
  active: boolean;
  closed: boolean;
  role: Role;
  organisation: UserWithOrg['organisation'];
}
