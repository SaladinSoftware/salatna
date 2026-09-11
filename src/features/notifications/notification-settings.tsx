import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { PrayerName } from "../prayer-times";
import { configureNotificationHandler, requestPermission, type PrayerToggles } from "./schedule";

const STORAGE_KEY = "tazkir.notifications.v1";

export const PRAYER_NAMES: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const ALL_ON: PrayerToggles = {
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
};

type Stored = {
  isEnabled: boolean;
  toggles: PrayerToggles;
  /** The battery-saver warning is a one-time nudge, not a permanent banner. */
  hasDismissedBatteryHint: boolean;
};

/** Off until asked for: notifications are never something to opt someone into. */
const DEFAULTS: Stored = { isEnabled: false, toggles: ALL_ON, hasDismissedBatteryHint: false };

type SettingsValue = Stored & {
  /** False until the stored value is read, so we don't schedule on defaults. */
  isReady: boolean;
  /** Returns false if the user refused the OS permission prompt. */
  setEnabled: (enabled: boolean) => Promise<boolean>;
  togglePrayer: (prayer: PrayerName) => void;
  dismissBatteryHint: () => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

export function NotificationSettingsProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>(DEFAULTS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Guarded: a notifications failure must never take down the app shell.
    try {
      configureNotificationHandler();
    } catch {
      // The rest of the app works fine without the foreground banner.
    }

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Stored>;
          setStored({
            isEnabled: Boolean(parsed.isEnabled),
            // Spread over the defaults so a prayer added later is not undefined.
            toggles: { ...ALL_ON, ...parsed.toggles },
            hasDismissedBatteryHint: Boolean(parsed.hasDismissedBatteryHint),
          });
        }
      })
      // A corrupt or unreadable value is not worth failing over: use defaults.
      .catch(() => undefined)
      .finally(() => setIsReady(true));
  }, []);

  const persist = useCallback((next: Stored) => {
    setStored(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const setEnabled = useCallback(
    async (enabled: boolean) => {
      if (!enabled) {
        persist({ ...stored, isEnabled: false });
        return true;
      }

      const granted = await requestPermission().catch(() => false);
      persist({ ...stored, isEnabled: granted });
      return granted;
    },
    [persist, stored],
  );

  const togglePrayer = useCallback(
    (prayer: PrayerName) =>
      persist({ ...stored, toggles: { ...stored.toggles, [prayer]: !stored.toggles[prayer] } }),
    [persist, stored],
  );

  const dismissBatteryHint = useCallback(
    () => persist({ ...stored, hasDismissedBatteryHint: true }),
    [persist, stored],
  );

  const value = useMemo<SettingsValue>(
    () => ({ ...stored, isReady, setEnabled, togglePrayer, dismissBatteryHint }),
    [stored, isReady, setEnabled, togglePrayer, dismissBatteryHint],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useNotificationSettings() {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error("useNotificationSettings must be used inside a <NotificationSettingsProvider>.");
  }
  return value;
}
