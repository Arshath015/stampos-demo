import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a09",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#c9a96e",
          }}
        >
          S
        </div>
      </div>
    ),
    { ...size }
  );
}
