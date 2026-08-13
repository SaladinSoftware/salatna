export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerStatus = "current" | "upcoming" | "passed";

export type Prayer = {
  name: PrayerName;
  adhan: string;
  iqamah: string;
  status: PrayerStatus;
};

export type PrayerDay = {
  weekday: string;
  location: string;
  prayers: Prayer[];
};
