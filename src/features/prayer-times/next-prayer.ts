import type { Prayer } from "./types";

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

/** Distance forward in time, wrapping past midnight so it is never negative. */
function forwardDelta(from: number, to: number): number {
  return (to - from + DAY_SECONDS) % DAY_SECONDS;
}

/**
 * The first prayer still ahead of `now`. After Isha it wraps to tomorrow's
 * Fajr, so the countdown never goes blank at night. `progress` is measured
 * against the previous prayer, so the bar fills across the real interval.
 */
export function findNextPrayer(prayers: Prayer[], now: Date): NextPrayer | null {
  if (prayers.length === 0) return null;

  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const index = prayers.findIndex((prayer) => toSeconds(prayer.time24) > nowSeconds);

  // Past the last prayer of the day: the next one is tomorrow's first.
  const nextIndex = index === -1 ? 0 : index;
  const previousIndex = (nextIndex - 1 + prayers.length) % prayers.length;

  const next = prayers[nextIndex];
  const secondsAway = forwardDelta(nowSeconds, toSeconds(next.time24));
  const interval = forwardDelta(toSeconds(prayers[previousIndex].time24), toSeconds(next.time24));
  const progress = interval > 0 ? 1 - secondsAway / interval : 1;

  return { prayer: next, secondsAway, progress: Math.max(0, Math.min(1, progress)) };
}
