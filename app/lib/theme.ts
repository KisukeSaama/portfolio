export const THEME_STORAGE_KEY = "jonathan-theme";
export const DARK_THEME_QUERY = "(prefers-color-scheme: dark)";

/** The browser chrome, matched to `--background` in each theme. */
export const THEME_COLOR = { light: "#f3f3f3", dark: "#282828" } as const;

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
