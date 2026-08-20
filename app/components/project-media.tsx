"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  Settings,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { Dictionary } from "~/i18n";
import { format } from "~/i18n";
import type {
  ProjectMedia as Media,
  ProjectVideoSource,
} from "~/types/content";
import { safeUrl } from "~/lib/safe-url";

type SafeVideoSource = Omit<ProjectVideoSource, "url"> & { src: string };
const CONTROLS_TIMEOUT_MS = 2000;

function formatVideoTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function ProjectVideo({
  media,
  src,
  sources,
  poster,
  t,
  variant = "thumbnail",
  showCaption = true,
}: {
  media: Media;
  src: string;
  sources: SafeVideoSource[];
  poster?: string;
  t: Dictionary;
  variant?: "thumbnail" | "stage";
  showCaption?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewAutoplayAllowedRef = useRef(false);
  const previewWasPlayingRef = useRef(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsId = useId();
  const [selectedSrc, setSelectedSrc] = useState(src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const posterSource = safeUrl(poster);
  const fallbackQuality = useMemo<SafeVideoSource>(
    () => ({
      src,
      media: null,
      width: media.width ?? 0,
      height: media.height ?? 0,
    }),
    [media.height, media.width, src],
  );
  const qualities = [...sources, fallbackQuality]
    .filter(
      (quality, index, items) =>
        items.findIndex((item) => item.src === quality.src) === index,
    )
    .sort((first, second) => second.height - first.height);

  const clearControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = null;
  }, []);

  const scheduleControlsHide = useCallback(() => {
    clearControlsTimer();
    controlsTimerRef.current = setTimeout(
      () => setControlsVisible(false),
      CONTROLS_TIMEOUT_MS,
    );
  }, [clearControlsTimer]);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (settingsOpen) clearControlsTimer();
    else scheduleControlsHide();
  }, [clearControlsTimer, scheduleControlsHide, settingsOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const pause = (event: Event) => {
      if ((event as CustomEvent<HTMLVideoElement>).detail !== video)
        video.pause();
    };
    window.addEventListener("portfolio-video-play", pause);
    return () => {
      window.removeEventListener("portfolio-video-play", pause);
      video.pause();
      clearControlsTimer();
      document.documentElement.classList.remove("video-modal-open");
    };
  }, [clearControlsTimer]);

  useEffect(() => {
    if (variant !== "stage") return;
    const preview = previewVideoRef.current;
    if (!preview) return;
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const autoplayAllowed = !reducedMotion && !connection?.saveData;
    previewAutoplayAllowedRef.current = autoplayAllowed;
    const cappedSources = sources
      .filter((source) => source.height <= 480)
      .sort((first, second) => first.height - second.height);
    const responsiveSource =
      cappedSources.find(
        (source) =>
          source.media &&
          typeof window.matchMedia === "function" &&
          window.matchMedia(source.media).matches,
      ) ?? cappedSources.at(-1) ?? fallbackQuality;
    preview.src = responsiveSource.src;
    preview.load();

    if (!autoplayAllowed) return;
    const setPlayback = (visible: boolean) => {
      if (visible && !dialogRef.current?.open)
        void preview.play().catch(() => undefined);
      else preview.pause();
    };
    if (!("IntersectionObserver" in window)) {
      setPlayback(true);
      return () => preview.pause();
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry)
          setPlayback(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(preview);
    return () => {
      observer.disconnect();
      preview.pause();
    };
  }, [fallbackQuality, sources, variant]);

  const openDialog = () => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) return;
    const preview = previewVideoRef.current;
    const startTime = preview?.currentTime ?? 0;
    previewWasPlayingRef.current = Boolean(preview && !preview.paused);
    preview?.pause();
    const responsiveSource =
      sources.find(
        (source) =>
          source.media &&
          typeof window.matchMedia === "function" &&
          window.matchMedia(source.media).matches,
      ) ?? fallbackQuality;
    setSelectedSrc(responsiveSource.src);
    setSettingsOpen(false);
    setCurrentTime(startTime);
    setControlsVisible(true);
    scheduleControlsHide();
    video.src = responsiveSource.src;
    video.currentTime = startTime;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("video-modal-open");
    void video.play().catch(() => undefined);
  };

  const closeDialog = () => dialogRef.current?.close();

  const handleDialogClose = () => {
    videoRef.current?.pause();
    setSettingsOpen(false);
    setControlsVisible(false);
    clearControlsTimer();
    document.documentElement.classList.remove("video-modal-open");
    const preview = previewVideoRef.current;
    if (
      preview &&
      previewWasPlayingRef.current &&
      previewAutoplayAllowedRef.current
    ) {
      const bounds = preview.getBoundingClientRect();
      const visibleHeight =
        Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
      if (visibleHeight >= bounds.height / 2)
        void preview.play().catch(() => undefined);
    }
  };

  const togglePreviewPlayback = () => {
    const preview = previewVideoRef.current;
    if (!preview) return;
    if (preview.paused) void preview.play().catch(() => undefined);
    else preview.pause();
  };

  const changeQuality = (quality: SafeVideoSource) => {
    const video = videoRef.current;
    if (!video || quality.src === selectedSrc) return;
    const currentTime = video.currentTime;
    const shouldResume = !video.paused;
    setSelectedSrc(quality.src);
    setSettingsOpen(false);
    setControlsVisible(true);
    scheduleControlsHide();
    video.src = quality.src;
    video.load();
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = Math.min(currentTime, video.duration || currentTime);
        if (shouldResume) void video.play().catch(() => undefined);
      },
      { once: true },
    );
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    setSettingsOpen(false);
    setControlsVisible(true);
    scheduleControlsHide();
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const toggleSettings = () => {
    const nextOpen = !settingsOpen;
    setSettingsOpen(nextOpen);
    setControlsVisible(true);
    if (nextOpen) clearControlsTimer();
    else scheduleControlsHide();
  };

  return (
    <>
      <figure
        className={`video-preview-item${variant === "stage" ? " is-stage" : ""}`}
      >
        {variant === "stage" ? (
          <div className="video-showcase-preview">
            <video
              ref={previewVideoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterSource ?? undefined}
              aria-hidden="true"
              onPlay={() => setIsPreviewPlaying(true)}
              onPause={() => setIsPreviewPlaying(false)}
            />
            <button
              className="video-showcase-open"
              type="button"
              onClick={openDialog}
              aria-label={format(t.caseStudy.openVideo, { title: media.alt })}
            />
            <span className="video-showcase-expand" aria-hidden="true">
              <Maximize2 size={18} />
            </span>
            <button
              className="video-showcase-playback"
              type="button"
              onClick={togglePreviewPlayback}
              aria-label={
                isPreviewPlaying
                  ? t.caseStudy.pauseVideo
                  : t.caseStudy.playVideo
              }
            >
              {isPreviewPlaying ? (
                <Pause size={18} fill="currentColor" aria-hidden="true" />
              ) : (
                <Play size={18} fill="currentColor" aria-hidden="true" />
              )}
            </button>
          </div>
        ) : (
          <button
            className="video-preview"
            type="button"
            onClick={openDialog}
            aria-label={format(t.caseStudy.openVideo, { title: media.alt })}
          >
            {posterSource ? (
              <Image
                src={posterSource}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 80vw"
                unoptimized
              />
            ) : (
              <span className="video-preview-fallback" aria-hidden="true">
                {media.alt}
              </span>
            )}
            <span className="video-preview-action">
              <Play size={20} fill="currentColor" aria-hidden="true" />
              <span className="visually-hidden">{t.caseStudy.watchVideo}</span>
            </span>
          </button>
        )}
        {showCaption && media.caption && (
          <figcaption className="video-preview-caption">
            {media.caption}
          </figcaption>
        )}
      </figure>
      <dialog
        ref={dialogRef}
        className="video-dialog"
        aria-label={format(t.caseStudy.videoDialogLabel, {
          title: media.alt,
        })}
        onClose={handleDialogClose}
        onCancel={(event) => {
          if (settingsOpen) {
            event.preventDefault();
            setSettingsOpen(false);
            scheduleControlsHide();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="video-dialog-panel">
          <div
            className="video-stage"
            onMouseEnter={revealControls}
            onMouseMove={revealControls}
            onMouseLeave={scheduleControlsHide}
            onPointerDown={revealControls}
            onKeyDown={revealControls}
            onFocusCapture={() => {
              clearControlsTimer();
              setControlsVisible(true);
            }}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                scheduleControlsHide();
            }}
          >
            <video
              ref={videoRef}
              className="video-dialog-player"
              muted
              playsInline
              preload="none"
              src={src}
              poster={posterSource ?? undefined}
              aria-label={media.alt}
              onClick={togglePlayback}
              onLoadedMetadata={(event) =>
                setDuration(event.currentTarget.duration)
              }
              onTimeUpdate={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              onPlay={(event) => {
                setIsPlaying(true);
                revealControls();
                window.dispatchEvent(
                  new CustomEvent("portfolio-video-play", {
                    detail: event.currentTarget,
                  }),
                );
              }}
              onPause={() => {
                setIsPlaying(false);
                if (dialogRef.current?.open) revealControls();
              }}
              onEnded={closeDialog}
              onVolumeChange={(event) =>
                setIsMuted(event.currentTarget.muted)
              }
            >
              <p>{t.caseStudy.videoFallback}</p>
            </video>
            {!isPlaying && (
              <button
                className="video-stage-play"
                type="button"
                onClick={togglePlayback}
                aria-label={t.caseStudy.playVideo}
              >
                <Play size={30} fill="currentColor" aria-hidden="true" />
              </button>
            )}
            <button
              className="video-dialog-close"
              type="button"
              onClick={closeDialog}
              aria-label={t.caseStudy.closeVideo}
            >
              <X size={22} aria-hidden="true" />
            </button>
            {settingsOpen && qualities.length > 1 && (
              <div
                className="video-settings-menu"
                id={settingsId}
                role="menu"
                aria-label={t.caseStudy.videoQuality}
              >
                <p>{t.caseStudy.videoQuality}</p>
                {qualities.map((quality) => (
                  <button
                    key={quality.src}
                    type="button"
                    role="menuitemradio"
                    aria-checked={quality.src === selectedSrc}
                    onClick={() => changeQuality(quality)}
                  >
                    <span>
                      {quality.height
                        ? `${quality.height}p`
                        : t.caseStudy.videoOriginal}
                    </span>
                    {quality.src === selectedSrc && (
                      <Check size={17} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
            <div
              className={`video-controls ${
                controlsVisible || settingsOpen ? "is-visible" : ""
              }`}
              inert={controlsVisible || settingsOpen ? undefined : true}
              aria-hidden={controlsVisible || settingsOpen ? undefined : true}
            >
              <input
                className="video-progress"
                type="range"
                min="0"
                max={duration || 0}
                step="0.01"
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => {
                  const video = videoRef.current;
                  if (video) video.currentTime = Number(event.target.value);
                }}
                aria-label={t.caseStudy.seekVideo}
              />
              <div className="video-controls-row">
                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={
                    isPlaying ? t.caseStudy.pauseVideo : t.caseStudy.playVideo
                  }
                >
                  {isPlaying ? (
                    <Pause size={20} fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Play size={20} fill="currentColor" aria-hidden="true" />
                  )}
                </button>
                <span className="video-time">
                  {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                </span>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={
                    isMuted ? t.caseStudy.unmuteVideo : t.caseStudy.muteVideo
                  }
                >
                  {isMuted ? (
                    <VolumeX size={20} aria-hidden="true" />
                  ) : (
                    <Volume2 size={20} aria-hidden="true" />
                  )}
                </button>
                <span className="video-controls-spacer" />
                {qualities.length > 1 && (
                  <button
                    type="button"
                    onClick={toggleSettings}
                    aria-label={t.caseStudy.videoSettings}
                    aria-expanded={settingsOpen}
                    aria-controls={settingsId}
                  >
                    <Settings size={20} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
export function ProjectMedia({
  media,
  title,
  t,
  className = "project-visual",
  priority = false,
  poster,
  dock = false,
}: {
  media?: Media | null;
  title: string;
  t: Dictionary;
  className?: string;
  priority?: boolean;
  poster?: string;
  dock?: boolean;
}) {
  // The address comes from case-study content, so it is checked before it reaches a `src`. An
  // address that is not an http(s) URL or a site-relative path renders as the placeholder, which
  // is the same thing the page shows when no media exists at all.
  const source = media ? safeUrl(media.url) : null;
  const videoSources = (media?.sources ?? []).flatMap((variant) => {
    const src = safeUrl(variant.url);
    return src ? [{ ...variant, src }] : [];
  });
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
      <div className={`${className} media-selector${dock ? " media-dock" : ""}`}>
        {dock && <p className="media-dock-label">{t.caseStudy.media}</p>}
        <div className="media-selector-track">
          <ProjectVideo
            media={media}
            src={source}
            sources={videoSources}
            poster={poster}
            t={t}
          />
        </div>
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

export function ProjectMediaDock({
  media,
  title,
  t,
  poster,
}: {
  media: Media[];
  title: string;
  t: Dictionary;
  poster?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const videos = useMemo(
    () =>
      media.flatMap((item) => {
        const src = safeUrl(item.url);
        if (item.type !== "VIDEO" || !src) return [];
        const sources = (item.sources ?? []).flatMap((variant) => {
          const variantSrc = safeUrl(variant.url);
          return variantSrc ? [{ ...variant, src: variantSrc }] : [];
        });
        return [{ media: item, src, sources }];
      }),
    [media],
  );
  const normalizedActiveIndex = Math.min(
    activeIndex,
    Math.max(videos.length - 1, 0),
  );
  const activeVideo = videos[normalizedActiveIndex];

  const updateNavigation = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const horizontal = window.getComputedStyle(track).flexDirection === "row";
    if (!horizontal) {
      setHasOverflow(false);
      setCanScrollPrevious(false);
      setCanScrollNext(false);
      return;
    }
    const maximumScroll = track.scrollWidth - track.clientWidth;
    setHasOverflow(maximumScroll > 1);
    setCanScrollPrevious(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft < maximumScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateNavigation();
    if (!("ResizeObserver" in window)) return;
    const observer = new ResizeObserver(updateNavigation);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateNavigation, videos.length]);

  const scrollMedia = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector<HTMLElement>(".media-selector-item");
    const distance = (item?.offsetWidth ?? 160) + 6;
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (!activeVideo)
    return <ProjectMedia title={title} t={t} className="case-media" />;

  return (
    <div className="case-media media-selector media-dock">
      <div
        className={`media-showcase${videos.length === 1 ? " is-single" : ""}`}
      >
        <ProjectVideo
          key={activeVideo.src}
          media={activeVideo.media}
          src={activeVideo.src}
          sources={activeVideo.sources}
          poster={activeVideo.media.poster ?? poster}
          t={t}
          variant="stage"
          showCaption={videos.length === 1}
        />
        {videos.length > 1 && (
          <div className="media-dock-scroller media-showcase-picker">
            <div
              ref={trackRef}
              className="media-selector-track"
              aria-label={t.caseStudy.media}
              onScroll={updateNavigation}
            >
              {videos.map((video, index) => {
                const selectorPoster = safeUrl(video.media.poster);
                const active = index === normalizedActiveIndex;
                return (
                  <figure className="media-selector-item" key={video.src}>
                    <button
                      className={`media-selector-button${active ? " is-active" : ""}`}
                      type="button"
                      aria-pressed={active}
                      aria-label={format(t.caseStudy.selectMedia, {
                        title: video.media.caption ?? video.media.alt,
                      })}
                      onClick={() => setActiveIndex(index)}
                    >
                      {selectorPoster ? (
                        <Image
                          src={selectorPoster}
                          alt=""
                          fill
                          sizes="160px"
                          unoptimized
                        />
                      ) : (
                        <span aria-hidden="true">{video.media.alt}</span>
                      )}
                      <span className="media-selector-play" aria-hidden="true">
                        <Play size={15} fill="currentColor" />
                      </span>
                    </button>
                    {video.media.caption && (
                      <figcaption className="video-preview-caption">
                        {video.media.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
            {hasOverflow && (
              <div className="media-dock-navigation">
                <button
                  type="button"
                  aria-label={t.caseStudy.previousMedia}
                  disabled={!canScrollPrevious}
                  onClick={() => scrollMedia(-1)}
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t.caseStudy.nextMedia}
                  disabled={!canScrollNext}
                  onClick={() => scrollMedia(1)}
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
