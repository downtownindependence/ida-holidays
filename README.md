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
| Coming soon | "Voting opens Saturday, November 28", the red business box (prize amounts and the sign-up form), and the list of entered windows |
| Voting open | The deadline and the ballot: a card for each business with a "Pick this window" button, then email and submit |
| Voting closed | "Winners will be announced the week of ..." from the CMS date |
| Winners | 1st, 2nd and 3rd place with prizes, and photos when provided |

Prize amounts ($150, $75, $50) are set in `src/lib/settings.ts`.

### Forms built into the page

Both the ballot and the business sign-up look like the rest of the site and
never send people to a Google page. Each one quietly sends its answers to its
own Google Form, so responses land in that form's Google Sheet
(`src/lib/forms.ts`). The same rules apply to both Google Forms: every
question is **short answer**, none required, no response validation, no
Google sign-in, no one-response limit, and email collection turned off. The
site learns which question is which from a pre-filled link made with
placeholder answers, pasted into Pages CMS.

### Business sign-up

Shown inside the red business box while the stage is Coming soon, along with
the prize amounts (kept out of the shoppers' part of the page so it doesn't
read like voters win cash). Fields: business name, contact name, email,
phone, address, website, notes. Phone, website and notes are optional and are
left off the page if the Google Form doesn't have them.

Placeholders for the pre-filled link: `BUSINESS`, `CONTACT`,
`owner@example.com`, `PHONE`, `ADDRESS`, `WEBSITE`, `NOTES`
(`src/lib/signup.ts`, `src/components/SignupForm.astro`).

Sign-ups do not appear on the page by themselves. Someone at IDA adds each
business to "Participating businesses" in Pages CMS from the sheet.

### The ballot on the page

During voting, the business cards are the ballot. Visitors tap "Pick this
window" on up to three cards, type their email (plus an optional newsletter
box), and tap "Submit my vote". A floating "Finish voting" bar helps on phones.
After voting they see a thank-you with their picks, and a "Vote with another
email" button for people sharing a phone.

Voters never type business names; the page fills in the names from Pages CMS.
Behind the scenes the page sends each vote to a Google Form, so votes land in
that form's Google Sheet like any other response (`src/components/Ballot.astro`
and `src/lib/ballot.ts`). Google doesn't let the page see whether it accepted
a vote, so the form must be set up so it can't reject one:

- Five **short answer** questions: Email, Favorite window 1, Favorite window 2,
  Favorite window 3, Newsletter. None marked required. No response
  validation.
- Settings: not limited to one response per person, no Google sign-in, email
  collection turned off (the Email question does that job).
- Make a **pre-filled link** with these exact answers and paste it into
  "Voting form link (pre-filled)" in Pages CMS: `voter@example.com`,
  `WINDOW1`, `WINDOW2`, `WINDOW3`, `NEWSLETTER`. The site reads the link to
  learn which question is which.

Send a test vote from the live site before voting opens and check it arrives
in the sheet. If the pasted link isn't a correctly made pre-filled link, the
page falls back to buttons that open the Google Form instead
(`buildVoteUrl` in `src/lib/format.ts`).

Counting: each row has up to three business names in the three window
columns. Remove duplicate emails first, then count how many times each name
appears across those three columns.

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
