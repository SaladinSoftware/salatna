import { Pressable, Text, View } from "react-native";

import { formatWeekday, useI18n } from "@/features/i18n";
import { radius, scaled, spacing, useLayout, useThemedStyles, type Palette } from "@/theme";

type Props = {
  location: string;
  /** ISO date; the weekday label is derived per locale. */
  date: string;
  onChangeLocation?: () => void;
};

export function PrayerCardHeader({ location, date, onChangeLocation }: Props) {
  const styles = useThemedStyles(createStyles);
  const { t, isRTL } = useI18n();
  const { scale } = useLayout();

  const row = isRTL && styles.rowRTL;
  const align = { textAlign: isRTL ? ("right" as const) : ("left" as const) };

  return (
    <View style={styles.header}>
      <View style={[styles.titleRow, row]}>
        <Text style={[styles.title, align, { fontSize: scaled(21, scale) }]} numberOfLines={2}>
          {t("home.title")}
        </Text>
        <View style={styles.weekdayPill}>
          <Text style={styles.weekday}>{formatWeekday(date, t)}</Text>
        </View>
      </View>

      <View style={[styles.locationRow, row]}>
        <Text style={styles.pin}>📍</Text>
        <Text style={[styles.location, align]} numberOfLines={1}>
          {location}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.change")}
          onPress={onChangeLocation}
          hitSlop={8}
          style={styles.changeButton}>
          <Text style={styles.change}>{t("common.change")}</Text>
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
  rowRTL: {
    flexDirection: "row-reverse" as const,
  },
  title: {
    flex: 1,
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
    marginHorizontal: spacing.xs,
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
