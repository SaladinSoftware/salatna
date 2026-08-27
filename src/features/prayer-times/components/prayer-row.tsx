import { StyleSheet, Text, View } from "react-native";

import { formatTime, useI18n } from "@/features/i18n";
import { scaled, spacing, useLayout, useThemedStyles, type Palette } from "@/theme";
import type { Prayer, PrayerStatus } from "../types";
import { useColumns } from "./columns";
import { StatusBadge } from "./status-badge";

type Props = {
  prayer: Prayer;
  /** Derived from the clock by the card, not sent by the API. */
  status: PrayerStatus;
};

export function PrayerRow({ prayer, status }: Props) {
  const styles = useThemedStyles(createStyles);
  const columns = useColumns();
  const { scale } = useLayout();
  const { t, isRTL } = useI18n();

  const isCurrent = status === "current";
  const isPassed = status === "passed";
  const size = { fontSize: scaled(18, scale) };

  // Keyed by column so the cells can never drift out of the header's order.
  const cells = {
    name: (
      <Text
        style={[styles.cell, styles.name, size, isPassed && styles.dimmed]}
        numberOfLines={1}>
        {t(`prayers.${prayer.name}`)}
      </Text>
    ),
    adhan: (
      <Text style={[styles.cell, size, isPassed && styles.dimmed]}>
        {formatTime(prayer.time24, t)}
      </Text>
    ),
    status: <StatusBadge status={status} />,
  };

  return (
    <View
      style={[
        styles.row,
        isRTL && styles.rowRTL,
        isCurrent && styles.rowCurrent,
        isCurrent && isRTL && styles.rowCurrentRTL,
      ]}>
      {columns.map((column) => (
        <View key={column.key} style={column.style}>
          {cells[column.key]}
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: spacing.lg,
    // Plus the 3px accent-bar border below, this lands on the card header's inset.
    paddingHorizontal: spacing.xl - 3,
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
});
