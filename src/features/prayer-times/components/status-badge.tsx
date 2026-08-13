import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "@/theme";
import type { PrayerStatus } from "../types";

const variants: Record<PrayerStatus, { bg: string; fg: string }> = {
  current: { bg: colors.accent, fg: colors.onAccent },
  upcoming: { bg: colors.accentSoft, fg: colors.accentSoftText },
  passed: { bg: colors.surfaceMuted, fg: colors.textFaint },
};

type Props = {
  status: PrayerStatus;
};

export function StatusBadge({ status }: Props) {
  const variant = variants[status];

  return (
    <View style={[styles.badge, { backgroundColor: variant.bg }]}>
      <Text style={[styles.label, { color: variant.fg }]}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
