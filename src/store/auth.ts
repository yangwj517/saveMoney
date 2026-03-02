/**
 * 攒钱记账 - 认证状态管理
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const TOKEN_KEY = 'auth_tokens';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setTokens: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    AsyncStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({ accessToken, refreshToken })
    ).catch(() => {});
  },

  setUser: (user: User) => {
    set({ user });
    AsyncStorage.setItem('auth_user', JSON.stringify(user)).catch(() => {});
  },

  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
    AsyncStorage.multiRemove([TOKEN_KEY, 'auth_user']).catch(() => {});
  },

  hydrate: async () => {
    try {
      const [tokensStr, userStr] = await AsyncStorage.multiGet([
        TOKEN_KEY,
        'auth_user',
      ]);
      const tokens = tokensStr[1] ? JSON.parse(tokensStr[1]) : null;
      const user = userStr[1] ? JSON.parse(userStr[1]) : null;

      if (tokens?.accessToken) {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));

