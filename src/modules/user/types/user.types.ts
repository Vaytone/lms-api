import { RegisterRole, User } from '@prisma/client';

export interface CreateUser {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  role: RegisterRole;
  organisation_id: number;
  avatar: string | null,
}

export interface UserWithOrg extends User {
  organisation: {
    name: string;
    short_name: string;
  };
}
