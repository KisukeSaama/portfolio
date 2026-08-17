import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectMedia } from "~/components/project-media";
describe("médias", () => {
  it("affiche un fallback explicite", () => {
    render(<ProjectMedia title="Janus" />);
    expect(screen.getByAltText("Média de Janus à ajouter")).toHaveAttribute(
      "src",
      "/images/project-placeholder.svg",
    );
  });
});
