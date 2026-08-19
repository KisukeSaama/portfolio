import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectMedia } from "~/components/project-media";
import { getDictionary } from "~/i18n";

describe("media", () => {
  it("shows an explicit fallback", () => {
    render(<ProjectMedia title="Janus" t={getDictionary("en")} />);
    expect(
      screen.getByAltText("Media for Janus still to be added"),
    ).toHaveAttribute("src", "/images/project-placeholder.svg");
  });
});
