"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Dictionary } from "~/i18n";
import { format } from "~/i18n";
import type { ProjectMedia as Media } from "~/types/api";
import { safeUrl } from "~/lib/safe-url";

function ProjectVideo({
  media,
  src,
  poster,
  t,
}: {
  media: Media;
  src: string;
  poster?: string;
  t: Dictionary;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting) video.pause();
      },
      { threshold: 0.2 },
    );
    const pause = (event: Event) => {
      if ((event as CustomEvent<HTMLVideoElement>).detail !== video)
        video.pause();
    };
    const play = () =>
      window.dispatchEvent(
        new CustomEvent("portfolio-video-play", { detail: video }),
      );
    observer.observe(video);
    window.addEventListener("portfolio-video-play", pause);
    video.addEventListener("play", play);
    return () => {
      observer.disconnect();
      window.removeEventListener("portfolio-video-play", pause);
      video.removeEventListener("play", play);
    };
  }, []);
  return (
    <video
      ref={ref}
      controls
      muted
      playsInline
      preload="metadata"
      poster={safeUrl(poster) ?? undefined}
      aria-label={media.alt}
    >
      <source src={src} />
      <p>{t.caseStudy.videoFallback}</p>
    </video>
  );
}
export function ProjectMedia({
  media,
  title,
  t,
  className = "project-visual",
  priority = false,
  poster,
}: {
  media?: Media | null;
  title: string;
  t: Dictionary;
  className?: string;
  priority?: boolean;
  poster?: string;
}) {
  // The address comes from case-study content, so it is checked before it reaches a `src`. An
  // address that is not an http(s) URL or a site-relative path renders as the placeholder, which
  // is the same thing the page shows when no media exists at all.
  const source = media ? safeUrl(media.url) : null;
  if (!media || !source)
    return (
      // Drawn in CSS rather than served as an SVG. The asset this replaced painted a window with a
      // title bar, a coloured button and two rows of text bars: a fake screenshot, on a site whose
      // own rule forbids one, and on the project still at the concept stage it showed a product
      // nobody has built. It also baked the light theme in, so the dark pages carried a white slab.
      <div
        className={`${className} media-empty`}
        role="img"
        aria-label={format(t.caseStudy.mediaPlaceholderAlt, { title })}
      >
        {/* Rendered from the dictionary, never from inside the drawing: a bilingual site cannot
            ship a hardcoded language in an image. */}
        <p className="media-note">{t.caseStudy.mediaPlaceholderNote}</p>
      </div>
    );
  if (media.type === "VIDEO")
    return (
      <div className={className}>
        <ProjectVideo media={media} src={source} poster={poster} t={t} />
      </div>
    );
  return (
    <div className={className}>
      <Image
        src={source}
        alt={media.alt}
        width={media.width ?? 1200}
        height={media.height ?? 900}
        priority={priority}
        sizes="(max-width: 760px) 100vw, 50vw"
        unoptimized
      />
    </div>
  );
}
