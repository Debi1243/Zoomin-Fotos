import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/data";

export const dynamic = "force-static";

export const alt = `${brand.name}: wedding, portrait and commercial photography in Bhubaneswar`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "src/assets/og-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f4f2ec",
          color: "#16150f",
        }}
      >
        <img src={logoSrc} alt="" width={200} height={101} />
        <div style={{ display: "flex", fontSize: 84, lineHeight: 1, letterSpacing: -3, maxWidth: 960 }}>
          Photographs that feel like the day did.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#5c584f" }}>
          <span>Photography studio · Bhubaneswar, Odisha</span>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: "#ff5a1f" }} />
        </div>
      </div>
    ),
    size,
  );
}
