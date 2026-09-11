import { useState } from "react";
import { Linking, Platform, Pressable, Switch, Text, View } from "react-native";

import { useI18n } from "@/features/i18n";
import { radius, shadow, spacing, useLayout, useThemedStyles, useTheme, type Palette } from "@/theme";
import { PRAYER_NAMES, useNotificationSettings } from "./notification-settings";
import { isNotificationsSupported } from "./schedule";

export function NotificationsCard() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { gutter } = useLayout();
  const { t, isRTL } = useI18n();
  const { isEnabled, toggles, hasDismissedBatteryHint, setEnabled, togglePrayer, dismissBatteryHint } =
    useNotificationSettings();
  const [wasRefused, setWasRefused] = useState(false);
  const isSupported = isNotificationsSupported();

  const row = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };
  const align = { textAlign: isRTL ? ("right" as const) : ("left" as const) };

  // Samsung, TECNO, Xiaomi and friends kill background apps and then block the
  // alarm broadcast that would post the notification, so the adhan silently
  // never fires. Nothing in the app can override that — only the user can.
  const showBatteryHint =
    Platform.OS === "android" && isSupported && isEnabled && !hasDismissedBatteryHint;

  async function handleToggle(next: boolean) {
    const granted = await setEnabled(next);
    setWasRefused(next && !granted);
  }

  return (
    <View style={[styles.card, { marginTop: gutter }]}>
      <View style={[styles.headerRow, row]}>
        <View style={styles.headerText}>
          <Text style={[styles.title, align]}>{t("notifications.settingsTitle")}</Text>
          <Text style={[styles.subtitle, align]}>{t("notifications.settingsHint")}</Text>
        </View>
        <Switch
          value={isEnabled && isSupported}
          disabled={!isSupported}
          onValueChange={handleToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.surface}
        />
      </View>

      {!isSupported && (
        <Text style={[styles.denied, align]}>{t("notifications.needsDevBuild")}</Text>
      )}
      {isSupported && wasRefused && (
        <Text style={[styles.denied, align]}>{t("notifications.denied")}</Text>
      )}

      {showBatteryHint && (
        <View style={styles.hint}>
          <Text style={[styles.hintTitle, align]}>{t("notifications.batteryTitle")}</Text>
          <Text style={[styles.hintBody, align]}>{t("notifications.batteryBody")}</Text>
          <View style={[styles.hintActions, row]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => Linking.openSettings()}
              style={({ pressed }) => [styles.hintPrimary, pressed && styles.pressed]}>
              <Text style={styles.hintPrimaryText}>{t("notifications.batteryOpen")}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={dismissBatteryHint}
              style={({ pressed }) => [styles.hintDismiss, pressed && styles.pressed]}>
              <Text style={styles.hintDismissText}>{t("notifications.batteryDismiss")}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {isSupported && isEnabled && (
        <View style={[styles.chips, row]}>
          {PRAYER_NAMES.map((name) => {
            const isOn = toggles[name];
            return (
              <Pressable
                key={name}
                accessibilityRole="switch"
                accessibilityState={{ checked: isOn }}
                onPress={() => togglePrayer(name)}
                style={[styles.chip, isOn && styles.chipOn]}>
                <Text style={[styles.chipText, isOn && styles.chipTextOn]}>
                  {t(`prayers.${name}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  headerRow: {
    alignItems: "center" as const,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  denied: {
    fontSize: 13,
    color: colors.textMuted,
  },
  hint: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: colors.textPrimary,
  },
  hintBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  hintActions: {
    alignItems: "center" as const,
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  hintPrimary: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  hintPrimaryText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.onAccent,
  },
  hintDismiss: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  hintDismissText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textFaint,
  },
  pressed: {
    opacity: 0.6,
  },
  chips: {
    flexWrap: "wrap" as const,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.textFaint,
  },
  chipTextOn: {
    color: colors.accentSoftText,
  },
});
