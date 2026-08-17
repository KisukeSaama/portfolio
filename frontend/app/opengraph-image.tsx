import { ImageResponse } from "next/og";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";

// One shared social card, rendered in the source language.
const t = getDictionary(defaultLocale);

export const alt = `Jonathan Blanchard — ${t.profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f5efe5",
        color: "#27231f",
        padding: "76px 84px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            background: "#e86f32",
            borderRadius: 3,
          }}
        />
        Jonathan Blanchard
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 920,
        }}
      >
        <div style={{ fontSize: 68, lineHeight: 1.08, fontWeight: 750 }}>
          {t.profile.title}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: "#6d655c" }}>
          {t.site.ogDescription}
        </div>
      </div>
      <div style={{ height: 9, width: 190, background: "#b94c1f" }} />
    </div>,
    size,
  );
}
