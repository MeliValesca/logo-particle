// Reads the logo PNG and outputs dot positions where the logo has bright (white) pixels
// Samples on a grid and outputs a TypeScript file with coordinates

import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const INPUT = resolve(__dirname, '../src/assets/logo.png');
const OUTPUT = resolve(__dirname, '../src/logoPoints.ts');

// How many dots across we want
const GRID_SIZE = 40;
// Brightness threshold (0-255) — pixels brighter than this become dots
const THRESHOLD = 160;

async function main() {
  const image = sharp(INPUT);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Resize to grid size and get raw pixel data
  const { data, info } = await image
    .resize(GRID_SIZE, GRID_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const points = [];

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const brightness = data[idx];
      if (brightness > THRESHOLD) {
        points.push({
          x: x / info.width,   // normalized 0-1
          y: y / info.height,  // normalized 0-1
          brightness: brightness / 255,
        });
      }
    }
  }

  const ts = `// Auto-generated from logo.png — ${points.length} points
// Each point is { x, y } normalized 0..1, brightness 0..1

export type LogoPoint = { x: number; y: number; brightness: number };

export const LOGO_POINTS: LogoPoint[] = ${JSON.stringify(points, null, 2)};
`;

  writeFileSync(OUTPUT, ts);
  console.log(`Wrote ${points.length} points to ${OUTPUT}`);
}

main().catch(console.error);
