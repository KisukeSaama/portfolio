import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ProjectMedia,
  ProjectMediaDock,
} from "~/components/project-media";
import { getDictionary } from "~/i18n";

describe("media", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

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

  it("selects the mobile video variant when its media query matches", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({ matches: query === "(max-width: 520px)" })),
    );
    render(
      <ProjectMedia
        title="Janus"
        t={getDictionary("en")}
        poster="/videos/janus/janus-poster.webp"
        dock
        media={{
          type: "VIDEO",
          url: "/videos/janus/janus_1080p.mp4",
          alt: "Janus demonstration",
          caption: "Presentation",
          width: 1920,
          height: 1080,
          sources: [
            {
              url: "/videos/janus/janus_360p.mp4",
              media: "(max-width: 520px)",
              width: 640,
              height: 360,
            },
            {
              url: "/videos/janus/janus_480p.mp4",
              media: "(max-width: 960px)",
              width: 854,
              height: 480,
            },
            {
              url: "/videos/janus/janus_720p.mp4",
              media: "(max-width: 1440px)",
              width: 1280,
              height: 720,
            },
          ],
        }}
      />,
    );

    const video = screen.getByLabelText("Janus demonstration");
    expect(screen.getByText("Media")).toHaveClass("media-dock-label");
    expect(screen.getByText("Presentation")).toHaveClass(
      "video-preview-caption",
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    const showModal = vi.fn(() => dialog.setAttribute("open", ""));
    Object.defineProperty(dialog, "showModal", {
      configurable: true,
      value: showModal,
    });
    const closeDialog = vi.fn(() => dialog.removeAttribute("open"));
    Object.defineProperty(dialog, "close", {
      configurable: true,
      value: closeDialog,
    });
    vi.spyOn(video as HTMLVideoElement, "play").mockResolvedValue();
    vi.spyOn(video as HTMLVideoElement, "load").mockImplementation(() => {});

    expect(video).toHaveAttribute(
      "poster",
      "/videos/janus/janus-poster.webp",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Open video: Janus demonstration",
      }),
    );
    expect(showModal).toHaveBeenCalledOnce();
    expect(dialog).toHaveAttribute("open");
    expect(video).toHaveAttribute(
      "src",
      "/videos/janus/janus_360p.mp4",
    );

    fireEvent.click(screen.getByRole("button", { name: "Video settings" }));
    const quality1080 = screen.getByRole("menuitemradio", { name: "1080p" });
    fireEvent.click(quality1080);
    expect(video).toHaveAttribute("src", "/videos/janus/janus_1080p.mp4");
    fireEvent.click(screen.getByRole("button", { name: "Video settings" }));
    expect(
      screen.getByRole("menuitemradio", { name: "1080p" }),
    ).toHaveAttribute("aria-checked", "true");

    fireEvent.ended(video);
    expect(closeDialog).toHaveBeenCalledOnce();
  });

  it("renders every project video in one media dock", () => {
    render(
      <ProjectMediaDock
        title="Episort"
        t={getDictionary("en")}
        media={[
          {
            type: "VIDEO",
            url: "/videos/episort/episort_1080p.mp4",
            alt: "Sorting workflow",
            caption: "Presentation",
            width: 1920,
            height: 1080,
            poster: "/videos/episort/episort-poster.webp",
          },
          {
            type: "VIDEO",
            url: "/videos/episort/episort_correspondance_1080p.mp4",
            alt: "TMDB matches",
            caption: "Matching",
            width: 1920,
            height: 1080,
            poster: "/videos/episort/episort_correspondance-poster.webp",
          },
          {
            type: "VIDEO",
            url: "/videos/episort/episort_conflit_1080p.mp4",
            alt: "Conflict handling",
            caption: "Conflict",
            width: 1920,
            height: 1080,
            poster: "/videos/episort/episort_conflit-poster.webp",
          },
        ]}
      />,
    );

    expect(
      screen.getAllByRole("button", { name: /Open video:/ }),
    ).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Show:/ })).toHaveLength(3);
    expect(screen.getByText("Presentation")).toHaveClass(
      "video-preview-caption",
    );
    expect(screen.getByText("Matching")).toHaveClass("video-preview-caption");
    expect(screen.getByText("Conflict")).toHaveClass("video-preview-caption");
    expect(screen.getAllByRole("dialog", { hidden: true })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Show: Matching" }));
    expect(
      screen.getByRole("button", { name: "Open video: TMDB matches" }),
    ).toBeInTheDocument();
  });
});
