// Generates every HTML page from data/*.json + lib/*.mjs.  Run:  node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { layout, services, site } from './lib/ui.mjs';
import * as P from './lib/pages.mjs';

fs.mkdirSync('services', { recursive: true });
fs.mkdirSync('assets', { recursive: true });

const pages = [
  P.home(), P.servicesHub(), P.gallery(), P.pricing(), P.about(), P.reviews(), P.areas(),
  P.faq(), P.contact(), P.thankYou(), P.privacy(), P.notFound(),
  ...services.map(P.servicePage)
];

for (const p of pages) {
  const html = layout(p);
  fs.mkdirSync(path.dirname(p.file), { recursive: true });
  fs.writeFileSync(p.file, html);
}

fs.writeFileSync('assets/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#0D5C57"/><path d="M9.5 19.5 20 10l10.5 9.5V30a1.5 1.5 0 0 1-1.5 1.5H11A1.5 1.5 0 0 1 9.5 30z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 31.5V24a4 4 0 0 1 8 0v7.5" fill="none" stroke="#F5A524" stroke-width="2.4" stroke-linecap="round"/></svg>`);

console.log(`Built ${pages.length} pages for ${site.brand}.`);

// ---- link & asset check -------------------------------------------------
let bad = 0;
for (const p of pages) {
  const html = fs.readFileSync(p.file, 'utf8');
  const dir = path.dirname(p.file);
  const refs = [...html.matchAll(/(?:href|src)="([^"#?][^"]*)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    const target = path.normalize(path.join(dir, ref.split('#')[0].split('?')[0]));
    if (!fs.existsSync(target)) { bad++; console.warn(`  ✗ ${p.file} -> ${ref}`); }
  }
  const srcsets = [...html.matchAll(/srcset="([^"]+)"/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(' ')[0]));
  for (const ref of srcsets) {
    if (!fs.existsSync(path.normalize(path.join(dir, ref)))) { bad++; console.warn(`  ✗ ${p.file} srcset -> ${ref}`); }
  }
}
console.log(bad ? `${bad} broken reference(s).` : 'All internal links and images resolve.');
