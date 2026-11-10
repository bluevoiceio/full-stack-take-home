import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '@/types/api-types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  signIn: (session: { accessToken: string; user: User }) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      user: null,
      signIn: ({ accessToken, user }) => set({ accessToken, user }),
      signOut: () => set({ accessToken: null, user: null }),
    }),
    { name: 'take-home-admin-auth' },
  ),
);
