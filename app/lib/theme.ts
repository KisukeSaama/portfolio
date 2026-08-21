export const THEME_STORAGE_KEY = "jonathan-theme";
export const DARK_THEME_QUERY = "(prefers-color-scheme: dark)";

/** The browser chrome, matched to `--background` in each theme. */
export const THEME_COLOR = { light: "#f9f3e9", dark: "#282828" } as const;

export type Theme = keyof typeof THEME_COLOR;

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  // `<meta name="theme-color">` cannot be rendered server side with a media query here: a manual
  // choice overrides the OS, so the OS query would frame the page in the color it no longer has.
  // The pre-paint script owns the tag instead, and this keeps it in step with a later toggle.
  let meta = document.head.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLOR[theme];
}

/** The theme the OS asks for, when nothing has been chosen on the site. */
export function systemTheme(): Theme {
  return window.matchMedia(DARK_THEME_QUERY).matches ? "dark" : "light";
}

/**
 * Storage is not always there to be read. Brave with cookies blocked, Safari in lockdown and any
 * partitioned context throw a `SecurityError` on the first touch of `localStorage` rather than
 * returning null, so every access here is guarded. A blocked read is not an error condition: it
 * means no choice is on record, and the OS preference decides.
 */
export function readStoredTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

/** A choice that cannot be written still applies to this page. It just will not outlive it. */
export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Nothing to recover: the theme is already applied, only the record of it is lost.
  }
}

// Two separate `try` blocks, and that is the whole point of this script's shape. Reading
// `localStorage` does not return null when a browser has storage switched off, it throws: Brave
// with cookies blocked does it, so does Safari in lockdown. One `try` around everything meant that
// throw skipped the OS query as well, and the page rendered light on a dark desktop with no way to
// change it. A blocked read only means no choice is on record, so the OS still gets asked.
export const PRE_PAINT_THEME_SCRIPT = `(()=>{let saved=null;try{saved=localStorage.getItem('${THEME_STORAGE_KEY}')}catch{}try{const theme=saved==='light'||saved==='dark'?saved:(matchMedia('${DARK_THEME_QUERY}').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;const meta=document.createElement('meta');meta.name='theme-color';meta.content=theme==='dark'?'${THEME_COLOR.dark}':'${THEME_COLOR.light}';document.head.appendChild(meta)}catch{}})()`;
