"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Dictionary } from "~/i18n";
import { format } from "~/i18n";
import type { ProjectMedia as Media } from "~/types/api";

function ProjectVideo({
  media,
  poster,
  t,
}: {
  media: Media;
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
      poster={poster}
      aria-label={media.alt}
    >
      <source src={media.url} />
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
  if (!media)
    return (
      <div className={className}>
        <Image
          src="/images/project-placeholder.svg"
          alt={format(t.caseStudy.mediaPlaceholderAlt, { title })}
          width={1200}
          height={900}
          priority={priority}
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>
    );
  if (media.type === "VIDEO")
    return (
      <div className={className}>
        <ProjectVideo media={media} poster={poster} t={t} />
      </div>
    );
  return (
    <div className={className}>
      <Image
        src={media.url}
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
