import { Text, View } from "react-native";

import { formatCountdown, formatTime, useI18n } from "@/features/i18n";
import {
  radius,
  scaled,
  shadow,
  spacing,
  useLayout,
  useThemedStyles,
  type Palette,
} from "@/theme";
import { findNextPrayer } from "../next-prayer";
import type { PrayerDay } from "../types";
import { useNow } from "../use-now";

type Props = {
  day: PrayerDay;
};

/**
 * The headline card: which prayer is next, at what time, and a live countdown.
 * The bar underneath fills across the gap since the previous prayer.
 */
export function NextPrayerHero({ day }: Props) {
  // One tick per second, so the countdown actually counts.
  const now = useNow(1000);
  const styles = useThemedStyles(createStyles);
  const { scale, isWide } = useLayout();
  const { t, isRTL } = useI18n();

  const next = findNextPrayer(day.prayers, now);
  if (!next) return null;

  const isDue = next.secondsAway <= 0;
  const row = isRTL ? ("row-reverse" as const) : ("row" as const);
  const align = isRTL ? ("right" as const) : ("left" as const);

  return (
    <View style={[styles.card, isWide && styles.cardWide]}>
      <View style={[styles.topRow, { flexDirection: row }]}>
        <Text style={[styles.label, { textAlign: align }]}>{t("next.label")}</Text>
        <Text style={[styles.time, { fontSize: scaled(16, scale) }]}>
          {formatTime(next.prayer.time24, t)}
        </Text>
      </View>

      <Text style={[styles.name, { fontSize: scaled(32, scale), textAlign: align }]}>
        {t(`prayers.${next.prayer.name}`)}
      </Text>

      <View style={[styles.countdownRow, { flexDirection: row }]}>
        <Text
          style={[styles.countdown, { fontSize: scaled(isDue ? 28 : 40, scale) }]}
          // The digits change every second; announcing each one is noise.
          accessibilityLiveRegion="none">
          {isDue ? t("next.now") : formatCountdown(next.secondsAway)}
        </Text>
        {!isDue && <Text style={styles.until}>{t("next.until")}</Text>}
      </View>

      <View style={[styles.track, isRTL && styles.trackRTL]}>
        <View style={[styles.fill, { width: `${Math.round(next.progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  card: {
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.accent,
    ...shadow.card,
  },
  cardWide: {
    padding: spacing.xl + spacing.sm,
  },
  topRow: {
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 1,
    color: colors.onAccent,
    opacity: 0.85,
  },
  time: {
    fontWeight: "700" as const,
    color: colors.onAccent,
    opacity: 0.9,
  },
  name: {
    fontWeight: "900" as const,
    letterSpacing: -1,
    color: colors.onAccent,
  },
  countdownRow: {
    alignItems: "baseline" as const,
    gap: spacing.sm,
  },
  countdown: {
    fontWeight: "800" as const,
    // Tabular-ish spacing so the digits do not jitter as they tick.
    fontVariant: ["tabular-nums" as const],
    letterSpacing: 1,
    color: colors.onAccent,
  },
  until: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.onAccent,
    opacity: 0.8,
  },
  track: {
    height: 6,
    marginTop: spacing.xs,
    borderRadius: radius.pill,
    overflow: "hidden" as const,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  trackRTL: {
    // Mirrors the fill so it grows from the right edge in Arabic.
    transform: [{ scaleX: -1 }],
  },
  fill: {
    height: "100%" as const,
    borderRadius: radius.pill,
    backgroundColor: colors.onAccent,
  },
});
