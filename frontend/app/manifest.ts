import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jonathan Blanchard — Portfolio",
    short_name: "Jonathan Blanchard",
    description: "Développeur full-stack & créateur d’applications",
    start_url: "/",
    display: "standalone",
    background_color: "#f5efe5",
    theme_color: "#e86f32",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
