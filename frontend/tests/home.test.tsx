import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { episort } from "./fixtures";

vi.mock("~/lib/server-api", () => ({
  serverApi: vi.fn().mockResolvedValue([episort]),
  serverApiOrNull: vi.fn().mockResolvedValue([episort]),
}));

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

  it("keeps the narrative when the project API is unreachable", async () => {
    const { serverApiOrNull } = await import("~/lib/server-api");
    vi.mocked(serverApiOrNull).mockResolvedValueOnce(null);
    const { default: HomePage } = await import("~/[locale]/(portfolio)/page");
    render(await HomePage({ params: Promise.resolve({ locale: "en" }) }));
    // The hero, the terms and the story are local content and must survive a backend outage.
    expect(
      screen.getByRole("heading", { level: 1, name: /Full-stack developer/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Apprenticeship, 14 months")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /not answering right now/,
    );
    expect(
      screen.queryByRole("heading", { level: 3, name: "Episort" }),
    ).not.toBeInTheDocument();
  });
});
