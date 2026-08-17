import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "~/components/theme-toggle";
import { getDictionary } from "~/i18n";

describe("theme", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    localStorage.clear();
  });
  it("persists the manual choice", () => {
    render(<ThemeToggle t={getDictionary("en")} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to the dark theme" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("jonathan-theme")).toBe("dark");
  });
});
