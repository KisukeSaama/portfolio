import type { MetadataRoute } from "next";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";

export default function manifest(): MetadataRoute.Manifest {
  // The manifest is served once, outside any locale segment, so it uses the source language.
  const t = getDictionary(defaultLocale);
  return {
    name: "Jonathan Blanchard | Portfolio",
    short_name: "Jonathan Blanchard",
    description: t.profile.title,
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: "#f5efe5",
    theme_color: "#e86f32",
    icons: [
      {
        src: "/images/jonathan-blanchard-logo-192.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/images/jonathan-blanchard-logo.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
