import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

// Vitest runs without globals here, so Testing Library never registers its own auto cleanup and
// each render would otherwise stack in the same document.
afterEach(cleanup);

describe("public portfolio", () => {
  it("introduces Jonathan before the project proof", async () => {
    const { default: HomePage } = await import("~/[locale]/(portfolio)/page");
    render(await HomePage({ params: Promise.resolve({ locale: "en" }) }));
    const hero = screen.getByRole("heading", {
      level: 1,
      name: /Full-stack developer/,
    });
    const project = screen.getByRole("heading", { level: 3, name: "Episort" });
    expect(
      hero.compareDocumentPosition(project) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getByText(/deploy them on my own server/),
    ).toBeInTheDocument();
    const portrait = screen.getByRole("img", {
      name: "Portrait of Jonathan Blanchard smiling outdoors",
    });
    expect(portrait.getAttribute("src")).toContain(
      encodeURIComponent("/images/jonathan-blanchard.webp"),
    );
    expect(
      screen.queryByText("Portrait not published yet"),
    ).not.toBeInTheDocument();
  });

  it("states the apprenticeship terms above the story", async () => {
    const { default: HomePage } = await import("~/[locale]/(portfolio)/page");
    render(await HomePage({ params: Promise.resolve({ locale: "en" }) }));
    // A recruiter decides on the contract terms, so they must precede the prose.
    const terms = screen.getByText("Apprenticeship, 14 months");
    const intro = screen.getByRole("heading", {
      level: 2,
      name: /My journey/,
    });
    expect(
      terms.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByText("September 2026")).toBeInTheDocument();
  });

  it("keeps the journey mysterious on the home page and links to the full story", async () => {
    const { default: HomePage } = await import("~/[locale]/(portfolio)/page");
    render(await HomePage({ params: Promise.resolve({ locale: "en" }) }));

    expect(screen.getByText(/For three years at Novelty/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /See the full journey/ }),
    ).toHaveAttribute("href", "/en/journey");
    expect(
      screen.queryByText(/I chose to specialize in Java and React/),
    ).not.toBeInTheDocument();
  });

  it("continues the introduction on the journey page without repeating the home teaser", async () => {
    const { default: JourneyPage } = await import(
      "~/[locale]/(portfolio)/journey/page"
    );
    render(await JourneyPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(screen.queryByText(/For three years at Novelty/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/I chose to specialize in Java and React/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/By the end of this fourteen-month apprenticeship/),
    ).toBeInTheDocument();
  });

  it("renders the same page in French", async () => {
    const { default: HomePage } = await import("~/[locale]/(portfolio)/page");
    render(await HomePage({ params: Promise.resolve({ locale: "fr" }) }));
    expect(
      screen.getByRole("heading", { level: 1, name: /Développeur full-stack/ }),
    ).toBeInTheDocument();
  });
});
