/**
 * Settings for the business sign-up form (src/components/SignupForm.astro).
 * See src/lib/forms.ts for how the site sends answers to a Google Form.
 *
 * The sign-up Google Form's pre-filled link is made with these answers typed in:
 *
 *   Business name              BUSINESS
 *   Contact name               CONTACT
 *   Email                      owner@example.com  (anything with an @)
 *   Phone                      PHONE              (optional question)
 *   Business address           ADDRESS
 *   Website or Facebook        WEBSITE            (optional question)
 *   Anything else              NOTES              (optional question)
 *
 * Optional questions left out of the Google Form are left off the page too.
 */
import { readPrefilledLink } from './forms';

export const SIGNUP_FIELDS = [
  'business',
  'contact',
  'email',
  'phone',
  'address',
  'website',
  'notes',
] as const;

export type SignupField = (typeof SIGNUP_FIELDS)[number];

export interface SignupConfig {
  action: string;
  formUrl: string;
  fields: Partial<Record<SignupField, string>>;
}

export function parseSignupConfig(link: string | undefined): SignupConfig | null {
  const form = readPrefilledLink(link, {
    business: 'BUSINESS',
    contact: 'CONTACT',
    email: '@',
    phone: 'PHONE',
    address: 'ADDRESS',
    website: 'WEBSITE',
    notes: 'NOTES',
  });
  if (!form) return null;
  const { business, contact, email, address } = form.fields;
  if (!business || !contact || !email || !address) return null;
  return { action: form.action, formUrl: form.formUrl, fields: form.fields };
}
