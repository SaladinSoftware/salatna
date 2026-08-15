import { StyleSheet, Text, View } from "react-native";

import { spacing, useThemedStyles, type Palette } from "@/theme";
import type { Prayer } from "../types";
import { columns } from "./columns";
import { StatusBadge } from "./status-badge";

type Props = {
  prayer: Prayer;
};

export function PrayerRow({ prayer }: Props) {
  const styles = useThemedStyles(createStyles);
  const isCurrent = prayer.status === "current";
  const isPassed = prayer.status === "passed";

  return (
    <View style={[styles.row, isCurrent && styles.rowCurrent]}>
      <Text
        style={[styles.cell, styles.name, isPassed && styles.dimmed, columns.name]}
        numberOfLines={1}>
        {prayer.name}
      </Text>
      <Text style={[styles.cell, isPassed && styles.dimmed, columns.adhan]}>{prayer.adhan}</Text>
      <Text style={[styles.cell, styles.cellMuted, columns.iqamah]}>{prayer.iqamah}</Text>
      <View style={columns.status}>
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
  },
  rowCurrent: {
    backgroundColor: colors.surfaceHighlight,
    borderLeftColor: colors.accent,
  },
  cell: {
    fontSize: 15,
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
