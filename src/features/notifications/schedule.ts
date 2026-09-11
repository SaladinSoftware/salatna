import { Platform } from "react-native";

import type { PrayerDay, PrayerName } from "../prayer-times";

/**
 * Android channels are immutable once created: changing the sound or the
 * importance later has no effect unless the id changes too. Bump the suffix
 * whenever those change — that is what the version is for.
 */
const CHANNEL_ID = "prayer-adhan-v2";

/**
 * Bundled by the expo-notifications config plugin, so it is referenced by
 * filename alone — no path, no require. Trimmed to 29.5s because iOS ignores
 * any notification sound over 30 seconds and silently plays the default.
 */
const SOUND = "adhan.wav";

/**
 * iOS keeps at most 64 pending local notifications and silently drops the
 * rest, so we stay well under it. At five prayers a day that is a fortnight
 * of cover, far longer than the app can go without being opened anyway.
 */
const MAX_SCHEDULED = 60;

/** Marks our own notifications, so we never cancel something else's. */
const TAG = "prayer-time";

type Translate = (key: string, vars?: Record<string, string | number>) => string;

/** Type-only: this form never emits a runtime import. */
type NotificationsModule = typeof import("expo-notifications");

let cached: NotificationsModule | null | undefined;

/**
 * expo-notifications must never be imported statically. Its entry point
 * registers a push-token listener at module scope, and on Android in Expo Go
 * that *throws* — which would take down whatever imported it. Since the root
 * layout is upstream of this module, a static import kills the whole app
 * before any provider mounts, not just notifications.
 *
 * Requiring it lazily behind a guard keeps that failure local: the feature
 * reports itself unavailable and the rest of the app carries on.
 */
function getNotifications(): NotificationsModule | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require("expo-notifications") as NotificationsModule;
  } catch {
    cached = null;
  }
  return cached;
}

/** False in Expo Go on Android; a development build is required there. */
export function isNotificationsSupported(): boolean {
  return getNotifications() !== null;
}

/** Which prayers the user wants to be told about. */
export type PrayerToggles = Record<PrayerName, boolean>;

/**
 * Shown as a banner even when the app is open, otherwise it looks broken.
 *
 * Called from an effect rather than at module scope: this module is pulled in
 * by the root layout, and a throw during import takes down every provider with
 * it — expo-router then silently falls back to a bare navigator.
 */
export function configureNotificationHandler() {
  const Notifications = getNotifications();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestPermission(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** No-op off Android; elsewhere the sound is carried by the notification. */
async function ensureChannel() {
  const Notifications = getNotifications();
  if (!Notifications || Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Prayer times",
    importance: Notifications.AndroidImportance.MAX,
    sound: SOUND,
    vibrationPattern: [0, 250, 250, 250],
  });
}

/** "2026-08-27" + "19:44" -> a local Date. Built by parts: Hermes is picky. */
function toLocalDate(isoDate: string, time24: string): Date | null {
  const [year, month, day] = isoDate.split("-").map(Number);
  const [hours, minutes] = time24.split(":").map(Number);
  if ([year, month, day, hours, minutes].some(Number.isNaN)) return null;
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export async function cancelPrayerNotifications() {
  const Notifications = getNotifications();
  if (!Notifications) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.content.data?.tag === TAG)
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
}

/**
 * Replaces every pending prayer notification with one per enabled prayer
 * across `days`. Rescheduling wholesale rather than diffing keeps this
 * honest: prayer times shift daily, so yesterday's schedule is always stale.
 *
 * Returns how many were scheduled.
 */
export async function schedulePrayerNotifications(
  days: PrayerDay[],
  toggles: PrayerToggles,
  t: Translate,
): Promise<number> {
  const Notifications = getNotifications();
  if (!Notifications) return 0;

  await ensureChannel();
  await cancelPrayerNotifications();

  const now = Date.now();
  const due = days
    .flatMap((day) =>
      day.prayers
        .filter((prayer) => toggles[prayer.name])
        .map((prayer) => ({ prayer, at: toLocalDate(day.date, prayer.time24) })),
    )
    .filter((entry): entry is { prayer: { name: PrayerName; time24: string }; at: Date } =>
      Boolean(entry.at && entry.at.getTime() > now),
    )
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, MAX_SCHEDULED);

  for (const { prayer, at } of due) {
    const name = t(`prayers.${prayer.name}`);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("notifications.title", { prayer: name }),
        body: t("notifications.body", { prayer: name }),
        sound: SOUND,
        data: { tag: TAG, prayer: prayer.name },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at,
        channelId: CHANNEL_ID,
      },
    });
  }

  return due.length;
}
