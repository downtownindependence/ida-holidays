// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
//
// Fonts are free Google Fonts chosen to match Courtney's flyer, which uses
// paid Adobe fonts. Astro downloads them at build time and serves them from
// this site, so visitors never load anything from Google.
//
//   Flyer font               Free match used here
//   Scrapbooker Sans         Pompiere            (event names, headings)
//   Scrapbooker Sans Italic  Barlow Condensed    (slanted lines)
//   Cheap Pine Sans          Oswald              (small labels, dates)
//   Scrapbooker Script       Dancing Script      (small script words; the
//                                                 main headline is a picture)
//   Gotham                   Montserrat          (body text, footer)
export default defineConfig({
  // The live address, used to build full links for social media previews.
  // This is the address on the printed flyer's QR code. Never change it.
  site: 'https://holidays.downtownindependence.com',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Pompiere',
      cssVariable: '--font-pompiere',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow-condensed',
      weights: [300],
      styles: ['italic'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Oswald',
      cssVariable: '--font-oswald',
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Dancing Script',
      cssVariable: '--font-dancing-script',
      weights: [500],
      styles: ['normal'],
      fallbacks: ['cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: [400, 600, 700],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
  ],
});
