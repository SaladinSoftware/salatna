import { useCallback, useEffect, useState } from "react";

import { fetchPrayerTimes, type Coordinates } from "./api";
import type { PrayerDay } from "./types";

type State = {
  day: PrayerDay | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: State = { day: null, isLoading: true, error: null };

export function usePrayerTimes(coordinates: Coordinates, location: string) {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const { latitude, longitude } = coordinates;

  useEffect(() => {
    const controller = new AbortController();

    setState(INITIAL_STATE);

    fetchPrayerTimes({ latitude, longitude }, location, controller.signal)
      .then((day) => setState({ day, isLoading: false, error: null }))
      .catch((cause: Error) => {
        if (cause.name === "AbortError") return;
        setState({ day: null, isLoading: false, error: cause.message });
      });

    return () => controller.abort();
  }, [latitude, longitude, location, reloadKey]);

  return { ...state, reload };
}
