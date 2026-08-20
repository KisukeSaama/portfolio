import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "~/components/theme-toggle";
import { getDictionary } from "~/i18n";

describe("theme", () => {
  let systemIsDark = false;
  let notifySystemThemeChange: () => void;

  beforeEach(() => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    notifySystemThemeChange = () => {
      const event = { matches: systemIsDark } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    };
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        media: query,
        get matches() {
          return systemIsDark;
        },
        addEventListener: (
          event: string,
          listener: (change: MediaQueryListEvent) => void,
        ) => {
          if (event === "change") listeners.add(listener);
        },
        removeEventListener: (
          event: string,
          listener: (change: MediaQueryListEvent) => void,
        ) => {
          if (event === "change") listeners.delete(listener);
        },
      })),
    );
    document.documentElement.dataset.theme = "light";
    document.head.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.remove();
    });
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("persists the manual choice", () => {
    render(<ThemeToggle t={getDictionary("en")} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to the dark theme" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("jonathan-theme")).toBe("dark");
  });

  it("follows a system theme change when there is no manual choice", () => {
    render(<ThemeToggle t={getDictionary("en")} />);

    act(() => {
      systemIsDark = true;
      notifySystemThemeChange();
    });

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(localStorage.getItem("jonathan-theme")).toBeNull();
  });

  it("keeps a manual choice when the system theme changes", () => {
    render(<ThemeToggle t={getDictionary("en")} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to the dark theme" }),
    );

    act(() => {
      systemIsDark = false;
      notifySystemThemeChange();
    });

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("keeps the browser chrome on the applied theme, not on the OS", () => {
    systemIsDark = false;
    render(<ThemeToggle t={getDictionary("en")} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to the dark theme" }),
    );

    const metas = document.head.querySelectorAll('meta[name="theme-color"]');
    expect(metas).toHaveLength(1);
    expect(metas[0]?.getAttribute("content")).toBe("#282828");
  });
});
