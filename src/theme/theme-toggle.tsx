import { Pressable, Text, View } from "react-native";

import type { Palette } from "./palettes";
import { useTheme, useThemedStyles, type ThemeMode } from "./theme-context";

const OPTIONS: { mode: ThemeMode; icon: string; label: string }[] = [
  { mode: "light", icon: "☀️", label: "Light" },
  { mode: "dark", icon: "🌙", label: "Dark" },
];

/** Segmented Light / Dark switch. */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.track}>
      {OPTIONS.map((option) => {
        const isActive = option.mode === mode;

        return (
          <Pressable
            key={option.mode}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${option.label} theme`}
            onPress={() => setMode(option.mode)}
            style={[styles.segment, isActive && styles.segmentActive]}>
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  track: {
    flexDirection: "row" as const,
    alignSelf: "flex-start" as const,
    padding: 4,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: colors.textPrimary,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.surface,
  },
});
