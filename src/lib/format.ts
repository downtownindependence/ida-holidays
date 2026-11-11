import { SITE_TIME_ZONE } from './datetime';

export { SITE_TIME_ZONE };

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

const PLAIN_DATE_STYLES = {
  /** "Thursday, December 24, 2026" */
  full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  /** "Saturday, November 28" */
  weekday: { weekday: 'long', month: 'long', day: 'numeric' },
  /** "December 28" */
  monthDay: { month: 'long', day: 'numeric' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

/** Format a plain "YYYY-MM-DD" string from Pages CMS. */
export function formatPlainDate(
  value: string,
  style: keyof typeof PLAIN_DATE_STYLES = 'full',
): string {
  const date = parsePlainDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat('en-US', {
    ...PLAIN_DATE_STYLES[style],
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

/** "NOV" for the small month label in a date circle. */
export function formatMonthShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: SITE_TIME_ZONE })
    .format(date)
    .toUpperCase();
}

/** "28" for the large day number in a date circle. */
export function formatDayNumber(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: SITE_TIME_ZONE }).format(
    date,
  );
}

/**
 * "4" and "PM", or "5:30" and "PM". Kept apart so the page can set AM and PM
 * smaller, the way the flyer does.
 */
export function clockParts(date: Date): { time: string; meridiem: string } {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: SITE_TIME_ZONE,
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === 'hour')?.value ?? '';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00';
  const meridiem = (parts.find((part) => part.type === 'dayPeriod')?.value ?? '').toUpperCase();
  return { time: minute === '00' ? hour : `${hour}:${minute}`, meridiem };
}

export interface TextPiece {
  text: string;
  /** True for the little linking words the flyer sets in script. */
  script: boolean;
}

/**
 * Split text so small linking words ("to", "or", "and") can be set in the
 * script font, like "9AM to 4PM" or "Cocoa Station and Photo Booth" on the
 * flyer. Only whole words are matched, so "Santa" or "Toys" are left alone.
 */
export function splitLinkingWords(
  text: string,
  words: readonly string[] = ['to', 'or', 'and'],
): TextPiece[] {
  const pattern = new RegExp(`(\\s(?:${words.join('|')})\\s)`, 'i');
  return text
    .split(pattern)
    .filter((piece) => piece.length > 0)
    .map((piece) => ({ text: piece, script: pattern.test(piece) }));
}

/** Machine readable date for <time datetime="..."> */
export function toIsoString(date: Date): string {
  return date.toISOString();
}

/**
 * The plain voting form link, with any pre-selected answers removed. Used for
 * the general "Open the ballot" button.
 */
export function toBallotUrl(url: string | undefined): string | null {
  const parsed = parseHttpUrl(url);
  if (!parsed) return null;
  for (const key of [...parsed.searchParams.keys()]) {
    if (key.startsWith('entry.')) parsed.searchParams.delete(key);
  }
  parsed.searchParams.delete('usp');
  parsed.searchParams.delete('embedded');
  return parsed.toString();
}

/**
 * The voting form link with one business already ticked, for the "Vote for
 * this window" button on each business card.
 *
 * This works when the link pasted into Pages CMS is a Google Forms
 * "pre-filled link": a link where Google has written one answer into the
 * address, like ...viewform?usp=pp_url&entry.123456=Some+Business. The site
 * finds that answer and swaps in each business's name. The business names in
 * Pages CMS must match the choices in the form exactly, or Google leaves the
 * box unticked (the voter can still tick it by hand).
 *
 * With a plain form link there is nothing to swap, so the button just opens
 * the ballot.
 */
export function buildVoteUrl(
  url: string | undefined,
  businessName: string,
  allBusinessNames: readonly string[] = [],
): string | null {
  const parsed = parseHttpUrl(url);
  if (!parsed) return null;
  const entryKeys = [...parsed.searchParams.keys()].filter((key) => key.startsWith('entry.'));
  if (entryKeys.length === 0) return toBallotUrl(url);

  // If more than one answer was pre-filled, use the one whose value is a
  // business name. Otherwise use the first.
  const names = allBusinessNames.map((name) => name.trim().toLowerCase());
  const businessKey =
    entryKeys.find((key) =>
      names.includes((parsed.searchParams.get(key) ?? '').trim().toLowerCase()),
    ) ?? entryKeys[0];

  for (const key of entryKeys) {
    if (key !== businessKey) parsed.searchParams.delete(key);
  }
  parsed.searchParams.set(businessKey, businessName);
  parsed.searchParams.set('usp', 'pp_url');
  parsed.searchParams.delete('embedded');
  return parsed.toString();
}

function parseHttpUrl(url: string | undefined): URL | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed : null;
  } catch {
    return null;
  }
}
