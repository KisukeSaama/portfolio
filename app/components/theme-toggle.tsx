"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import type { Dictionary } from "~/i18n";
import {
  applyTheme,
  DARK_THEME_QUERY,
  isTheme,
  readStoredTheme,
  storeTheme,
  systemTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "~/lib/theme";

function subscribe(callback: () => void) {
  const systemQuery = window.matchMedia(DARK_THEME_QUERY);
  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    // A deliberate choice remains authoritative. With no choice saved, the site follows the OS,
    // including when its theme changes while this tab is already open.
    if (readStoredTheme() === null) {
      applyTheme(event.matches ? "dark" : "light");
      callback();
    }
  };
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(isTheme(event.newValue) ? event.newValue : systemTheme());
    callback();
  };

  window.addEventListener("portfolio-theme-change", callback);
  window.addEventListener("storage", handleStorageChange);
  systemQuery.addEventListener("change", handleSystemThemeChange);
  return () => {
    window.removeEventListener("portfolio-theme-change", callback);
    window.removeEventListener("storage", handleStorageChange);
    systemQuery.removeEventListener("change", handleSystemThemeChange);
  };
}

function snapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle({ t }: { t: Dictionary }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "light");
  // React strips every attribute off `<html>` when it renders that element instead of hydrating it,
  // and a hydration mismatch anywhere on the page makes it do exactly that. `data-theme` goes with
  // them, long after the pre-paint script that set it has run, and the page turns light on a dark
  // desktop. Reapplying it here is the one place that still knows what the theme should be.
  useEffect(() => {
    const resolved = readStoredTheme() ?? systemTheme();
    const lost = document.documentElement.dataset.theme !== resolved;
    applyTheme(resolved);
    if (lost) window.dispatchEvent(new Event("portfolio-theme-change"));
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
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
