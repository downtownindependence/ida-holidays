import { getCollection, type CollectionEntry } from 'astro:content';

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

/** Load the events collection and apply the same filter. */
export async function getVisibleEvents(now: Date = new Date()): Promise<EventEntry[]> {
  return filterVisibleEvents(await getCollection('events'), now);
}
