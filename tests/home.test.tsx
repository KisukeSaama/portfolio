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
      screen.getByText(/When it breaks, I am the one reading the logs/),
    ).toBeInTheDocument();
    const portrait = screen.getByRole("img", {
      name: "Portrait of Jonathan Blanchard smiling outdoors",
    });
    expect(portrait.getAttribute("src")).toContain(
      encodeURIComponent("/images/jonathan-blanchard.jpg"),
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
    const intro = screen.getByRole("heading", { level: 2, name: /I came to code/ });
    expect(
      terms.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByText("September 2026")).toBeInTheDocument();
  });

  it("renders the same page in French", async () => {
    const { default: HomePage } = await import("~/[locale]/(portfolio)/page");
    render(await HomePage({ params: Promise.resolve({ locale: "fr" }) }));
    expect(
      screen.getByRole("heading", { level: 1, name: /Développeur full-stack/ }),
    ).toBeInTheDocument();
  });
});
