import type { PrayerDay, PrayerName } from "./types";

const BASE_URL = "https://www.ummahapi.com/api/prayer-times";

/** Display order, paired with the lowercase keys the API returns. */
const PRAYER_KEYS: { name: PrayerName; key: string }[] = [
  { name: "Fajr", key: "fajr" },
  { name: "Dhuhr", key: "dhuhr" },
  { name: "Asr", key: "asr" },
  { name: "Maghrib", key: "maghrib" },
  { name: "Isha", key: "isha" },
];

/** Only the fields we actually read from the response. */
type UmmahResponse = {
  success: boolean;
  data: {
    date: string;
    prayer_times: Record<string, string>;
  };
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function fetchPrayerTimes(
  { latitude, longitude }: Coordinates,
  location: string,
  signal?: AbortSignal,
): Promise<PrayerDay> {
  const response = await fetch(`${BASE_URL}?lat=${latitude}&lng=${longitude}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json: UmmahResponse = await response.json();
  if (!json.success) {
    throw new Error("The prayer times service returned an error.");
  }

  const { date, prayer_times } = json.data;

  return {
    date,
    location,
    prayers: PRAYER_KEYS.map(({ name, key }) => ({ name, time24: prayer_times[key] })),
  };
}
