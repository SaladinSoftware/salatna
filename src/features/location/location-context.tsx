import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { describePlace, useDeviceLocation } from "./use-device-location";
import type { Place } from "./use-device-location";

type LocationValue = {
  place: Place;
  isLocating: boolean;
  isFallback: boolean;
  canAskAgain: boolean;
  requestLocation: () => void;
  /** Overrides the device location, e.g. after picking a search result. */
  selectPlace: (place: Place) => void;
  /** Drops the manual choice and goes back to following the device. */
  followDevice: () => void;
};

const LocationContext = createContext<LocationValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const device = useDeviceLocation();
  const [selected, setSelected] = useState<Place | null>(null);

  const value = useMemo<LocationValue>(
    () => ({
      place: selected ?? device.place,
      isLocating: selected ? false : device.isLocating,
      isFallback: selected ? false : device.isFallback,
      canAskAgain: device.canAskAgain,
      requestLocation: device.requestLocation,
      selectPlace: setSelected,
      followDevice: () => {
        setSelected(null);
        device.requestLocation();
      },
    }),
    [selected, device],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const value = useContext(LocationContext);
  if (!value) {
    throw new Error("useLocation must be used inside a <LocationProvider>.");
  }
  return value;
}

export { describePlace };
