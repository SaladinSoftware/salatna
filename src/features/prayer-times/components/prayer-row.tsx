import { StyleSheet, Text, View } from "react-native";

import { formatTime, useI18n } from "@/features/i18n";
import { scaled, spacing, useLayout, useThemedStyles, type Palette } from "@/theme";
import type { Prayer } from "../types";
import { useColumns } from "./columns";
import { StatusBadge } from "./status-badge";

type Props = {
  prayer: Prayer;
};

export function PrayerRow({ prayer }: Props) {
  const styles = useThemedStyles(createStyles);
  const columns = useColumns();
  const { scale } = useLayout();
  const { t, isRTL } = useI18n();

  const isCurrent = prayer.status === "current";
  const isPassed = prayer.status === "passed";
  const time = formatTime(prayer.time24, t);
  const align = { textAlign: isRTL ? ("right" as const) : ("left" as const) };
  const size = { fontSize: scaled(15, scale) };

  return (
    <View
      style={[
        styles.row,
        isRTL && styles.rowRTL,
        isCurrent && styles.rowCurrent,
        isCurrent && isRTL && styles.rowCurrentRTL,
      ]}>
      <Text
        style={[styles.cell, styles.name, size, align, isPassed && styles.dimmed, columns.name]}
        numberOfLines={1}>
        {t(`prayers.${prayer.name}`)}
      </Text>
      <Text style={[styles.cell, size, align, isPassed && styles.dimmed, columns.adhan]}>
        {time}
      </Text>
      {columns.showIqamah && (
        <Text style={[styles.cell, styles.cellMuted, size, align, columns.iqamah]}>{time}</Text>
      )}
      <View style={[columns.status, isRTL && styles.statusRTL]}>
        <StatusBadge status={prayer.status} />
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    // Reserved so the accent bar on the current row doesn't shift the columns.
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    borderRightWidth: 3,
    borderRightColor: "transparent",
  },
  rowRTL: {
    flexDirection: "row-reverse" as const,
  },
  rowCurrent: {
    backgroundColor: colors.surfaceHighlight,
    borderLeftColor: colors.accent,
  },
  rowCurrentRTL: {
    borderLeftColor: "transparent",
    borderRightColor: colors.accent,
  },
  statusRTL: {
    alignItems: "flex-end" as const,
  },
  cell: {
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  name: {
    fontWeight: "700" as const,
  },
  dimmed: {
    color: colors.textSecondary,
  },
  cellMuted: {
    fontWeight: "500" as const,
    color: colors.textFaint,
  },
});
