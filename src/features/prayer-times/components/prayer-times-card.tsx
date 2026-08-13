import { StyleSheet, View } from "react-native";

import { colors } from "@/theme";
import type { PrayerDay } from "../types";
import { PrayerCardHeader } from "./prayer-card-header";
import { PrayerRow } from "./prayer-row";
import { PrayerTableHeader } from "./prayer-table-header";

type Props = {
  day: PrayerDay;
  onChangeLocation?: () => void;
};

export function PrayerTimesCard({ day, onChangeLocation }: Props) {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
  },
});
