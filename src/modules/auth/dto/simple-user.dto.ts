import { Role, UserStatus } from '@prisma/client';
import { UserWithOrg } from '../../user/types/user.types';

export class SimpleUserDto {
  constructor(user: UserWithOrg) {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.login = user.login;
    this.id = user.id;
    this.status = user.status;
    this.closed = user.closed;
    this.role = user.role;
    this.organisation = {
      name: user.organisation.name,
      short_name: user.organisation.short_name,
    };
    this.avatar = user.avatar;
  }
  id: string | number;
  login: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  closed: boolean;
  avatar: string | null;
  role: Role;
  organisation: UserWithOrg['organisation'];
}
