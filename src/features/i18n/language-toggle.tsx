import { Pressable, Text, View } from "react-native";

import { radius, useThemedStyles, type Palette } from "@/theme";
import { LOCALES, useI18n } from "./i18n-context";

/** Segmented العربية / English switch, mirroring the theme toggle. */
export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.track}>
      {LOCALES.map((option) => {
        const isActive = option.code === locale;

        return (
          <Pressable
            key={option.code}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
            onPress={() => setLocale(option.code)}
            style={[styles.segment, isActive && styles.segmentActive]}>
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
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: colors.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.surface,
  },
});
