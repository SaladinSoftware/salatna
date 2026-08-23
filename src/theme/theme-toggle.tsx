import { Pressable, Text, View } from "react-native";

import { useI18n } from "@/features/i18n";

import type { Palette } from "./palettes";
import { useTheme, useThemedStyles, type ThemeMode } from "./theme-context";

const OPTIONS: { mode: ThemeMode; icon: string; key: string }[] = [
  { mode: "light", icon: "☀️", key: "settings.light" },
  { mode: "dark", icon: "🌙", key: "settings.dark" },
];

/** Segmented Light / Dark switch. */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const { t } = useI18n();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.track}>
      {OPTIONS.map((option) => {
        const isActive = option.mode === mode;
        const label = t(option.key);

        return (
          <Pressable
            key={option.mode}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            onPress={() => setMode(option.mode)}
            style={[styles.segment, isActive && styles.segmentActive]}>
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
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
