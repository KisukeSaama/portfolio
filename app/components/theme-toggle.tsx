"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Dictionary } from "~/i18n";
import {
  applyTheme,
  DARK_THEME_QUERY,
  isTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "~/lib/theme";

function subscribe(callback: () => void) {
  const systemTheme = window.matchMedia(DARK_THEME_QUERY);
  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    // A deliberate choice remains authoritative. With no choice saved, the site follows the OS,
    // including when its theme changes while this tab is already open.
    if (!isTheme(localStorage.getItem(THEME_STORAGE_KEY))) {
      applyTheme(event.matches ? "dark" : "light");
      callback();
    }
  };
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(
      isTheme(event.newValue)
        ? event.newValue
        : systemTheme.matches
          ? "dark"
          : "light",
    );
    callback();
  };

  window.addEventListener("portfolio-theme-change", callback);
  window.addEventListener("storage", handleStorageChange);
  systemTheme.addEventListener("change", handleSystemThemeChange);
  return () => {
    window.removeEventListener("portfolio-theme-change", callback);
    window.removeEventListener("storage", handleStorageChange);
    systemTheme.removeEventListener("change", handleSystemThemeChange);
  };
}

function snapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle({ t }: { t: Dictionary }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "light");
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event("portfolio-theme-change"));
  }
  const label = theme === "dark" ? t.theme.toLight : t.theme.toDark;
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Sun size={19} aria-hidden />
      ) : (
        <Moon size={19} aria-hidden />
      )}
    </button>
  );
}
