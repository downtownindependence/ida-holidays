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
| Date, time and voting link helpers | `src/lib/format.ts` |
| Timezone handling for events | `src/lib/datetime.ts` |
| Pages CMS field labels | `.pages.yml` |
| Fonts (free matches for the flyer's fonts) | `astro.config.mjs` |
| "Season of lights" headline picture | `public/images/season-of-lights.webp` |
| Link preview picture for social media | `public/images/share.jpg` |

## Look and feel

The page matches Courtney's Season of Lights flyer. Every color, font family
and key spacing value is defined once, in `src/styles/tokens.css`. No other
file hardcodes a color or a font.

The flyer uses paid Adobe fonts, so the site uses free Google Fonts that
match them closely. Astro downloads them at build time and serves them from
this site (set up in `astro.config.mjs`):

| Flyer font | Free match | Used for |
| --- | --- | --- |
| Scrapbooker Sans | Pompiere | Event names, times, headings |
| Scrapbooker Sans Italic | Barlow Condensed Light Italic | Slanted lines like "Every Saturday" |
| Cheap Pine Sans | Oswald | Small labels, locations, dates, buttons |
| Scrapbooker Script | Dancing Script | Small script words like "to" and "and" |
| Gotham | Montserrat | Running text and the footer |

The "Season of lights" headline is not a font. It is Courtney's lettering, cut
out of the flyer PDF as a picture with a see-through background
(`public/images/season-of-lights.webp`).

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

## Events

Events on the same day are grouped under one cream date circle, like the
flyer. A few optional fields in Pages CMS match how the flyer shows things:

- **Cost**: shown after the location, for example "FREE" or "$10".
- **Highlight**: a short perk in slanted type, for example "Free Santa hats".
- **Little drawing**: a small gold line drawing above the event name (cocoa
  mug, Santa hat, train, gift, letter, camera, pancakes, wreath, tree). Drawn
  in `src/components/EventIcon.astro`; the list lives in `src/lib/icons.ts`.
- **Button text**: with a link, labels the button (default "More details").
  With no link, shows a dashed placeholder that can't be clicked, like
  "Tickets coming soon".
- **Short description**: optional. Only worth adding when it says more than
  the event name.
- **Custom time text**: replaces the start and end times, for example
  "9AM or 12PM" for two seatings. The start and end times are still needed so
  the event sorts and drops off the site at the right time.

A lowercase "and" in an event name ("Cocoa Station and Photo Booth") is set
in script on its own line. The words "to" and "or" in times are set in script.

## Layout of the events

- Phone: one day after another, with a gold sparkle on the line between days.
- Half a laptop screen (tablet width): one row per day, date circle on the
  left and that day's events on the right.
- Full laptop screen: days side by side in columns, like the flyer, inside a
  thin cream frame.

## Vote banner

A red banner right under the headline points visitors to the contest, since
most arrive from the flyer's QR code. Its wording and button follow the
contest stage: "How it works" before voting, "Vote now" during voting (jumps
straight to the business cards), and so on (`src/components/VoteBanner.astro`).

## Window contest stages

The "Window contest stage" dropdown in Pages CMS drives what visitors see.
Nothing switches on its own.

| Stage | What shows |
| --- | --- |
| Coming soon | Prizes, "Voting opens Saturday, November 28", the red business sign-up box, and the list of entered windows |
| Voting open | Prizes, the deadline, an "Open the ballot" button, and a card for each business with a "Vote for this window" button |
| Voting closed | "Winners will be announced the week of ..." from the CMS date |
| Winners | 1st, 2nd and 3rd place with prizes, and photos when provided |

Prize amounts ($150, $75, $50) are set in `src/lib/settings.ts`.

### Vote buttons with the business already ticked

Paste a Google Forms **pre-filled link** into "Voting form link (pre-filled)":
in the form editor, open the ⋮ menu, choose **Get pre-filled link**, tick any
one business, then **Get link**. The site swaps that business for each card's
business, so every "Vote for this window" button opens the ballot with the
right box already ticked (`buildVoteUrl` in `src/lib/format.ts`).

Business names in Pages CMS must match the choices in the form exactly. If
they don't, the ballot still opens, just with nothing ticked. A plain form
link also works; the buttons then open the empty ballot.

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
