import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectMedia } from "~/components/project-media";
import { getDictionary } from "~/i18n";

describe("media", () => {
  it("shows an explicit fallback", () => {
    render(<ProjectMedia title="Janus" t={getDictionary("en")} />);
    // The empty slot is drawn in CSS, so its accessible name comes from the element rather than
    // from an image asset. The visible note beside it is rendered from the dictionary.
    const placeholder = screen.getByRole("img", {
      name: "Media for Janus still to be added",
    });
    expect(placeholder).toHaveClass("media-empty");
    expect(
      screen.getByText("Real project media will be added here"),
    ).toBeInTheDocument();
  });
});
