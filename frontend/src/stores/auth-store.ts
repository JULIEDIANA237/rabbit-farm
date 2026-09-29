
'use client';

import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/lib/auth-storage';

import type {
  AuthState,
  AuthUser,
  JwtPayload,
} from '@/types/auth';

interface AuthActions {
  login: (accessToken: string, fallbackUser?: Partial<AuthUser>) => void;
  logout: () => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

function buildUser(
  accessToken: string,
  fallbackUser?: Partial<AuthUser>,
): AuthUser {
  const payload = jwtDecode<JwtPayload>(accessToken);

  return {
    userId: payload.sub ?? fallbackUser?.userId ?? '',
    email: payload.email ?? fallbackUser?.email ?? '',
    farmId: payload.farmId ?? fallbackUser?.farmId ?? '',
    role: payload.role ?? fallbackUser?.role ?? '',
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  login: (accessToken, fallbackUser) => {
    const user = buildUser(accessToken, fallbackUser);

    setAccessToken(accessToken);

    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    removeAccessToken();

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return;
    }

    try {
      const user = buildUser(accessToken);

      if (user) {
        set({
          accessToken,
          user,
          isAuthenticated: true,
        });
      }
    } catch {
      removeAccessToken();

      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
