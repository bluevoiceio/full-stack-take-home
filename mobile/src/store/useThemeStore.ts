import { create } from 'zustand';

import { Colors, Theme, ThemeColors } from '../constants/Colors';

interface ThemeState {
  theme: Theme;
  themeColors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: 'light',
  themeColors: Colors.light,
  setTheme: theme => set({ theme, themeColors: Colors[theme] }),
  toggleTheme: () => get().setTheme(get().theme === 'light' ? 'dark' : 'light'),
}));
