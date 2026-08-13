import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";
import { columns } from "./columns";

export function PrayerTableHeader() {
  return (
    <View style={styles.header}>
      <Text style={[styles.label, columns.name]}>PRAYER</Text>
      <Text style={[styles.label, columns.adhan]}>ADHAN</Text>
      <Text style={[styles.label, columns.iqamah]}>IQAMAH</Text>
      <Text style={[styles.label, columns.status]}>STATUS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textFaint,
  },
});
