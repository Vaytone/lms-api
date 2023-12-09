import { RegisterRole } from '@prisma/client';

export interface CreateUser {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  role: RegisterRole;
  organisation_id: number;
}
