import { View } from "react-native";

import { radius, shadow, spacing, useThemedStyles, type Palette } from "@/theme";
import type { PrayerDay } from "../types";
import { PrayerCardHeader } from "./prayer-card-header";
import { PrayerRow } from "./prayer-row";
import { PrayerTableHeader } from "./prayer-table-header";

type Props = {
  day: PrayerDay;
  onChangeLocation?: () => void;
};

export function PrayerTimesCard({ day, onChangeLocation }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <PrayerCardHeader
        location={day.location}
        weekday={day.weekday}
        onChangeLocation={onChangeLocation}
      />
      <PrayerTableHeader />
      {day.prayers.map((prayer) => (
        <PrayerRow key={prayer.name} prayer={prayer} />
      ))}
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.card,
    // Clips the table header and the highlighted row to the rounded corners.
    overflow: "hidden" as const,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
