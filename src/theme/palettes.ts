/** Every palette exposes the same keys so components never branch on the mode. */
export type Palette = {
  screen: string;
  surface: string;
  surfaceMuted: string;
  surfaceHighlight: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;

  accent: string;
  accentSoft: string;
  accentSoftText: string;
  onAccent: string;
};

export const lightPalette: Palette = {
  screen: "#f1f5f9",
  surface: "#ffffff",
  surfaceMuted: "#f8fafc",
  surfaceHighlight: "#f0fdf4",
  border: "#e2e8f0",

  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#64748b",
  textFaint: "#94a3b8",

  accent: "#22c55e",
  accentSoft: "#dcfce7",
  accentSoftText: "#15803d",
  onAccent: "#ffffff",
};

export const darkPalette: Palette = {
  screen: "#0b1220",
  surface: "#111827",
  surfaceMuted: "#182234",
  surfaceHighlight: "#12291f",
  border: "#243146",

  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  textFaint: "#64748b",

  accent: "#22c55e",
  accentSoft: "#14532d",
  accentSoftText: "#86efac",
  onAccent: "#052e16",
};
