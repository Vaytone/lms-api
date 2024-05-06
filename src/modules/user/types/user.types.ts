import { RegisterRole, Role, User, UserStatus } from '@prisma/client';

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RegisterRole;
  greetingMessage?: string;
  organisation_id: number;
  avatar: string | null;
}

export interface UserDetails extends User {
  organisation: {
    name: string;
    short_name: string;
  };
  message: {
    text: string;
  };
  user_info: {
    role: Role;
    role_description?: string;
  };
  user_statuses: {
    status: UserStatus;
    closed: boolean;
  };
}
