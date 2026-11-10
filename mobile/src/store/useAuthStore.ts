import { create } from 'zustand';

import { User } from '../constants/types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  signIn: (session: { accessToken: string; user: User }) => void;
  signOut: () => void;
}

// Held in memory only, so the app asks who you are on every launch.
export const useAuthStore = create<AuthState>()(set => ({
  accessToken: null,
  user: null,
  signIn: ({ accessToken, user }) => set({ accessToken, user }),
  signOut: () => set({ accessToken: null, user: null }),
}));
