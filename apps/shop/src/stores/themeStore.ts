// ================================================================
// 테마 시스템 Zustand 스토어
// localStorage 영속화 + 시스템 설정(prefers-color-scheme) 감지
// ================================================================

import { create } from 'zustand';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'jinu-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  // 1. localStorage에 저장된 값 우선
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  // 2. 시스템 설정 확인
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

  // 3. 기본값
  return 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light', // SSR-safe default; hydrated in ThemeProvider

  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    set({ theme: next });
  },
}));

/** Call once on client mount to hydrate the store from localStorage / system pref */
export function hydrateTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);
  useThemeStore.setState({ theme });
}
