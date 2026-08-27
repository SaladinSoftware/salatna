import type { Prayer, PrayerStatus } from "./types";

const DAY_SECONDS = 24 * 60 * 60;

export type NextPrayer = {
  prayer: Prayer;
  /** Seconds from now until the adhan; 0 once it is due. */
  secondsAway: number;
  /** How far we are between the previous prayer and this one, from 0 to 1. */
  progress: number;
};

function toSeconds(time24: string): number {
  const [hours, minutes] = time24.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

function secondsOfDay(now: Date): number {
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

/** Distance forward in time, wrapping past midnight so it is never negative. */
function forwardDelta(from: number, to: number): number {
  return (to - from + DAY_SECONDS) % DAY_SECONDS;
}

/**
 * Index of the first prayer still ahead of `now`. Once Isha has passed this
 * wraps back to 0 — Fajr, meaning *tomorrow's* Fajr — and it stays there
 * through midnight until Fajr actually arrives.
 *
 * Everything else in this module pivots on it, so the countdown and the
 * table can never disagree about which prayer is next.
 */
function nextIndexAt(prayers: Prayer[], now: Date): number {
  const nowSeconds = secondsOfDay(now);
  const index = prayers.findIndex((prayer) => toSeconds(prayer.time24) > nowSeconds);
  return index === -1 ? 0 : index;
}

/**
 * The first prayer still ahead of `now`. After Isha it wraps to tomorrow's
 * Fajr, so the countdown never goes blank at night. `progress` is measured
 * against the previous prayer, so the bar fills across the real interval.
 *
 * `tomorrow` is only consulted once the day has wrapped: Fajr drifts by a
 * minute or so each day, and counting down to *today's* Fajr at 11pm would
 * be off by exactly that drift. It is optional so the countdown still works
 * on its own if that second request failed.
 */
export function findNextPrayer(
  prayers: Prayer[],
  now: Date,
  tomorrow?: Prayer[] | null,
): NextPrayer | null {
  if (prayers.length === 0) return null;

  const nowSeconds = secondsOfDay(now);
  const nextIndex = nextIndexAt(prayers, now);
  const previousIndex = (nextIndex - 1 + prayers.length) % prayers.length;
  const hasWrapped = prayers.every((prayer) => toSeconds(prayer.time24) <= nowSeconds);

  const next = hasWrapped && tomorrow?.length ? tomorrow[nextIndex] : prayers[nextIndex];
  const secondsAway = forwardDelta(nowSeconds, toSeconds(next.time24));
  const interval = forwardDelta(toSeconds(prayers[previousIndex].time24), toSeconds(next.time24));
  const progress = interval > 0 ? 1 - secondsAway / interval : 1;

  return { prayer: next, secondsAway, progress: Math.max(0, Math.min(1, progress)) };
}

/**
 * Statuses derived from the clock instead of the API's `current_prayer`,
 * which goes out of sync as soon as it reports a key we don't list.
 *
 * Derived from the *next* prayer rather than from raw "is it due yet",
 * because the day wraps: between Isha and Fajr the next prayer is
 * tomorrow's Fajr, so Fajr must read "upcoming" even though today's Fajr
 * is long past — and Isha stays "current" all the way through midnight.
 */
export function resolveStatuses(prayers: Prayer[], now: Date): PrayerStatus[] {
  if (prayers.length === 0) return [];

  const nowSeconds = secondsOfDay(now);
  const nextIndex = nextIndexAt(prayers, now);
  const currentIndex = (nextIndex - 1 + prayers.length) % prayers.length;

  return prayers.map((prayer, index) => {
    // Fajr after Isha: due today, but it is the one we are counting down to.
    if (index === nextIndex) return "upcoming";
    if (index === currentIndex) return "current";
    return toSeconds(prayer.time24) <= nowSeconds ? "passed" : "upcoming";
  });
}
