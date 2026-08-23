import { StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/features/i18n";
import { spacing, useThemedStyles, type Palette } from "@/theme";
import { useColumns } from "./columns";

export function PrayerTableHeader() {
  const styles = useThemedStyles(createStyles);
  const columns = useColumns();
  const { t, isRTL } = useI18n();
  const align = { textAlign: isRTL ? ("right" as const) : ("left" as const) };

  return (
    <View style={[styles.header, isRTL && styles.headerRTL]}>
      <Text style={[styles.label, align, columns.name]}>{t("home.columns.prayer")}</Text>
      <Text style={[styles.label, align, columns.adhan]}>{t("home.columns.adhan")}</Text>
      {columns.showIqamah && (
        <Text style={[styles.label, align, columns.iqamah]}>{t("home.columns.iqamah")}</Text>
      )}
      <Text style={[styles.label, align, columns.status]}>{t("home.columns.status")}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  header: {
    flexDirection: "row" as const,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.sm,
    // Matches the rows' reserved accent-bar width so the columns line up.
    paddingHorizontal: spacing.xl + 3,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  headerRTL: {
    flexDirection: "row-reverse" as const,
  },
  label: {
    fontSize: 10,
    fontWeight: "700" as const,
    letterSpacing: 0.8,
    color: colors.textFaint,
  },
});
