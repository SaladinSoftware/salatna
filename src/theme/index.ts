export const spacing = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const radius = {
  card: 20,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

export { darkPalette, lightPalette, type Palette } from "./palettes";
export { ThemeProvider, useTheme, useThemedStyles, type ThemeMode } from "./theme-context";
export { ThemeToggle } from "./theme-toggle";
