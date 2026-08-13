import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";
import type { Prayer } from "../types";
import { columns } from "./columns";
import { StatusBadge } from "./status-badge";

type Props = {
  prayer: Prayer;
};

export function PrayerRow({ prayer }: Props) {
  const isCurrent = prayer.status === "current";

  return (
    <View style={[styles.row, isCurrent && styles.rowCurrent]}>
      <Text style={[styles.cell, columns.name]}>{prayer.name}</Text>
      <Text style={[styles.cell, columns.adhan]}>{prayer.adhan}</Text>
      <Text style={[styles.cell, styles.cellMuted, columns.iqamah]}>{prayer.iqamah}</Text>
      <View style={columns.status}>
        <StatusBadge status={prayer.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowCurrent: {
    backgroundColor: colors.surfaceHighlight,
  },
  cell: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cellMuted: {
    fontWeight: "500",
    color: colors.textFaint,
  },
});
