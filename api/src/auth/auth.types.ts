import { Role } from '@prisma/client';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};
