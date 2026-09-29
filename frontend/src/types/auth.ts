
export interface JwtPayload {
  sub: string;
  email: string;
  farmId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  userId: string;
  email: string;
  farmId: string;
  role: string;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

