// Turns the full-size originals in assets/img-src into fast web copies in assets/img.
// For every image it writes <name>.jpg (full) and <name>-sm.jpg (small, for cards),
// and records the final sizes in data/images.json so pages can set width/height.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets/img-src';
const OUT = 'assets/img';
fs.mkdirSync(OUT, { recursive: true });

const WIDE_FULL = { 'hero-home': 2000, 'about-team': 1800 };
const sizes = {};

for (const file of fs.readdirSync(SRC).filter(f => /\.(jpe?g|png)$/i.test(f))) {
  const name = path.parse(file).name;
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  const portrait = meta.height > meta.width;
  const full = WIDE_FULL[name] ?? (portrait ? 1000 : 1600);
  const small = portrait ? 520 : 720;

  const big = await sharp(input).rotate().resize({ width: full, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${name}.jpg`));
  await sharp(input).rotate().resize({ width: small, withoutEnlargement: true })
    .jpeg({ quality: 74, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${name}-sm.jpg`));

  const smInfo = await sharp(path.join(OUT, `${name}-sm.jpg`)).metadata();
  sizes[name] = { w: big.width, h: big.height, sw: smInfo.width };
  console.log(`${name.padEnd(28)} ${big.width}x${big.height}  ${(big.size / 1024) | 0} KB`);
}

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/images.json', JSON.stringify(sizes, null, 1));
const total = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`\n${Object.keys(sizes).length} images, ${(total / 1048576).toFixed(1)} MB total in ${OUT}`);
