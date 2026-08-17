import { ImageResponse } from "next/og";

export const alt =
  "Jonathan Blanchard — Développeur full-stack & créateur d’applications";
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
          Développeur full-stack & créateur d’applications
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: "#6d655c" }}>
          Des applications complètes, de l’idée au déploiement.
        </div>
      </div>
      <div style={{ height: 9, width: 190, background: "#b94c1f" }} />
    </div>,
    size,
  );
}
