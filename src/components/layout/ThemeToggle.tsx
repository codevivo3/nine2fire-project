'use client';
/**
 * PURPOSE:
 * Renders the theme toggle and exposes a small shared theme state hook.
 *
 * NOTES:
 * - The root layout applies the initial persisted-or-system theme before
 *   hydration; this hook keeps client state in sync afterward.
 * - A custom event keeps separate client components in sync without introducing
 *   a larger global state layer for a tiny concern.
 */

import * as React from 'react';
import {
  applyTheme,
  getCurrentTheme,
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
  THEME_EVENT,
  type AppliedTheme,
} from '@/lib/theme';

// Exposes the current theme and a synchronized toggle action for UI controls.
export function useTheme() {
  const [theme, setTheme] = React.useState<AppliedTheme>(() => getCurrentTheme());

  React.useEffect(() => {
    // Align client state with the persisted-or-system theme already applied by the root layout.
    const storedTheme = getStoredTheme();
    const initialTheme =
      storedTheme && storedTheme !== 'system'
        ? storedTheme
        : getCurrentTheme();

    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  React.useEffect(() => {
    const sync = () => setTheme(getCurrentTheme());

    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemTheme = () => {
      const storedTheme = getStoredTheme();

      // System changes should only affect visitors who have not saved a theme preference.
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return;
      }

      const currentTheme = getSystemTheme();
      applyTheme(currentTheme);
      window.dispatchEvent(new Event(THEME_EVENT));
      setTheme(currentTheme);
    };

    syncSystemTheme();
    mediaQuery.addEventListener('change', syncSystemTheme);

    return () => mediaQuery.removeEventListener('change', syncSystemTheme);
  }, []);

  // Persist the selected theme and notify all mounted controls in the session.
  const setMode = (next: AppliedTheme) => {
    setStoredTheme(next);
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
    setTheme(next);
  };

  // Flips between the two supported theme modes.
  const toggleTheme = () => {
    setMode(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    isLight: theme === 'light',
    toggleTheme,
  };
}

export function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();

  // The switch keeps the motion on transforms so the control does not shift layout.
  return (
    <button
      onClick={toggleTheme}
      aria-label='Toggle theme'
      aria-pressed={isLight}
      className='relative inline-flex h-6 w-12 items-center rounded-full border border-border-token bg-surface transition-all'
      style={{
        boxShadow: isLight
          ? 'inset 0 2px 3px rgba(0,0,0,0.7), inset 0 -0.5px 3px var(--color-accent), 0 1.5px 2px 1px var(--color-secondary)'
          : 'inset 0 2px 3px rgba(0,0,0,1), inset 0 -2px 2px rgba(255,255,255,0.33), 0 0 3px 1px var(--color-accent)',
      }}
    >
      <span className='relative inline-flex h-full w-full items-center'>
        <span
          className='relative z-10 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full transition-all duration-[150ms]'
          style={{
            backgroundColor: isLight
              ? 'var(--color-accent)'
              : 'var(--color-primary)',
            boxShadow: isLight
              ? 'inset 0 2px 3px rgba(255,255,255,0.2), inset 0 -2px 3px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.25), 0 0 4px var(--color-primary)'
              : 'inset 0 2px 3px rgba(255,255,255,0.05), inset 0 -2px 3px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.6), 0 0 4px var(--color-accent)',
            transform: isLight ? 'translateX(26px)' : 'translateX(2px)',
          }}
        >
          <span
            className='absolute h-4 w-4 rounded-full overflow-hidden'
            style={{
              backgroundColor: isLight
                ? 'var(--color-accent)'
                : 'var(--color-primary)',
              boxShadow:
                'inset 0 1px 2px rgba(0,0,0,0.5), 0 2px 3px rgba(0,0,0,0.5)',
            }}
          >
            <span
              className='absolute left-1/2 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full'
              style={{
                backgroundColor: isLight
                  ? 'var(--color-primary)'
                  : 'var(--color-accent)',
                boxShadow: isLight
                  ? '0 0 12px 1px var(--color-primary), 0 0 10px 1px var(--color-primary)'
                  : '0 0 12px 1px var(--color-accent), 0 0 10px 1px var(--color-accent)',
                animation: isLight
                  ? undefined
                  : 'lightPulse 2.5s ease-in-out infinite',
              }}
            />
          </span>
        </span>
      </span>
    </button>
  );
}
