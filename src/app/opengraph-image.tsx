import { ImageResponse } from "next/og";

export const alt = "STAMP OS — AI Catalog Engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a09",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(201,169,110,0.16), transparent 50%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#191918",
              border: "1px solid rgba(201,169,110,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c9a96e",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            STAMP OS
          </div>
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.92)",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 960,
          }}
        >
          AI Catalog Engine
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.64)",
            fontSize: 30,
            marginTop: 20,
            maxWidth: 820,
          }}
        >
          AI-powered catalog image generation demo for SUGAR Cosmetics
        </div>
      </div>
    ),
    { ...size }
  );
}
