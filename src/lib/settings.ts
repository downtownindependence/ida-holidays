import { z } from 'astro/zod';
import rawSettings from '../data/holiday-settings.json';

export const CONTEST_STAGES = [
  'coming-soon',
  'voting-open',
  'voting-closed',
  'winners',
] as const;

export type ContestStage = (typeof CONTEST_STAGES)[number];

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const businessSchema = z.object({
  name: z.string().trim().min(1),
  address: optionalText,
  link: optionalText,
});

const santaSpotSchema = z.object({
  business: z.string().trim().min(1),
  schedule: z.string().trim().min(1),
  link: optionalText,
  note: optionalText,
});

const winnerSchema = z.object({
  category: z.string().trim().min(1),
  business: z.string().trim().min(1),
  photo: optionalText,
});

const volunteerCalloutSchema = z
  .object({
    show: z.boolean().default(false),
    headline: optionalText,
    date: optionalText,
    text: optionalText,
    link: optionalText,
  })
  .optional();

const settingsSchema = z.object({
  contestStage: z.enum(CONTEST_STAGES).default('coming-soon'),
  votingDeadline: optionalText,
  votingFormUrl: optionalText,
  contestCategories: z.array(z.string().trim().min(1)).default([]),
  participatingBusinesses: z.array(businessSchema).default([]),
  santaPhotoSpots: z.array(santaSpotSchema).default([]),
  winners: z.array(winnerSchema).default([]),
  volunteerCallout: volunteerCalloutSchema,
});

export type HolidaySettings = z.infer<typeof settingsSchema>;
export type ParticipatingBusiness = z.infer<typeof businessSchema>;
export type SantaPhotoSpot = z.infer<typeof santaSpotSchema>;
export type ContestWinner = z.infer<typeof winnerSchema>;
export type VolunteerCallout = NonNullable<z.infer<typeof volunteerCalloutSchema>>;

const parsed = settingsSchema.safeParse(rawSettings);

if (!parsed.success) {
  // Fail the build loudly rather than shipping a half rendered page. The last
  // good Cloudflare Pages deploy stays live while the data is corrected.
  throw new Error(
    `src/data/holiday-settings.json is not valid:\n${parsed.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')}`,
  );
}

export const settings: HolidaySettings = parsed.data;

/** True when the volunteer callout is toggled on and has something to say. */
export function isVolunteerCalloutVisible(
  callout: VolunteerCallout | undefined,
): callout is VolunteerCallout {
  return Boolean(callout?.show && (callout.headline || callout.text));
}
