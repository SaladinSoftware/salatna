import { useEffect, useState } from "react";

import { useI18n } from "@/features/i18n";
import { fetchUpcomingDays, type Coordinates } from "@/features/prayer-times";
import { useNotificationSettings } from "./notification-settings";
import { cancelPrayerNotifications, schedulePrayerNotifications } from "./schedule";

/** A fortnight would exceed the pending-notification cap; a week is plenty. */
const DAYS_AHEAD = 7;

/**
 * Keeps the OS schedule matching the settings. It re-runs whenever the
 * toggles, the location or the language change — the last one matters because
 * the prayer name is baked into the notification text when it is scheduled,
 * not when it fires.
 */
export function usePrayerNotifications(coordinates: Coordinates, location: string) {
  const { isEnabled, toggles, isReady } = useNotificationSettings();
  const { t, locale } = useI18n();
  const [scheduledCount, setScheduledCount] = useState(0);

  const { latitude, longitude } = coordinates;

  useEffect(() => {
    // Scheduling on the defaults would fire notifications the user never
    // asked for, so wait until the stored settings have actually loaded.
    if (!isReady) return;

    if (!isEnabled) {
      cancelPrayerNotifications().catch(() => undefined);
      setScheduledCount(0);
      return;
    }

    const controller = new AbortController();
    let isStale = false;

    fetchUpcomingDays({ latitude, longitude }, location, DAYS_AHEAD, controller.signal)
      .then((days) => {
        if (isStale || days.length === 0) return 0;
        return schedulePrayerNotifications(days, toggles, t);
      })
      .then((count) => {
        if (!isStale) setScheduledCount(count ?? 0);
      })
      .catch(() => undefined);

    return () => {
      isStale = true;
      controller.abort();
    };
    // `t` is recreated per locale; `locale` is the honest dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isEnabled, toggles, latitude, longitude, location, locale]);

  return { scheduledCount };
}
