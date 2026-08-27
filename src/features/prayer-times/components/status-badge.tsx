import { StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/features/i18n";
import { radius, useTheme, type Palette } from "@/theme";
import type { PrayerStatus } from "../types";

const variantFor = (colors: Palette): Record<PrayerStatus, { bg: string; fg: string }> => ({
  current: { bg: colors.accent, fg: colors.onAccent },
  upcoming: { bg: colors.accentSoft, fg: colors.accentSoftText },
  passed: { bg: colors.surfaceMuted, fg: colors.textFaint },
});

type Props = {
  status: PrayerStatus;
};

export function StatusBadge({ status }: Props) {
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const variant = variantFor(colors)[status];

  return (
    <View style={[styles.badge, { backgroundColor: variant.bg }]}>
      {/* Letter-spacing breaks Arabic letter joining, so it is Latin-only. */}
      <Text
        style={[styles.label, !isRTL && styles.labelTracked, { color: variant.fg }]}
        numberOfLines={1}>
        {t(`status.${status}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // No alignSelf: the table column decides which edge the badge sits on.
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
  },
  labelTracked: {
    letterSpacing: 0.5,
  },
});
