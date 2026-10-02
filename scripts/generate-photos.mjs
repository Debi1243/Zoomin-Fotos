// Generates the portfolio photographs with Google's image models.
// Usage: GEMINI_API_KEY=... node scripts/generate-photos.mjs [id ...]
// Writes public/photos/<id>.webp. Existing files are skipped unless their id is passed.
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import sharp from "sharp";

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error("Set GEMINI_API_KEY");

const { style, photos } = JSON.parse(await readFile(new URL("./photo-prompts.json", import.meta.url), "utf8"));
const only = process.argv.slice(2);
const outDir = new URL("../public/photos/", import.meta.url);
await mkdir(outDir, { recursive: true });
const api = "https://generativelanguage.googleapis.com/v1beta/models";

async function imagen(prompt, aspectRatio) {
  const res = await fetch(`${api}/imagen-4.0-generate-001:predict`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio, personGeneration: "allow_adult" } }),
  });
  if (!res.ok) throw new Error(`imagen ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error(`imagen returned no image: ${JSON.stringify(data).slice(0, 300)}`);
  return Buffer.from(b64, "base64");
}

async function flashImage(prompt, aspectRatio) {
  const res = await fetch(`${api}/gemini-2.5-flash-image:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } },
    }),
  });
  if (!res.ok) throw new Error(`flash-image ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`flash-image returned no image: ${JSON.stringify(data).slice(0, 300)}`);
  return Buffer.from(part.inlineData.data, "base64");
}

for (const p of photos) {
  if (only.length && !only.includes(p.id)) continue;
  const file = new URL(`${p.id}.webp`, outDir);
  if (!only.length && (await access(file).then(() => true, () => false))) continue;
  const prompt = `${p.prompt}. ${style}`;
  let image;
  try {
    image = await imagen(prompt, p.aspect);
  } catch (e) {
    console.warn(`${p.id}: ${e.message}; trying gemini-2.5-flash-image`);
    image = await flashImage(prompt, p.aspect);
  }
  await writeFile(file, await sharp(image).resize({ width: 1800, height: 1800, fit: "inside" }).webp({ quality: 82 }).toBuffer());
  console.log(`${p.id} saved`);
}
