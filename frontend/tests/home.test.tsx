import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { episort } from "./fixtures";

vi.mock("~/lib/server-api", () => ({
  serverApi: vi.fn().mockResolvedValue([episort]),
}));

describe("portfolio public", () => {
  it("présente Jonathan avant les preuves projet", async () => {
    const { default: HomePage } = await import("~/(portfolio)/page");
    render(await HomePage());
    const hero = screen.getByRole("heading", {
      level: 1,
      name: /Développeur full-stack/,
    });
    const project = screen.getByRole("heading", { level: 3, name: "Episort" });
    expect(
      hero.compareDocumentPosition(project) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getByText(/problèmes concrets, de l’idée à l’interface/),
    ).toBeInTheDocument();
  });
});
