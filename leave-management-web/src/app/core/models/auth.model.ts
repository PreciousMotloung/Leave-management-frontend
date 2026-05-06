import { User } from './user.model';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  role: 'EMPLOYEE' | 'MANAGER';
}

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYEE' | 'MANAGER';
  id: number;
  exp: number;
  iat: number;
}

