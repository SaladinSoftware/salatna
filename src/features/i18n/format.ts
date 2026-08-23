type Translate = (key: string, vars?: Record<string, string | number>) => string;

/** "16:21" -> "4:21 PM" / "٤:٢١ م" depending on the active dictionary. */
export function formatTime(time24: string, t: Translate): string {
  const [hours, minutes] = time24.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;
  const period = t(hours < 12 ? "time.am" : "time.pm");
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/** "2026-08-13" -> the localized weekday. Parsed as UTC so the day never shifts. */
export function formatWeekday(isoDate: string, t: Translate): string {
  const day = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
  return Number.isNaN(day) ? isoDate : t(`weekdays.${day}`);
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Seconds until a prayer -> "01:23:45", or "23:45" inside the last hour.
 * Digits stay latin on purpose: they read the same in both languages and
 * the width never jumps while the clock ticks.
 */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
