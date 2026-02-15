import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUserConfig, setSystemConfig } from '../../store/slices/themeSlice';
import { selectUser } from '../../store/slices/authSlice';
import { adminApi } from '../../utils/api';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // Load System Config
  useEffect(() => {
    const loadSystemConfig = async () => {
      try {
        const res: any = await adminApi.getGlobalTheme();
        if (res.data.themeConfig) {
          const config = JSON.parse(res.data.themeConfig);
          dispatch(setSystemConfig(config));
        }
      } catch (e) {
        // System config is optional, ignore errors
        console.debug("No system theme config available", e);
      }
    };
    loadSystemConfig();
  }, [dispatch]);

  // Load User Config
  useEffect(() => {
    if (user && user.themeConfig) {
      try {
        const config = JSON.parse(user.themeConfig);
        dispatch(setUserConfig(config));
      } catch (e) {
        console.error("Failed to parse user theme config", e);
      }
    } else {
        // If user logs out, reset user config
        dispatch(setUserConfig(null));
    }
  }, [user, dispatch]);

  // Apply CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Background vars
    if (theme.background.type === 'image') {
        root.style.setProperty('--ink-bg-image', `url(${theme.background.url})`);
        root.style.setProperty('--ink-bg-video-display', 'none');
    } else {
        root.style.setProperty('--ink-bg-image', 'none');
        root.style.setProperty('--ink-bg-video-display', 'block');
    }
    root.style.setProperty('--ink-bg-opacity', theme.background.opacity?.toString() || '0.1');
    if (theme.background.overlay) {
        root.style.setProperty('--ink-bg-overlay', theme.background.overlay);
    }

    // Ink vars
    root.style.setProperty('--ink-primary-color', theme.ink.primaryColor);
    root.style.setProperty('--ink-stroke-width', theme.ink.strokeWidth);
    root.style.setProperty('--ink-font-family', theme.ink.fontFamily);
    
  }, [theme]);

  return <>{children}</>;
};
