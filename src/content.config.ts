import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { parseEventDate } from './lib/datetime';
import { EVENT_ICONS } from './lib/icons';

// Event times are written without a timezone by Pages CMS, so they are read as
// Independence local time rather than as the build machine's time.
const eventDateTime = z.preprocess(parseEventDate, z.date());

// One markdown file per event, managed by board members in Pages CMS.
const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.{md,yaml,yml}' }),
  schema: z.object({
    name: z.string(),
    start: eventDateTime,
    end: eventDateTime,
    location: z.string(),
    category: z.enum(['IDA', 'City', 'Outside']),
    crowd: z.enum(['small', 'medium', 'large']),
    link: z.string().url().optional(),
    businessTips: z.string().optional(),
    description: z.string().optional(),
    visible: z.boolean().default(true),
    // Optional extras, shown the way the flyer shows them. Blank means hidden.
    // "FREE" or "$10", shown after the location.
    cost: z.string().optional(),
    // A short perk shown in slanted type, like "Free Santa hats".
    highlight: z.string().optional(),
    // Replaces the start and end times on the page when they don't tell the
    // whole story, like "9AM or 12PM" for two seatings.
    timeText: z.string().optional(),
    // Button text. With a link it labels the button ("Get tickets"); with no
    // link it shows as a greyed-out placeholder ("Tickets coming soon").
    buttonText: z.string().optional(),
    // A little line drawing shown above the event name.
    icon: z.enum(EVENT_ICONS).optional(),
  }),
});

export const collections = { events };
