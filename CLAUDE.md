# IDA Season of Lights Holiday Site (holidays.downtownindependence.com)

Read this file first in every session. It is the handoff from earlier work done on another account.

## Who you're working with
- Sydney, board member of the Independence Downtown Association (IDA), a 501(c)(3) in Independence, Oregon. Handles marketing and communications.
- Sydney is NOT a developer. Explain things in plain language.
- When Sydney has to do something outside this code (Cloudflare, Wix, Google Forms, Pages CMS), give step-by-step clicking instructions: exact website, exact button or menu names, and what she should see after each click. One small step at a time, then wait for her to confirm.
- NEVER use em dashes in anything: page copy, comments, commit messages, or replies. Use periods, commas, parentheses, or semicolons.

## What this site is
- A holiday landing page for IDA's 2026 holiday program, now named **Season of Lights**.
- It is also a pilot for IDA's full website rebuild. IDA leaves Wix in spring 2027 for this same setup.
- The printed flyer (designed by Courtney, IDA's board designer) has ONE QR code pointing to exactly https://holidays.downtownindependence.com. That QR code is final and already sent to Courtney. Never change the URL.

## Tech setup (decided, don't re-debate)
- Astro site, same as IDA's hopandheritage.com.
- GitHub repo: ida-holidays, under the IDA GitHub account (owner email info@downtownindependence.com).
- Hosting: Cloudflare Pages (free), in the info@ Cloudflare account. Custom domain holidays.downtownindependence.com is live and Active, via a CNAME record in Wix DNS (domain stays registered at Wix for now).
- Editing: Pages CMS (app.pagescms.org). Board members edit through email invites, no code. Config lives in .pages.yml.
- Forms: Google Forms (NOT Tally; Tally was dropped). One form for business sign-up, one for voting. Links are pasted into Pages CMS fields.
- Newsletter: EmailOctopus. Signup section stays hidden until the embed snippet is pasted in.
- Pushing from Sydney's Mac: the Mac's main GitHub login is a different account (performxpt), which has no access to this repo. This repo has its own git credential setting that pushes as the IDA account (downtownindependence) through the GitHub CLI. If a push is refused, check `gh auth status` shows downtownindependence logged in.
- Every push to main makes Cloudflare rebuild and publish the live site, even for notes-only changes.

## Current status (as of Nov 11, 2026)
- Phases 1 and 2 are done. Site is live, build is clean, Pages CMS works end to end (a board member added the Nov 16 Community Meeting and Wreath Stringing Party through the CMS and it published).
- Known fix already made: Pages CMS saves event times without a timezone and Cloudflare builds in UTC. Times are now handled as Pacific. Keep it that way and re-check times after any change to date handling.
- Still empty or waiting: Google Form links, participating businesses, Santa photo spots, winners, newsletter embed. Volunteer callout is toggled off and its fields are blank (nothing written yet).
- Nov 11: the Season of Lights site update was built (new look, events from the flyer, one-category contest with vote buttons, business sign-up box). See README for how it works. Check git log to see whether it has been pushed live.

## Season of Lights decisions (newest, from Cindy Wilson, IDA president, Nov 7)
These REPLACE the older four-category contest that is currently on the live page.
- Program name: Season of Lights. Events every Saturday, Nov 28 to Dec 19, 2026.
- Window Display Contest: ONE category, favorite window display.
- Top 3 vote-getters win cash: $150, $75, $50, plus a special callout in the IDA newsletter (about 1,500 local readers).
- Voting opens Nov 28 and runs through Dec 31, 2026 (Sydney's call, Nov 11). The flyer currently says Dec 24 in one place and Dec 19 in another; Sydney plans an email to everyone once the site is live. Winners were planned for the week of Dec 28, which is before voting now ends, so the CMS field is set to the week of Jan 4, 2027 until Sydney confirms. All of these are CMS fields.
- Voting: one ballot per email, voters may pick up to 3 favorite windows. Email is collected in the form but voters are NOT forced to sign in to Google. Optional newsletter opt-in checkbox on the ballot. Duplicates are removed by email at count time.
- "The storefront list is the ballot": participating businesses show as cards on the page; during voting each card has a "Vote for this window" button that opens the Google Form with that business pre-selected. DECIDED Nov 11 (Sydney): the ballot is built into the site (Ballot.astro, lib/ballot.ts). Visitors pick up to 3 cards, enter email and optional newsletter opt-in, and submit; the page POSTs the answers to the Google Form's formResponse address behind the scenes (no-cors, so the page can't see Google's reply). The voting Google Form must have 5 short-answer, non-required questions (Email, Favorite window 1-3, Newsletter), no sign-in, no one-response limit, email collection off. Its pre-filled link, made with answers voter@example.com / WINDOW1 / WINDOW2 / WINDOW3 / NEWSLETTER, goes in the CMS voting link field. A test vote from the live site is required before Nov 28. If the link can't be read, the page falls back to buttons that open the Google Form.
- Businesses enter through a free sign-up. DECIDED Nov 11 (Sydney): the sign-up form is also built into the page (SignupForm.astro, lib/signup.ts), same approach as the ballot: answers go to a sign-up Google Form behind the scenes. That form needs short-answer, non-required questions; its pre-filled link is made with BUSINESS / CONTACT / owner@example.com / PHONE / ADDRESS / WEBSITE / NOTES and goes in the CMS "Business sign-up form link" field. IDA adds each sign-up to "Participating businesses" in the CMS by hand. Sign-up deadline Nov 28. IDA volunteers walk downtown around Nov 18 with flyers to sign businesses up; the vote banner has a "Downtown business? Enter your window" link for them.
- Prize amounts are shown only inside the red business box, not to shoppers (Sydney worried big cash tiles would confuse people walking downtown). Shoppers see one line saying the top three windows win cash prizes for the business.

## Events
- Mon Nov 16, 5:30 to 8 PM: Community Meeting and Wreath Stringing Party, Independence Landing Apartments (added by a board member through the CMS).
- The Saturday events come from Courtney's newest flyer PDF ("Holiday Flyer (IN PROGRESS: Old Text)", Nov 11). Despite the file name, Sydney confirmed (Nov 11) this flyer IS what's actually happening. The older "Solstice Saturdays" flyer (Downloads/Holiday Flyer.pdf) was placeholders and branding only; never use it for content. The older list in Cindy's first email (Sip-n-Stroll Nov 28; Santa Train at Elks Lodge) is replaced by the flyer.
  - Sat Nov 28: Letters to Santa & Hot Cocoa, Independence Hotel, free, 4 to 6 PM.
  - Sat Dec 5: Holiday Bazaar, Elks Club, free, 9 AM to 4 PM. Cocoa Station, Riverfront Park, free, 11 AM to 3 PM. Santa Train, Downtown C Street, free, 12 to 3 PM.
  - Sat Dec 12: Cocoa Station and Photo Booth (free Santa hats), Riverfront Park, free, 11 AM to 3 PM. Meet Santa!, Independence Hotel, free, 4 to 6 PM.
  - Sat Dec 19: Breakfast and Buddy the Elf, Independence Hotel, $10, 9 AM or 12 PM, with a "Tickets coming soon" placeholder button until the ticket link exists. Its hidden end time is 2 PM (only controls when it drops off the site). Cocoa Station and Photo Booth (free candy canes), Riverfront Park, free, 11 AM to 3 PM.
- Sydney asked for no descriptions on these events (they only repeated the name). Descriptions are optional now. Each event has a little gold line drawing (CMS "Little drawing" field).
- Category and crowd size for these are guesses (all IDA, crowd medium, Santa Train large); neither shows on the site.

## Branding (matches Courtney's flyer; decided Nov 11)
- Deep green background #013230, gold #e0922a, red-orange #d9533a, cream #f5efe0.
- The flyer uses paid fonts (Scrapbooker Script, Scrapbooker Sans and Sans Italic, Cheap Pine Sans, Gotham). The site uses free Google Fonts that Sydney approved: Pompiere (event names, headings), Barlow Condensed Light Italic (slanted lines), Oswald (small labels), Dancing Script (small script words like "to"), Montserrat (body, footer). Set up in astro.config.mjs; Astro self-hosts them.
- The "Season of lights" headline is NOT a font. It is Courtney's lettering cut out of the flyer PDF as a see-through picture (public/images/season-of-lights.webp). Sydney rejected free script fonts for it (Dancing Script was the closest; bouncy alternatives looked childish). Sydney is checking with Courtney that using the lettering is OK; assume yes unless told otherwise.
- Dates shown in cream circles with a sunburst (month small on top, day large), one per day, events stacked underneath with gold sparkles between them.
- IDA logo (the fountain badge, from Downloads/IDA Logo (1).png) sits small at the top and larger in the footer. Its inside is filled cream so the brown and sage artwork shows on the green background (public/images/ida-logo.webp).
- The flyer's QR code (Downloads/IDA_Holidays_QR_black.svg) decodes to https://holidays.downtownindependence.com, the homepage. While voting is open the homepage puts the ballot first (compact header, banner, ballot, then events), as Sydney asked. /vote is a short address that jumps to the ballot, for any future window signs.
- Each date circle shows its weekday ("SATURDAY"); the events heading becomes "Upcoming Saturdays" once every listed date is a Saturday.
- The business box reads "Enter your window & win cash" with "Free to enter" in the small line above it.
- A red "Vote for your favorite holiday window display!" banner sits right under the headline, because the QR code lands on this page and voting must be easy to find. It follows the contest stage. The events sit inside a thin cream frame like the flyer's box.
- Footer matches the flyer: "Brought to you by the City of Independence & Independence Downtown Association".
- Mobile-first and lightweight; most visitors arrive by QR code on a phone.

## Deadlines
- Mon Nov 17: site, business sign-up form, and QR ready for the Nov 18 business walk.
- Sat Nov 28: business sign-up closes; voting form live and contest stage switched to "Voting open" in the CMS (nothing switches automatically).

## Events data model (keep it, it carries over to the future main site)
Events collection fields are shared with the future "Downtown Footfall Calendar": name, start/end date and time, location, category (IDA / City / Outside), expected crowd (small / medium / large), link, tips for businesses, short public description, show/hide toggle. Past events hide automatically.

## The two Google Forms (built Nov 11, in the info@downtownindependence.com Google account)
- Both forms and their response Sheets live in Google Drive: My Drive > Events > Season of Lights (https://drive.google.com/drive/folders/1WxhuO-u-jyNrrZ0jjIVKxm1n2LCAXojZ), next to Hop & Heritage. They share the Events folder's access.
- Site went live with the forms connected on Nov 11. Direct link for businesses: https://holidays.downtownindependence.com/#signup (works while the contest stage is Coming soon).
- "Season of Lights: Business Sign-Up". Editor: https://docs.google.com/forms/d/1YFHBOOIEPghlItJ7QOjcfakdRDJqTgXOzNIrTnaomUg/edit . 7 short-answer questions (Business name, Contact name, Email, Phone, Business address, Website or Facebook page, Notes), none required, linked to a Google Sheet of the same name, published to anyone with the link.
- "Season of Lights: Window Contest Votes". Editor: https://docs.google.com/forms/d/1ZtjimrIXhjDZqbmWSTHLATUWBHo3syiJ2q7ha-Squ9Q/edit . 5 short-answer questions (Email, Favorite window 1, 2, 3, Newsletter), none required, linked to a Google Sheet of the same name, published to anyone with the link.
- Both pre-filled links are in src/data/holiday-settings.json (CMS fields). If a question is added, removed, or retyped in either form, its entry ids change and the pre-filled link must be remade.
- Tested Nov 11 from the local site: one sign-up ("TEST - please delete") and one vote (test@example.com, "TEST WINDOW A/B - please delete") arrived. Those test rows need deleting from the forms and sheets before counting.

## Still to come after the site update
1. Done Nov 11: both Google Forms built and connected (see above). After the site goes live, send one more test from the live site if Sydney wants extra confidence, and delete the test rows.
2. Write a simple tutorial and invite Cindy, Jacquelyn, and Courtney as Pages CMS editors so Sydney is not a bottleneck.
