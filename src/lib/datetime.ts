export const SITE_TIME_ZONE = 'America/Los_Angeles';

/**
 * How far ahead of UTC the given zone is at the given instant, in milliseconds.
 */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);

  const lookup: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') lookup[part.type] = Number(part.value);
  }

  const asIfUtc = Date.UTC(
    lookup.year,
    lookup.month - 1,
    lookup.day,
    // en-US with hour12 false reports midnight as 24 in some runtimes.
    lookup.hour % 24,
    lookup.minute,
    lookup.second,
  );

  return asIfUtc - instant.getTime();
}

/**
 * Read a wall clock time like "2026-11-16T17:30" as that time in Independence,
 * rather than in whatever zone the machine running the build happens to use.
 *
 * This matters because Pages CMS writes event times with no timezone on them,
 * and Cloudflare builds the site on a server set to UTC. Without this, a 5:30
 * PM event would publish as 9:30 AM.
 */
export function parseWallClock(value: string, timeZone = SITE_TIME_ZONE): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    value.trim(),
  );
  if (!match) return null;

  const [, year, month, day, hour, minute, second] = match;
  const wallClockAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? 0),
  );

  // Subtract the zone offset to get the real instant. Re-check the offset at
  // that instant so times near a daylight saving change land correctly.
  const firstGuess = wallClockAsUtc - zoneOffsetMs(new Date(wallClockAsUtc), timeZone);
  const corrected = wallClockAsUtc - zoneOffsetMs(new Date(firstGuess), timeZone);
  return new Date(corrected);
}

/**
 * Accepts what YAML frontmatter can hand us for an event date:
 *   - a Date, when the author wrote a full timestamp with an offset
 *   - "2026-11-16T17:30", which Pages CMS writes and YAML leaves as a string
 *   - "2026-11-16T17:30:00-08:00", an explicit offset written as a string
 */
export function parseEventDate(value: unknown): Date | string | unknown {
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  const hasExplicitZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(trimmed);
  if (hasExplicitZone) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  }

  return parseWallClock(trimmed) ?? value;
}
