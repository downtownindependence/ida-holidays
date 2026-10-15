import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Phase 2 structure. Nothing from this collection is rendered yet.
const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.{md,yaml,yml}' }),
  schema: z.object({
    name: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date(),
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
