import tokensCss from '../styles/tokens.css?raw';

/**
 * A <meta> tag cannot read a CSS variable, so the one color the page needs
 * outside of CSS is lifted out of the token file at build time. That keeps
 * src/styles/tokens.css the single place any color is written down.
 */
function readToken(name: string): string | null {
  const match = new RegExp(`--${name}\\s*:\\s*([^;]+);`).exec(tokensCss);
  return match ? match[1].trim() : null;
}

/** Null if the token was renamed or removed, in which case the tag is skipped. */
export const THEME_COLOR = readToken('meta-theme-color');
