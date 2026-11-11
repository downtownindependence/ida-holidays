import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE_TIME_ZONE } from './datetime';

export type EventEntry = CollectionEntry<'events'>;

/**
 * Keep only events an ordinary visitor should see: the toggle is on and the
 * event has not finished yet. Results are sorted soonest first.
 */
export function filterVisibleEvents(
  entries: EventEntry[],
  now: Date = new Date(),
): EventEntry[] {
  return entries
    .filter((entry) => entry.data.visible !== false)
    .filter((entry) => entry.data.end.getTime() >= now.getTime())
    .sort((a, b) => a.data.start.getTime() - b.data.start.getTime());
}

export interface EventDay {
  /** "2026-11-28", the date in Independence. */
  key: string;
  /** Start of the first event that day, used for the month and day labels. */
  date: Date;
  events: EventEntry[];
}

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Group already sorted events by their date in Independence, so the page can
 * show one sun circle per day with that day's events underneath, like the
 * flyer does.
 */
export function groupEventsByDay(entries: EventEntry[]): EventDay[] {
  const days: EventDay[] = [];
  for (const entry of entries) {
    const key = dayKeyFormat.format(entry.data.start);
    const last = days[days.length - 1];
    if (last && last.key === key) {
      last.events.push(entry);
    } else {
      days.push({ key, date: entry.data.start, events: [entry] });
    }
  }
  return days;
}

/** Load the events collection and apply the same filter. */
export async function getVisibleEvents(now: Date = new Date()): Promise<EventEntry[]> {
  return filterVisibleEvents(await getCollection('events'), now);
}
