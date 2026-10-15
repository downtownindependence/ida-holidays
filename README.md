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

## Structure

- `src/pages/index.astro` - the public placeholder page
- `src/layouts/BaseLayout.astro` - html shell, global styles, color tokens
- `src/content.config.ts` - the `events` content collection schema
- `src/content/events/` - one markdown file per event (Phase 2, not rendered yet)
- `src/lib/events.ts` - `getVisibleEvents()` hides events whose `visible` flag is
  off or whose `end` date has passed
- `.pages.yml` - Pages CMS field labels and help text for board members

## Cloudflare Pages build settings

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
