import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { darkPalette, lightPalette, type Palette } from "./palettes";

export type ThemeMode = "light" | "dark";

type ThemeValue = {
  mode: ThemeMode;
  colors: Palette;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === "dark" ? "dark" : "light");

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      colors: mode === "dark" ? darkPalette : lightPalette,
      setMode,
      toggleMode: () => setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside a ThemeProvider");
  return value;
}

/**
 * Builds a stylesheet from the active palette and caches one sheet per palette,
 * so switching themes re-creates styles only once instead of on every render.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: Palette) => T,
): T {
  const { colors } = useTheme();
  // `factory` is a module-level function per call site, so the palette is the only real input.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
}
