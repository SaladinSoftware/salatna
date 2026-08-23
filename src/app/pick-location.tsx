import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useI18n } from "@/features/i18n";
import { labelFor, useLocation, usePlaceSearch, type PlaceResult } from "@/features/location";
import {
  radius,
  shadow,
  spacing,
  useLayout,
  useTheme,
  useThemedStyles,
  type Palette,
} from "@/theme";

export default function PickLocationScreen() {
  const { place, selectPlace, followDevice } = useLocation();
  const [query, setQuery] = useState("");

  const { colors } = useTheme();
  const { t, isRTL, locale } = useI18n();
  const { gutter, maxContentWidth } = useLayout();
  const styles = useThemedStyles(createStyles);
  const { results, isSearching, hasFailed } = usePlaceSearch(query, locale);

  const showResults = query.trim().length >= 2;
  const align = { textAlign: isRTL ? ("right" as const) : ("left" as const) };
  const rowDirection = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };

  function handleSelectResult(result: PlaceResult) {
    selectPlace({ coordinates: result.coordinates, label: labelFor(result) });
    router.back();
  }

  function handleUseMyLocation() {
    followDevice();
    router.back();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={[styles.body, { paddingHorizontal: gutter, maxWidth: maxContentWidth }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.titleRow, rowDirection]}>
          <Text style={[styles.title, align]}>{t("location.title")}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.cancel")}
            onPress={() => router.back()}
            hitSlop={8}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        <View style={[styles.searchBar, rowDirection]}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            style={[styles.input, align]}
            value={query}
            onChangeText={setQuery}
            placeholder={t("location.searchPlaceholder")}
            placeholderTextColor={colors.textFaint}
            autoCorrect={false}
            autoFocus
            returnKeyType="search"
            accessibilityLabel={t("location.searchPlaceholder")}
          />
          {isSearching && <ActivityIndicator size="small" color={colors.accent} />}
          {!isSearching && query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              onPress={() => setQuery("")}
              hitSlop={8}>
              <Text style={styles.clear}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Detecting again is the fast path, so it sits above the results. */}
        <Pressable
          accessibilityRole="button"
          onPress={handleUseMyLocation}
          style={[styles.deviceButton, rowDirection]}>
          <Text style={styles.deviceIcon}>📍</Text>
          <Text style={[styles.deviceLabel, align]}>{t("location.useMyLocation")}</Text>
        </Pressable>

        {showResults ? (
          <View style={styles.results}>
            {hasFailed && <Text style={styles.empty}>{t("location.searchFailed")}</Text>}
            {!hasFailed && !isSearching && results.length === 0 && (
              <Text style={styles.empty}>{t("location.noResults", { query })}</Text>
            )}
            <FlatList
              data={results}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleSelectResult(item)}
                  style={[styles.result, rowDirection]}>
                  <Text style={[styles.resultName, align]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {!!item.detail && (
                    <Text style={[styles.resultDetail, align]} numberOfLines={1}>
                      {item.detail}
                    </Text>
                  )}
                </Pressable>
              )}
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.hint}>{t("location.searchHint")}</Text>
            <Text style={[styles.current, align]} numberOfLines={2}>
              📍 {place.label}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  body: {
    flex: 1,
    width: "100%" as const,
    alignSelf: "center" as const,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  titleRow: {
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  close: {
    fontSize: 16,
    color: colors.textMuted,
  },
  searchBar: {
    alignItems: "center" as const,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === "ios" ? spacing.md : 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  searchIcon: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  clear: {
    fontSize: 14,
    color: colors.textFaint,
  },
  deviceButton: {
    alignItems: "center" as const,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.accentSoft,
  },
  deviceIcon: {
    fontSize: 14,
  },
  deviceLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.accentSoftText,
  },
  results: {
    flex: 1,
    borderRadius: radius.card,
    overflow: "hidden" as const,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  result: {
    alignItems: "center" as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  resultDetail: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  empty: {
    padding: spacing.lg,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center" as const,
  },
  placeholder: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: spacing.sm,
    paddingBottom: 60,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center" as const,
  },
  current: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.textPrimary,
    textAlign: "center" as const,
  },
});
