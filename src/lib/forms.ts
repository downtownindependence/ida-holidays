/**
 * Forms on this site (the window ballot and the business sign-up) look like
 * the rest of the page, but each one quietly sends its answers to a Google
 * Form, so responses land in that form's Google Sheet like any other.
 *
 * To learn where to send them, the site reads the form's "pre-filled link",
 * pasted into Pages CMS. In Google Forms that link is made by typing a
 * placeholder answer into each question (like WINDOW1 or BUSINESS). The site
 * finds each placeholder in the link to tell which question is which.
 *
 * Every question in those Google Forms should be a short-answer question,
 * and none should be required. Google quietly rejects a response that
 * doesn't fit a question, and the page can't see that rejection, so plain
 * optional text questions are the safe choice. The page does its own
 * checking before sending.
 */

export interface PrefilledForm {
  /** Where answers are sent: .../formResponse */
  action: string;
  /** The plain form link, offered as a backup if sending fails. */
  formUrl: string;
  /** Question id (like "entry.123456") for each placeholder that was found. */
  fields: Record<string, string>;
}

/**
 * Read a Google Forms pre-filled link. `placeholders` maps a name the site
 * uses ("email") to the placeholder typed into that question ("@" matches any
 * answer containing an @, so voter@example.com works for email questions).
 * Returns null if the link isn't a Google Forms link.
 */
export function readPrefilledLink(
  link: string | undefined,
  placeholders: Record<string, string>,
): PrefilledForm | null {
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

  const fields: Record<string, string> = {};
  for (const [name, placeholder] of Object.entries(placeholders)) {
    for (const [key, value] of url.searchParams) {
      if (!key.startsWith('entry.')) continue;
      const answer = value.trim();
      const found =
        placeholder === '@' ? answer.includes('@') : answer.toUpperCase() === placeholder;
      if (found) {
        fields[name] = key;
        break;
      }
    }
  }

  return { action: `${base}/formResponse`, formUrl: `${base}/viewform`, fields };
}
