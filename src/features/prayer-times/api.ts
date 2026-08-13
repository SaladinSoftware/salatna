import type { PrayerDay, PrayerName, PrayerStatus } from "./types";

const BASE_URL = "https://www.ummahapi.com/api/prayer-times";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    current_status: { current_prayer: string };
  };
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/** "2026-08-13" -> "Thursday". Parsed as UTC so the day never shifts. */
function toWeekday(isoDate: string): string {
  return WEEKDAYS[new Date(`${isoDate}T00:00:00Z`).getUTCDay()];
}

/** "16:21" -> "4:21 PM" */
function toDisplayTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/** Everything before the current prayer has passed, everything after is upcoming. */
function toStatus(index: number, currentIndex: number): PrayerStatus {
  if (index === currentIndex) return "current";
  return index < currentIndex ? "passed" : "upcoming";
}

export async function fetchPrayerTimes(
  { latitude, longitude }: Coordinates,
  location: string,
  signal?: AbortSignal,
): Promise<PrayerDay> {
  const response = await fetch(`${BASE_URL}?lat=${latitude}&lng=${longitude}`, { signal });
  console.log(location, latitude, longitude);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json: UmmahResponse = await response.json();
  if (!json.success) {
    throw new Error("The prayer times service returned an error.");
  }

  const { date, prayer_times, current_status } = json.data;
  const currentIndex = PRAYER_KEYS.findIndex(({ key }) => key === current_status.current_prayer);
console.log("currentIndex", currentIndex, current_status.current_prayer, prayer_times);
  return {
    weekday: toWeekday(date),
    location,
    prayers: PRAYER_KEYS.map(({ name, key }, index) => ({
      name,
      adhan: toDisplayTime(prayer_times[key]),
      iqamah: toDisplayTime(prayer_times[key]),
      status: toStatus(index, currentIndex),
    })),
  };
}
