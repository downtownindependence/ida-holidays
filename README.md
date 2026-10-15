# Downtown Independence Holidays

Astro site for the Independence Downtown Association holiday program.

- Production: https://holidays.downtownindependence.com
- Hosting: Cloudflare Pages (static output)
- Editing: Pages CMS at https://app.pagescms.org, configured by `.pages.yml`

## Local development

```
npm install
npm run dev
npm run build
```

## Where things live

| What | File |
| --- | --- |
| All colors, fonts, spacing | `src/styles/tokens.css` |
| Page assembly | `src/pages/index.astro` |
| Page sections | `src/components/` |
| Holiday page settings | `src/data/holiday-settings.json` |
| Events | `src/content/events/` |
| Event schema | `src/content.config.ts` |
| Event filter helper | `src/lib/events.ts` |
| Settings schema and validation | `src/lib/settings.ts` |
| Date and form URL helpers | `src/lib/format.ts` |
| Timezone handling for events | `src/lib/datetime.ts` |
| Pages CMS field labels | `.pages.yml` |

## Restyling for the IDA brand

Every color, font family and key spacing value is defined once, in
`src/styles/tokens.css`. No other file hardcodes a color or a font. To apply
official brand guidelines, edit the BRAND PALETTE and TYPOGRAPHY blocks at the
top of that file and the whole page follows.

## Sections that hide themselves

These sections are left off the page entirely when they have nothing to show,
so visitors never see an empty box:

- Santa photo spots: hidden when the list in Holiday Page Settings is empty
- Volunteer callout: hidden unless "Show on the website" is turned on
- Newsletter signup: hidden until it is enabled in code (see below)

The events section always renders. With no upcoming visible events it shows a
friendly "Event details coming soon" message instead of a list.

The section is headed "Upcoming events" rather than "Saturday events", because
the program also includes dates that are not Saturdays, such as the November
community meeting.

## Event times and timezones

Pages CMS writes event times with no timezone attached, for example
`2026-11-16T17:30`. Cloudflare builds the site on a server set to UTC, so
reading those times with plain JavaScript would shift them by several hours.
`src/lib/datetime.ts` reads them as Independence local time instead, which is
what the person typing them into the CMS means. Event times are then displayed
in `America/Los_Angeles` no matter where the visitor is.

## Window contest stages

The "Window contest stage" dropdown in Pages CMS drives what visitors see:

| Stage | What shows |
| --- | --- |
| Coming soon | "Voting opens Saturday, Nov 28" |
| Voting open | The Google Form embedded in the page, plus the deadline |
| Voting closed | "Voting is closed. Winners announced the week of January 4." |
| Winners | Winners by category, with photos when provided |

Paste any Google Form link into the "Google Form link" field. The site adds the
`embedded=true` parameter itself, so the plain share link works fine.

## Turning on the newsletter signup

Open `src/components/NewsletterSignup.astro`:

1. Change `NEWSLETTER_ENABLED` from `false` to `true`.
2. Paste the EmailOctopus embed snippet between the two clearly marked
   "PASTE EMAILOCTOPUS EMBED" comment lines.

If the snippet includes a `<script src="...">` tag, add `is:inline` to it so
Astro passes it through untouched.

## Cloudflare Pages build settings

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION` = `22.22.0`
