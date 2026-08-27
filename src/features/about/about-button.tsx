import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useI18n } from "@/features/i18n";
import { radius, shadow, spacing, useThemedStyles, type Palette } from "@/theme";

/** Single source of truth for the credit line — change it here, not in the locales. */
export const CREDITS = {
  organization: "Saladin Software",
  developer: "Inas Al Saabb",
  github: "https://github.com/InasAlSaabb",
} as const;

/** A quiet footer link; the credits themselves live in the sheet it opens. */
export function AboutCard() {
  const styles = useThemedStyles(createStyles);
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.footer}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}>
        <Text style={styles.triggerText}>{t("about.title")}</Text>
      </Pressable>

      <AboutSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </View>
  );
}

function AboutSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const styles = useThemedStyles(createStyles);
  const { t } = useI18n();

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      {/* Tapping the dimmed backdrop closes; taps inside the sheet must not. */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{t("about.title")}</Text>
          <Text style={styles.madeBy}>
            {t("about.madeBy", { organization: CREDITS.organization, developer: CREDITS.developer })}
          </Text>

          <Pressable
            accessibilityRole="link"
            onPress={() => WebBrowser.openBrowserAsync(CREDITS.github)}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
            <Text style={styles.linkText}>{t("about.github")}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
            <Text style={styles.closeText}>{t("common.close")}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: Palette) => ({
  footer: {
    alignItems: "center" as const,
    paddingTop: spacing.xl,
  },
  trigger: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textFaint,
  },
  pressed: {
    opacity: 0.6,
  },
  backdrop: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: spacing.xl,
    backgroundColor: "rgba(2, 6, 23, 0.55)",
  },
  sheet: {
    width: "100%" as const,
    maxWidth: 340,
    alignItems: "center" as const,
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  title: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: colors.textPrimary,
  },
  madeBy: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center" as const,
    color: colors.textMuted,
  },
  link: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.accentSoftText,
  },
  close: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  closeText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textFaint,
  },
});
