import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

type Props = {
  location: string;
  weekday: string;
  onChangeLocation?: () => void;
};

export function PrayerCardHeader({ location, weekday, onChangeLocation }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.details}>
        <Text style={styles.title}>Today&apos;s Prayer Times</Text>

        <View style={styles.locationRow}>
          <Text style={styles.pin}>📍</Text>
          <Text style={styles.location}>{location}</Text>
          <Pressable onPress={onChangeLocation} hitSlop={8}>
            <Text style={styles.change}>Change</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.weekday}>🗓 {weekday}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.xl,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  pin: {
    fontSize: 12,
  },
  location: {
    fontSize: 14,
    color: colors.textMuted,
  },
  change: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
  },
  weekday: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
