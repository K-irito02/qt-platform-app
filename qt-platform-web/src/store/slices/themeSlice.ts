import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

export interface ThemeConfig {
  background: {
    type: 'video' | 'image';
    url: string;
    opacity?: number;
    overlay?: string;
  };
  ink: {
    primaryColor: string;
    strokeWidth: string;
    fontFamily: string;
  };
}

// Default Ink Wash Config
export const defaultTheme: ThemeConfig = {
  background: {
    type: 'image',
    url: '/assets/ink/mountains.svg', // Default
    opacity: 0.1,
    overlay: 'url(/assets/paper-texture.png)',
  },
  ink: {
    primaryColor: '#8B0000', // Vermilion (Cinnabar)
    strokeWidth: '2px',
    fontFamily: '"Ma Shan Zheng", cursive, "Noto Serif SC", serif',
  },
};

interface ThemeState {
  userConfig: Partial<ThemeConfig> | null;
  systemConfig: Partial<ThemeConfig> | null;
  currentTheme: ThemeConfig;
}

const initialState: ThemeState = {
  userConfig: null,
  systemConfig: null,
  currentTheme: defaultTheme,
};

// Helper to merge configs deeply
const mergeThemes = (base: ThemeConfig, ...overrides: (Partial<ThemeConfig> | null)[]): ThemeConfig => {
  let result = { ...base };
  overrides.forEach(override => {
    if (!override) return;
    if (override.background) {
      result.background = { ...result.background, ...override.background };
    }
    if (override.ink) {
      result.ink = { ...result.ink, ...override.ink };
    }
  });
  return result;
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setUserConfig: (state, action: PayloadAction<Partial<ThemeConfig> | null>) => {
      state.userConfig = action.payload;
      state.currentTheme = mergeThemes(defaultTheme, state.systemConfig, state.userConfig);
    },
    setSystemConfig: (state, action: PayloadAction<Partial<ThemeConfig> | null>) => {
      state.systemConfig = action.payload;
      state.currentTheme = mergeThemes(defaultTheme, state.systemConfig, state.userConfig);
    },
  },
});

export const { setUserConfig, setSystemConfig } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme.currentTheme;

export default themeSlice.reducer;
