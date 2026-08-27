import { useCallback, useEffect, useState } from "react";

import { fetchPrayerTimes, localDate, type Coordinates } from "./api";
import type { PrayerDay } from "./types";

type State = {
  day: PrayerDay | null;
  /** Only used for the countdown after Isha, so it is allowed to be missing. */
  tomorrow: PrayerDay | null;
  /** True only for the first load, when there is nothing to show yet. */
  isLoading: boolean;
  /** True while re-fetching on top of a day that is already on screen. */
  isRefreshing: boolean;
  error: string | null;
  updatedAt: number | null;
};

const INITIAL_STATE: State = {
  day: null,
  tomorrow: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
  updatedAt: null,
};

export function usePrayerTimes(coordinates: Coordinates, location: string) {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const { latitude, longitude } = coordinates;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // Keep the current day visible while refreshing so the list doesn't flash empty.
    setState((prev) =>
      prev.day
        ? { ...prev, isRefreshing: true, error: null }
        : { ...INITIAL_STATE, updatedAt: prev.updatedAt },
    );

    Promise.all([
      fetchPrayerTimes({ latitude, longitude }, location, { signal }),
      // Tomorrow is a nicety, not a requirement: swallow its failure so a
      // flaky second request can never blank out the day we do have.
      fetchPrayerTimes({ latitude, longitude }, location, {
        date: localDate(1),
        signal,
      }).catch(() => null),
    ])
      .then(([day, tomorrow]) =>
        setState({
          day,
          tomorrow,
          isLoading: false,
          isRefreshing: false,
          error: null,
          updatedAt: Date.now(),
        }),
      )
      .catch((cause: Error) => {
        if (cause.name === "AbortError") return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: cause.message,
        }));
      });

    return () => controller.abort();
  }, [latitude, longitude, location, reloadKey]);

  useMidnightRollover(reload);

  return { ...state, reload };
}

/**
 * Times are fetched for one calendar day. Without this the app would still be
 * showing yesterday's date and yesterday's times at 1am, and today's prayers
 * would still be sitting in `tomorrow`.
 */
function useMidnightRollover(onRollover: () => void) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      // A second past midnight, so the service has rolled over too.
      timer = setTimeout(() => {
        onRollover();
        schedule();
      }, midnight.getTime() - now.getTime() + 1000);
    };

    schedule();
    return () => clearTimeout(timer);
  }, [onRollover]);
}
