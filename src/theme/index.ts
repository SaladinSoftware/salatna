export const colors = {
  screen: "#f1f5f9",
  surface: "#ffffff",
  surfaceMuted: "#f8fafc",
  surfaceHighlight: "#f0fdf4",
  border: "#f1f5f9",

  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#64748b",
  textFaint: "#94a3b8",

  accent: "#22c55e",
  accentSoft: "#dcfce7",
  accentSoftText: "#86efac",
  onAccent: "#ffffff",
} as const;

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
