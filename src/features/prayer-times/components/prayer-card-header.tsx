import { Pressable, Text, View } from "react-native";

import { radius, spacing, useThemedStyles, type Palette } from "@/theme";

type Props = {
  location: string;
  weekday: string;
  onChangeLocation?: () => void;
};

export function PrayerCardHeader({ location, weekday, onChangeLocation }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Today&apos;s Prayer Times</Text>
        <View style={styles.weekdayPill}>
          <Text style={styles.weekday}>{weekday}</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <Text style={styles.pin}>📍</Text>
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onChangeLocation}
          hitSlop={8}
          style={styles.changeButton}>
          <Text style={styles.change}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  header: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  weekdayPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  weekday: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.xs,
  },
  pin: {
    fontSize: 12,
  },
  location: {
    flexShrink: 1,
    fontSize: 14,
    color: colors.textMuted,
  },
  changeButton: {
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  change: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: colors.accentSoftText,
  },
});
