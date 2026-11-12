import { z } from 'astro/zod';
import rawSettings from '../data/holiday-settings.json';

export const CONTEST_STAGES = [
  'coming-soon',
  'voting-open',
  'voting-closed',
  'winners',
] as const;

export type ContestStage = (typeof CONTEST_STAGES)[number];

/** Prize for each finishing place. Change here if the board changes them. */
export const PRIZES = ['$150', '$100', '$50'] as const;

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const businessSchema = z.object({
  name: z.string().trim().min(1),
  address: optionalText,
  link: optionalText,
  photo: optionalText,
});

const santaSpotSchema = z.object({
  business: z.string().trim().min(1),
  schedule: z.string().trim().min(1),
  link: optionalText,
  note: optionalText,
});

const winnerSchema = z.object({
  place: z.coerce.number().int().min(1).max(3),
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
  // Off: the events section shows each Saturday's date with "Announcing soon"
  // instead of the event details, while the schedule is being finalized.
  showEventDetails: z.boolean().default(true),
  // A short note under "Upcoming Saturdays". Blank hides it.
  scheduleNote: optionalText,
  businessSignupUrl: optionalText,
  signupDeadline: optionalText,
  votingOpens: optionalText,
  votingDeadline: optionalText,
  winnersAnnounced: optionalText,
  decorationsThrough: optionalText,
  votingFormUrl: optionalText,
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
