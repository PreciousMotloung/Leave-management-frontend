export type UserRole = 'EMPLOYEE' | 'MANAGER';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

