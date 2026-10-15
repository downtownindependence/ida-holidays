/** Independence, Oregon. All event times are shown in this zone. */
export const SITE_TIME_ZONE = 'America/Los_Angeles';

/**
 * Turn a plain "YYYY-MM-DD" string from Pages CMS into a Date without the
 * timezone shift you get from `new Date('2026-11-28')`, which parses as UTC
 * midnight and can read as the day before on the US west coast.
 */
export function parsePlainDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

/** "Friday, January 1, 2027" from a plain "YYYY-MM-DD" string. */
export function formatPlainDate(value: string): string {
  const date = parsePlainDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "Saturday, November 28" for an event start. */
export function formatEventDate(start: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: SITE_TIME_ZONE,
  }).format(start);
}

/** Machine readable date for <time datetime="..."> */
export function toIsoString(date: Date): string {
  return date.toISOString();
}

function formatClock(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: SITE_TIME_ZONE,
  })
    .format(date)
    .replace(':00', '');
}

/**
 * "5 to 7 PM" when both ends share a meridiem, "11 AM to 1 PM" when they do
 * not. Minutes are kept when they are not on the hour.
 */
export function formatEventTimeRange(start: Date, end: Date): string {
  const startText = formatClock(start);
  const endText = formatClock(end);
  const startMeridiem = startText.slice(-2);
  const endMeridiem = endText.slice(-2);
  if (startMeridiem === endMeridiem) {
    return `${startText.slice(0, -3)} to ${endText}`;
  }
  return `${startText} to ${endText}`;
}

/**
 * Google Form share links need `embedded=true` before they render cleanly in
 * an iframe. Board members will paste whichever link Google hands them, so
 * normalize it here instead of asking them to get it right.
 */
export function toEmbeddableFormUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  parsed.searchParams.set('embedded', 'true');
  return parsed.toString();
}

/** The plain, non embedded version, for the "open in a new tab" fallback. */
export function toPlainFormUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    parsed.searchParams.delete('embedded');
    return parsed.toString();
  } catch {
    return null;
  }
}
