import { Role, UserStatus } from '@prisma/client';
import { UserDetails } from '../../user/types/user.types';

export class SimpleUserDto {
  constructor(user: UserDetails) {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.id = user.id;
    this.email = user.email;
    this.full_name = user.full_name;
    this.organisation = {
      name: user.organisation.name,
      short_name: user.organisation.short_name,
    };
    this.role = user.user_info.role;
    this.role_description = user.user_info.role_description;
    this.status = user.user_statuses.status;
    this.closed = user.user_statuses.closed;
    this.avatar = user.avatar;
  }

  full_name: string;
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  role_description?: string | null;
  closed: boolean | null;
  organisation: {
    name: string;
    short_name: string;
  };
}
