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

type Options = {
  /** "YYYY-MM-DD". Omitted, the service answers for its own idea of today. */
  date?: string;
  signal?: AbortSignal;
};

/** Local calendar date, `offsetDays` from today, as "YYYY-MM-DD". */
export function localDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Today plus the following days, for scheduling ahead. Failures are dropped
 * rather than thrown: a week with a hole in it still beats no week at all.
 */
export async function fetchUpcomingDays(
  coordinates: Coordinates,
  location: string,
  days: number,
  signal?: AbortSignal,
): Promise<PrayerDay[]> {
  const requests = Array.from({ length: days }, (_, offset) =>
    fetchPrayerTimes(coordinates, location, { date: localDate(offset), signal }).catch(() => null),
  );
  return (await Promise.all(requests)).filter((day): day is PrayerDay => day !== null);
}

export async function fetchPrayerTimes(
  { latitude, longitude }: Coordinates,
  location: string,
  { date, signal }: Options = {},
): Promise<PrayerDay> {
  const query = `lat=${latitude}&lng=${longitude}${date ? `&date=${date}` : ""}`;
  const response = await fetch(`${BASE_URL}?${query}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json: UmmahResponse = await response.json();
  if (!json.success) {
    throw new Error("The prayer times service returned an error.");
  }

  return {
    date: json.data.date,
    location,
    prayers: PRAYER_KEYS.map(({ name, key }) => ({
      name,
      time24: json.data.prayer_times[key],
    })),
  };
}
