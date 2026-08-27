import { StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/features/i18n";
import { spacing, useThemedStyles, type Palette } from "@/theme";
import { useColumns } from "./columns";

export function PrayerTableHeader() {
  const styles = useThemedStyles(createStyles);
  const columns = useColumns();
  const { t, isRTL } = useI18n();

  return (
    <View style={[styles.header, isRTL && styles.headerRTL]}>
      {columns.map((column) => (
        <View key={column.key} style={column.style}>
          {/* Letter-spacing breaks Arabic letter joining, so it is Latin-only. */}
          <Text style={[styles.label, !isRTL && styles.labelTracked, column.text]}>
            {t(`home.columns.${column.key}`)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  header: {
    flexDirection: "row" as const,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.sm,
    // Matches the card header and the rows' content inset.
    paddingHorizontal: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  headerRTL: {
    flexDirection: "row-reverse" as const,
  },
  label: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: colors.textFaint,
  },
  labelTracked: {
    letterSpacing: 0.8,
  },
});
