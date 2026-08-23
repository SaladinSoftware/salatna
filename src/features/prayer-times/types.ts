export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerStatus = "current" | "upcoming" | "passed";

export type Prayer = {
  /** Stable English key — the UI translates it, never displays it raw. */
  name: PrayerName;
  /** 24h "HH:MM", so formatting stays a presentation concern. */
  time24: string;
  status: PrayerStatus;
};

export type PrayerDay = {
  /** ISO "YYYY-MM-DD"; the weekday is derived per locale. */
  date: string;
  location: string;
  prayers: Prayer[];
};
