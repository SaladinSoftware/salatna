import { router } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocation } from "@/features/location";
import { PrayerTimesCard, usePrayerTimes } from "@/features/prayer-times";
import { radius, spacing, ThemeToggle, useTheme, useThemedStyles, type Palette } from "@/theme";

export default function PrayerTimesScreen() {
  const { place, isLocating } = useLocation();
  const { day, isLoading, isRefreshing, error, reload } = usePrayerTimes(
    place.coordinates,
    place.label,
  );
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const isFirstLoad = isLocating || isLoading;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={reload}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Tazkir</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Refresh prayer times"
            onPress={reload}
            disabled={isFirstLoad || isRefreshing}
            hitSlop={8}
            style={styles.refresh}>
            <Text style={styles.refreshIcon}>⟳</Text>
          </Pressable>
        </View>

        <View style={styles.toolbar}>
          <ThemeToggle />
        </View>

        {isFirstLoad && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.message}>
              {isLocating ? "Finding your location…" : "Loading prayer times…"}
            </Text>
          </View>
        )}

        {!isFirstLoad && error && !day && (
          <View style={styles.centered}>
            <Text style={styles.message}>Couldn&apos;t load prayer times.</Text>
            <Text style={styles.detail}>{error}</Text>
            <Pressable style={styles.retry} onPress={reload}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {!isFirstLoad && day && (
          <>
            {error && <Text style={styles.banner}>Showing saved times — refresh failed.</Text>}
            <PrayerTimesCard day={day} onChangeLocation={() => router.push("/pick-location")} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  brandRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: spacing.xl,
    paddingTop: 32,
  },
  brand: {
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  toolbar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  refresh: {
    width: 40,
    height: 40,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  refreshIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  centered: {
    alignItems: "center" as const,
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
    textAlign: "center" as const,
  },
  banner: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textMuted,
  },
  retry: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  retryText: {
    color: colors.onAccent,
    fontWeight: "700" as const,
  },
});
