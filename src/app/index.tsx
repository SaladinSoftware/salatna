import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDeviceLocation } from "@/features/location";
import { PrayerTimesCard, usePrayerTimes } from "@/features/prayer-times";
import { colors, radius, spacing } from "@/theme";

export default function HomeScreen() {
  const { place, isLocating, isFallback, retry } = useDeviceLocation();
  const { day, isLoading, error, reload } = usePrayerTimes(place.coordinates, place.label);

  const isBusy = isLocating || isLoading;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView style={styles.screen}>
        {isBusy && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.message}>
              {isLocating ? "Finding your location…" : "Loading prayer times…"}
            </Text>
          </View>
        )}

        {!isBusy && error && (
          <View style={styles.centered}>
            <Text style={styles.message}>Couldn&apos;t load prayer times.</Text>
            <Text style={styles.detail}>{error}</Text>
            <Pressable style={styles.retry} onPress={reload}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {!isBusy && day && (
          <>
            <PrayerTimesCard day={day} onChangeLocation={retry} />
            {isFallback && (
              <Text style={styles.notice}>
                Using a default location. Tap Change to allow location access.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centered: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: 80,
  },
  message: {
    fontSize: 15,
    color: colors.textMuted,
  },
  detail: {
    fontSize: 13,
    color: colors.textFaint,
    textAlign: "center",
  },
  notice: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    fontSize: 13,
    textAlign: "center",
    color: colors.textFaint,
  },
  retry: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  retryText: {
    color: colors.onAccent,
    fontWeight: "700",
  },
});
