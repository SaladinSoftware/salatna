import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import type { Coordinates } from "@/features/prayer-times";

/** Used until the device reports a position, and if permission is denied. */
export const FALLBACK_PLACE = {
  coordinates: { latitude: 21.4225, longitude: 39.8262 },
  label: "Mecca, Saudi Arabia",
};

export type Place = {
  coordinates: Coordinates;
  label: string;
};

type State = {
  place: Place;
  isLocating: boolean;
  isFallback: boolean;
};

const INITIAL_STATE: State = {
  place: FALLBACK_PLACE,
  isLocating: true,
  isFallback: true,
};

/** Turns coordinates into "City, Country". Falls back to the raw numbers. */
async function describe(coordinates: Coordinates): Promise<string> {
  try {
    const [address] = await Location.reverseGeocodeAsync(coordinates);
    const city = address?.city ?? address?.subregion ?? address?.region;
    if (city && address?.country) return `${city}, ${address.country}`;
    if (city) return city;
  } catch {
    // Reverse geocoding is a nicety — never let it break the screen.
  }
  return `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`;
}

export function useDeviceLocation() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => setRetryKey((key) => key + 1), []);

  useEffect(() => {
    let isActive = true;

    async function locate() {
      setState((previous) => ({ ...previous, isLocating: true }));

      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!isActive) return;

      if (!granted) {
        setState({ place: FALLBACK_PLACE, isLocating: false, isFallback: true });
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
      if (!isActive) return;

      const coordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      const label = await describe(coordinates);
      if (!isActive) return;

      setState({ place: { coordinates, label }, isLocating: false, isFallback: false });
    }

    locate().catch(() => {
      if (isActive) {
        setState({ place: FALLBACK_PLACE, isLocating: false, isFallback: true });
      }
    });

    return () => {
      isActive = false;
    };
  }, [retryKey]);

  return { ...state, retry };
}
