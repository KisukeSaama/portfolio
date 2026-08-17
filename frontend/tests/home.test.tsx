import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { episort } from "./fixtures";

vi.mock("~/lib/server-api", () => ({
  serverApi: vi.fn().mockResolvedValue([episort]),
}));

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
      screen.getByText(/complete applications for concrete problems/),
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
