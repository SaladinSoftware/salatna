import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";

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
  /** False once the OS stops showing the permission dialog. */
  canAskAgain: boolean;
};

const INITIAL_STATE: State = {
  place: FALLBACK_PLACE,
  isLocating: true,
  isFallback: true,
  canAskAgain: true,
};

/** Turns coordinates into "City, Country". Falls back to the raw numbers. */
export async function describePlace(coordinates: Coordinates): Promise<string> {
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

/** Emulators often have no live fix, so fall back to the last known one. */
async function readCoordinates(): Promise<Coordinates | null> {
  const position =
    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }).catch(
      () => null,
    )) ?? (await Location.getLastKnownPositionAsync());

  if (!position) return null;
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function useDeviceLocation() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function locate() {
      setState((previous) => ({ ...previous, isLocating: true }));

      const permission = await Location.requestForegroundPermissionsAsync();
      if (!isActive) return;

      if (!permission.granted) {
        setState({
          place: FALLBACK_PLACE,
          isLocating: false,
          isFallback: true,
          canAskAgain: permission.canAskAgain,
        });
        return;
      }

      const coordinates = await readCoordinates();
      if (!isActive) return;

      if (!coordinates) {
        setState({
          place: FALLBACK_PLACE,
          isLocating: false,
          isFallback: true,
          canAskAgain: true,
        });
        return;
      }

      const label = await describePlace(coordinates);
      if (!isActive) return;

      setState({
        place: { coordinates, label },
        isLocating: false,
        isFallback: false,
        canAskAgain: true,
      });
    }

    locate().catch(() => {
      if (isActive) {
        setState({ ...INITIAL_STATE, isLocating: false });
      }
    });

    return () => {
      isActive = false;
    };
  }, [requestKey]);

  /** Re-runs the lookup, or sends the user to Settings when the OS won't ask again. */
  const requestLocation = useCallback(() => {
    if (!state.canAskAgain) {
      Linking.openSettings();
      return;
    }
    setRequestKey((key) => key + 1);
  }, [state.canAskAgain]);

  return { ...state, requestLocation };
}
