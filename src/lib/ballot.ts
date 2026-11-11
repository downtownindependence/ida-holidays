/**
 * The on-site ballot sends each vote to a Google Form behind the scenes, so
 * votes land in the form's Google Sheet like any other response.
 *
 * To find out where to send them, the site reads the form's "pre-filled
 * link", pasted into Pages CMS. That link is made in Google Forms with these
 * placeholder answers typed in, so the site can tell which question is which:
 *
 *   Email question             voter@example.com  (anything with an @)
 *   Favorite window 1          WINDOW1
 *   Favorite window 2          WINDOW2
 *   Favorite window 3          WINDOW3
 *   Newsletter question        NEWSLETTER
 *
 * Every question in the form should be a short-answer question, and none
 * should be required. Google rejects a response that doesn't fit the
 * question (for example a name that isn't one of a checkbox question's
 * choices), and the site can't see that rejection, so plain text questions
 * are the safe choice.
 */

export interface BallotConfig {
  /** Where answers are sent: .../formResponse */
  action: string;
  /** The plain form link, offered if sending fails. */
  formUrl: string;
  fields: {
    email: string;
    windows: [string, string, string];
    newsletter?: string;
  };
}

export function parseBallotConfig(link: string | undefined): BallotConfig | null {
  const trimmed = link?.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  // Google Forms links look like .../forms/d/e/<long id>/viewform
  const match = /^(.*\/forms\/d\/e\/[^/]+)\//.exec(url.origin + url.pathname);
  if (!match || !/(^|\.)google\.com$/.test(url.hostname)) return null;
  const base = match[1];

  const byValue = (test: (value: string) => boolean) => {
    for (const [key, value] of url.searchParams) {
      if (key.startsWith('entry.') && test(value.trim())) return key;
    }
    return undefined;
  };
  const named = (name: string) => byValue((value) => value.toUpperCase() === name);

  const email = byValue((value) => value.includes('@'));
  const window1 = named('WINDOW1');
  const window2 = named('WINDOW2');
  const window3 = named('WINDOW3');
  const newsletter = named('NEWSLETTER');

  if (!email || !window1 || !window2 || !window3) return null;

  return {
    action: `${base}/formResponse`,
    formUrl: `${base}/viewform`,
    fields: { email, windows: [window1, window2, window3], newsletter },
  };
}
