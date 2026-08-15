import { StyleSheet, Text, View } from "react-native";

import { spacing, useThemedStyles, type Palette } from "@/theme";
import { columns } from "./columns";

export function PrayerTableHeader() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.header}>
      <Text style={[styles.label, columns.name]}>PRAYER</Text>
      <Text style={[styles.label, columns.adhan]}>ADHAN</Text>
      <Text style={[styles.label, columns.iqamah]}>IQAMAH</Text>
      <Text style={[styles.label, columns.status]}>STATUS</Text>
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  header: {
    flexDirection: "row" as const,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.sm,
    // Matches the rows' reserved accent-bar width so the columns line up.
    paddingLeft: spacing.xl + 3,
    paddingRight: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  label: {
    fontSize: 10,
    fontWeight: "700" as const,
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
});
