/**
 * The little line drawings an event can show, picked with the "Little
 * drawing" field in Pages CMS. Drawn in src/components/EventIcon.astro.
 * Keep this list in step with the options in .pages.yml.
 */
export const EVENT_ICONS = [
  'cocoa',
  'santa',
  'train',
  'gift',
  'letter',
  'camera',
  'breakfast',
  'wreath',
  'tree',
  'cheers',
  'music',
] as const;

export type EventIconName = (typeof EVENT_ICONS)[number];
