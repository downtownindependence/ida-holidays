import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { parseEventDate } from './lib/datetime';

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
    description: z.string(),
    visible: z.boolean().default(true),
  }),
});

export const collections = { events };
