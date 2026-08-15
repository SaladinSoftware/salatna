import { useCallback, useEffect, useState } from "react";

import { fetchPrayerTimes, type Coordinates } from "./api";
import type { PrayerDay } from "./types";

type State = {
  day: PrayerDay | null;
  /** True only for the first load, when there is nothing to show yet. */
  isLoading: boolean;
  /** True while re-fetching on top of a day that is already on screen. */
  isRefreshing: boolean;
  error: string | null;
  updatedAt: number | null;
};

const INITIAL_STATE: State = {
  day: null,
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

    // Keep the current day visible while refreshing so the list doesn't flash empty.
    setState((prev) =>
      prev.day
        ? { ...prev, isRefreshing: true, error: null }
        : { ...INITIAL_STATE, updatedAt: prev.updatedAt },
    );

    fetchPrayerTimes({ latitude, longitude }, location, controller.signal)
      .then((day) =>
        setState({
          day,
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

  return { ...state, reload };
}
