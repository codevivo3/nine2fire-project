/**
 * PURPOSE:
 * Shared theme primitives used by the document bootstrap and client controls.
 *
 * NOTES:
 * - The root layout handles the no-flash initialization path before hydration.
 * - Client components reuse these helpers afterward so theme class management
 *   stays consistent in one place.
 */
export type ThemeMode = "light" | "dark" | "system";
export type AppliedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_EVENT = "nine2fire-theme-change";

export function getSystemTheme(): AppliedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system" ? storedTheme : null;
}

export function setStoredTheme(theme: AppliedTheme) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function resolveTheme(theme: ThemeMode): AppliedTheme {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

export function getCurrentTheme(): AppliedTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  const resolvedTheme = resolveTheme(theme);

  // `html` is the single theme source of truth for CSS token switching.
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(resolvedTheme);
  html.setAttribute("data-theme", resolvedTheme);
}
