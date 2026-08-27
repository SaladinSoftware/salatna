import { router } from "expo-router";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AboutCard } from "@/features/about";
import { LanguageToggle, useI18n } from "@/features/i18n";
import { useLocation } from "@/features/location";
import { NextPrayerHero, PrayerTimesCard, usePrayerTimes } from "@/features/prayer-times";
import {
  radius,
  scaled,
  spacing,
  ThemeToggle,
  useLayout,
  useTheme,
  useThemedStyles,
  type Palette,
} from "@/theme";

export default function PrayerTimesScreen() {
  const { place, isLocating } = useLocation();
  const { day, tomorrow, isLoading, isRefreshing, error, reload } = usePrayerTimes(
    place.coordinates,
    place.label,
  );
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const { gutter, scale, isWide, maxContentWidth } = useLayout();
  const styles = useThemedStyles(createStyles);

  const isFirstLoad = isLocating || isLoading;
  const rowDirection = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };
  const content = [
    styles.content,
    { paddingHorizontal: gutter, maxWidth: maxContentWidth, alignSelf: "center" as const },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={reload}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }>
        <View style={content}>
          <View style={[styles.brandRow, rowDirection]}>
            <View style={styles.brandBlock}>
              <Text style={[styles.brand, { fontSize: scaled(28, scale) }]}>{t("app.brand")}</Text>
              <Text style={styles.tagline}>{t("app.tagline")}</Text>
            </View>
            {/* Decorative only — refreshing is handled by pull-to-refresh. */}
            <Image
              source={require("../../assets/images/logo-glow.png")}
              style={styles.logo}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
          </View>

          <View style={[styles.toolbar, rowDirection, isWide && styles.toolbarWide]}>
            <ThemeToggle />
            <LanguageToggle />
          </View>

          {isFirstLoad && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.message}>
                {isLocating ? t("home.locating") : t("home.loading")}
              </Text>
            </View>
          )}

          {!isFirstLoad && error && !day && (
            <View style={styles.centered}>
              <Text style={styles.message}>{t("home.errorTitle")}</Text>
              <Text style={styles.detail}>{error}</Text>
              <Pressable style={styles.retry} onPress={reload}>
                <Text style={styles.retryText}>{t("common.retry")}</Text>
              </Pressable>
            </View>
          )}

          {!isFirstLoad && day && (
            <>
              {error && <Text style={styles.banner}>{t("home.staleBanner")}</Text>}
              <View style={{ marginTop: gutter }}>
                <NextPrayerHero day={day} tomorrow={tomorrow} />
              </View>
              <PrayerTimesCard day={day} onChangeLocation={() => router.push("/pick-location")} />
            </>
          )}

          <AboutCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  scroll: {
    paddingBottom: 40,
  },
  content: {
    width: "100%" as const,
  },
  brandRow: {
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  brandBlock: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontWeight: "800" as const,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
  },
  toolbar: {
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  toolbarWide: {
    justifyContent: "flex-start" as const,
    gap: spacing.lg,
  },
  logo: {
    width: 76,
    height: 76,
  },
  centered: {
    alignItems: "center" as const,
    gap: spacing.md,
    paddingVertical: 80,
  },
  message: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center" as const,
  },
  detail: {
    fontSize: 13,
    color: colors.textFaint,
    textAlign: "center" as const,
  },
  banner: {
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
