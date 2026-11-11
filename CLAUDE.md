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

## Current status (as of Nov 11, 2026)
- Phases 1 and 2 are done. Site is live, build is clean, Pages CMS works end to end (a board member added the Nov 16 Community Meeting and Wreath Stringing Party through the CMS and it published).
- Known fix already made: Pages CMS saves event times without a timezone and Cloudflare builds in UTC. Times are now handled as Pacific. Keep it that way and re-check times after any change to date handling.
- Still empty or waiting: Google Form links, participating businesses, Santa photo spots, winners, newsletter embed. Volunteer callout is written but toggled off.

## Season of Lights decisions (newest, from Cindy Wilson, IDA president, Nov 7)
These REPLACE the older four-category contest that is currently on the live page.
- Program name: Season of Lights. Events every Saturday, Nov 28 to Dec 19, 2026.
- Window Display Contest: ONE category, favorite window display.
- Top 3 vote-getters win cash: $150, $75, $50, plus a special callout in the IDA newsletter (about 1,500 local readers).
- Voting opens Nov 28. Closing date currently Dec 25, 2026 (Sydney may change it to Jan 1 after confirming with Cindy, so it must be a CMS field). Winners announced the week of Dec 28 (also a CMS field).
- Voting: one ballot per email, voters may pick up to 3 favorite windows. Email is collected in the form but voters are NOT forced to sign in to Google. Optional newsletter opt-in checkbox on the ballot. Duplicates are removed by email at count time.
- "The storefront list is the ballot": participating businesses show as cards on the page; during voting each card has a "Vote for this window" button that opens the Google Form with that business pre-selected.
- Businesses enter through a free Google Form sign-up. Sign-up deadline Nov 28. IDA volunteers walk downtown around Nov 18 with flyers to sign businesses up.

## Events known so far
- Mon Nov 16, 5:30 to 8 PM: Community Meeting and Wreath Stringing Party, Independence Landing Apartments (already live).
- Sat Nov 28, 2 to 4 PM: Sip-n-Stroll, Independence Hotel.
- Sat Dec 5, 2 to 4 PM: Santa Train, Elks Lodge.
- Sat Dec 12 and Dec 19: still being finalized by Amy (IDA).

## Branding (match Courtney's flyer)
- Deep green background #013230, gold #e0922a, red-orange #d9533a, cream #f5efe0.
- Flowing script for the main headline (e.g., Yellowtail); tall condensed all-caps for dates, labels, and event titles (e.g., Oswald).
- Saturday dates shown in cream circles with a sunburst (month small on top, day large).
- Mobile-first and lightweight; most visitors arrive by QR code on a phone.

## Deadlines
- Mon Nov 17: site, business sign-up form, and QR ready for the Nov 18 business walk.
- Sat Nov 28: business sign-up closes; voting form live and contest stage switched to "Voting open" in the CMS (nothing switches automatically).

## Events data model (keep it, it carries over to the future main site)
Events collection fields are shared with the future "Downtown Footfall Calendar": name, start/end date and time, location, category (IDA / City / Outside), expected crowd (small / medium / large), link, tips for businesses, short public description, show/hide toggle. Past events hide automatically.

## Still to come after the site update
1. Build the two Google Forms (business sign-up, voting) and paste links into the CMS.
2. Write a simple tutorial and invite Cindy, Jacquelyn, and Courtney as Pages CMS editors so Sydney is not a bottleneck.
