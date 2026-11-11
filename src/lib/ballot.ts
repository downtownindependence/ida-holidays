/**
 * Settings for the window ballot (src/components/Ballot.astro). See
 * src/lib/forms.ts for how the site sends answers to a Google Form.
 *
 * The voting Google Form's pre-filled link is made with these answers typed in:
 *
 *   Email question             voter@example.com  (anything with an @)
 *   Favorite window 1          WINDOW1
 *   Favorite window 2          WINDOW2
 *   Favorite window 3          WINDOW3
 *   Newsletter question        NEWSLETTER         (optional question)
 *
 * Voters never type business names. They tap cards, and the page fills in
 * the names it already knows from Pages CMS.
 */
import { readPrefilledLink } from './forms';

export interface BallotConfig {
  action: string;
  formUrl: string;
  fields: {
    email: string;
    windows: [string, string, string];
    newsletter?: string;
  };
}

export function parseBallotConfig(link: string | undefined): BallotConfig | null {
  const form = readPrefilledLink(link, {
    email: '@',
    window1: 'WINDOW1',
    window2: 'WINDOW2',
    window3: 'WINDOW3',
    newsletter: 'NEWSLETTER',
  });
  if (!form) return null;
  const { email, window1, window2, window3, newsletter } = form.fields;
  if (!email || !window1 || !window2 || !window3) return null;
  return {
    action: form.action,
    formUrl: form.formUrl,
    fields: { email, windows: [window1, window2, window3], newsletter },
  };
}
