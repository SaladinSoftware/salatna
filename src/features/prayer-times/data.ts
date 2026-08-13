import type { PrayerDay } from "./types";

/** Mock source. Swap for an API call without touching any component. */
export const todaysPrayers: PrayerDay = {
  weekday: "Monday",
  location: "Mecca, Saudi Arabia",
  prayers: [
    { name: "Fajr", adhan: "5:15 AM", iqamah: "5:15 AM", status: "current" },
    { name: "Dhuhr", adhan: "12:30 PM", iqamah: "12:30 PM", status: "upcoming" },
    { name: "Asr", adhan: "3:45 PM", iqamah: "3:45 PM", status: "upcoming" },
    { name: "Maghrib", adhan: "6:20 PM", iqamah: "6:20 PM", status: "upcoming" },
    { name: "Isha", adhan: "7:50 PM", iqamah: "7:50 PM", status: "upcoming" },
  ],
};
