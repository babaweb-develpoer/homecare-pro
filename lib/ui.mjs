// Shared helpers + layout + reusable components for every generated page.
import fs from 'node:fs';

const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
export const site = readJson('data/site.json');
export const { groups, services, pairs } = readJson('data/services.json');
const imgSizes = fs.existsSync('data/images.json') ? readJson('data/images.json') : {};

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Pakistani digit grouping: 1,650,000 -> 16,50,000
export const pkr = n => {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
};
export const rs = n => 'Rs ' + pkr(n);
export const group = id => groups.find(g => g.id === id);
export const service = slug => services.find(s => s.slug === slug);
export const fromPrice = s => `${rs(s.rate[0])} / ${s.unit}`;

export const waLink = msg => `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(msg)}`;
export const telLink = `tel:+${site.phoneRaw}`;

// ---------- icons (inlined from lucide-static at build time) ----------
const iconCache = {};
export function icon(name, cls = '') {
  const key = name + '|' + cls;
  if (iconCache[key]) return iconCache[key];
  const tries = [name, { home: 'house', house: 'home' }[name]].filter(Boolean);
  let svg = '';
  for (const n of tries) {
    const f = `node_modules/lucide-static/icons/${n}.svg`;
    if (fs.existsSync(f)) { svg = fs.readFileSync(f, 'utf8'); break; }
  }
  if (!svg) { console.warn('  ! missing icon:', name); return ''; }
  svg = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ')
    .replace(/class="[^"]*"/, `class="ic ${cls}" aria-hidden="true" focusable="false"`)
    .replace(/ width="24" height="24"/, '');
  return (iconCache[key] = svg.trim());
}

// ---------- images ----------
const has = name => fs.existsSync(`assets/img/${name}.jpg`);
export const hasImg = has;

export function img(r, name, alt, { cls = '', sizes = '100vw', eager = false, high = false } = {}) {
  if (!has(name)) return `<div class="ph ${cls}" role="img" aria-label="${esc(alt)}"></div>`;
  const s = imgSizes[name] || {};
  const srcset = has(name + '-sm') ? ` srcset="${r}assets/img/${name}-sm.jpg ${s.sw || 720}w, ${r}assets/img/${name}.jpg ${s.w || 1600}w" sizes="${sizes}"` : '';
  const dims = s.w ? ` width="${s.w}" height="${s.h}"` : '';
  const load = eager ? (high ? ' fetchpriority="high"' : '') : ' loading="lazy" decoding="async"';
  return `<img${cls ? ` class="${cls}"` : ''} src="${r}assets/img/${name}.jpg"${srcset} alt="${esc(alt)}"${dims}${load}>`;
}

// ---------- logo ----------
const logoMark = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="currentColor"/><path d="M9.5 19.5 20 10l10.5 9.5V30a1.5 1.5 0 0 1-1.5 1.5H11A1.5 1.5 0 0 1 9.5 30z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 31.5V24a4 4 0 0 1 8 0v7.5" fill="none" stroke="#F5A524" stroke-width="2.4" stroke-linecap="round"/></svg>`;
const [b1, b2] = [site.brand.replace(/Pro$/, ''), 'Pro'];
const brandHtml = r => `<a class="brand" href="${r}index.html" aria-label="${site.brand} home">${logoMark}<span class="brand-text">${b1}<b>${b2}</b></span></a>`;

// ---------- header / footer ----------
function megaMenu(r) {
  return groups.map(g => `
    <div class="mega-col">
      <p class="mega-h">${icon(g.icon)} ${g.name}</p>
      <ul>${services.filter(s => s.group === g.id).map(s => `<li><a href="${r}services/${s.slug}.html">${s.name}</a></li>`).join('')}</ul>
    </div>`).join('');
}

function header(r, active) {
  const link = (href, label, key) => `<a href="${r}${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap">
  <p>${icon('clock')} ${site.hours}</p>
  <p class="topbar-r"><span>${icon('map-pin')} Serving all of ${site.city}</span><a href="${telLink}">${icon('phone')} ${site.phone}</a></p>
</div></div>
<header class="site-header" id="top">
  <div class="wrap nav">
    ${brandHtml(r)}
    <nav class="primary" id="primary-nav" aria-label="Main">
      ${link('index.html', 'Home', 'home')}
      <div class="has-mega${active === 'services' ? ' is-current' : ''}">
        <button type="button" class="mega-btn" aria-expanded="false" aria-controls="mega">Services ${icon('chevron-down')}</button>
        <div class="mega" id="mega"><div class="mega-grid">${megaMenu(r)}</div>
          <a class="mega-all" href="${r}services.html">View all 19 services ${icon('arrow-right')}</a></div>
      </div>
      ${link('gallery.html', 'Our Work', 'gallery')}
      ${link('pricing.html', 'Pricing', 'pricing')}
      ${link('about.html', 'About', 'about')}
      ${link('areas.html', 'Areas', 'areas')}
      ${link('contact.html', 'Contact', 'contact')}
    </nav>
    <div class="nav-cta">
      <a class="btn btn-ghost btn-sm nav-phone" href="${telLink}">${icon('phone')}<span>${site.phone}</span></a>
      <a class="btn btn-amber btn-sm" href="${r}contact.html">Free quote</a>
      <button type="button" class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">${icon('menu')}${icon('x')}</button>
    </div>
  </div>
</header>`;
}

function footer(r) {
  const col = (title, items) => `<div class="f-col"><h3>${title}</h3><ul>${items.map(([h, l]) => `<li><a href="${r}${h}">${l}</a></li>`).join('')}</ul></div>`;
  return `
<footer class="site-footer">
  <div class="wrap f-grid">
    <div class="f-brand">
      ${brandHtml(r)}
      <p>${site.tagline} Verified technicians, upfront PKR pricing and a 30-day warranty on every job across ${site.city}.</p>
      <ul class="f-contact">
        <li>${icon('phone')} <a href="${telLink}">${site.phone}</a></li>
        <li>${icon('message-circle')} <a href="${waLink('Hi ' + site.brand + ', I need a service.')}" rel="noopener">WhatsApp us</a></li>
        <li>${icon('mail')} <a href="mailto:${site.email}">${site.email}</a></li>
        <li>${icon('map-pin')} ${site.address}</li>
      </ul>
    </div>
    ${col('Repair & Maintenance', services.filter(s => s.group === 'repair').map(s => [`services/${s.slug}.html`, s.name]))}
    ${col('Cleaning & Renovation', services.filter(s => ['cleaning', 'renovation'].includes(s.group)).map(s => [`services/${s.slug}.html`, s.name]))}
    ${col('Energy, Extras & More', [...services.filter(s => ['energy', 'extras'].includes(s.group)).map(s => [`services/${s.slug}.html`, s.name]), ['gallery.html', 'Our Work'], ['pricing.html', 'Pricing & Plans'], ['faq.html', 'FAQ'], ['contact.html', 'Contact']])}
  </div>
  <div class="wrap f-bottom">
    <p>© ${new Date().getFullYear()} ${site.brand}. All rights reserved.</p>
    <p><a href="${r}privacy.html">Privacy &amp; Terms</a> · <a href="${r}areas.html">Areas</a> · <a href="${r}about.html">About</a></p>
    <p class="f-demo">Demo website: company, prices, reviews and contact details are sample content.</p>
  </div>
</footer>
<div class="dock" role="navigation" aria-label="Quick contact">
  <a href="${telLink}">${icon('phone')}<span>Call</span></a>
  <a href="${waLink('Hi ' + site.brand + ', I need a service.')}" rel="noopener" class="dock-wa">${icon('message-circle')}<span>WhatsApp</span></a>
  <a href="${r}contact.html" class="dock-q">${icon('receipt')}<span>Free quote</span></a>
</div>
<a class="wa-float" href="${waLink('Hi ' + site.brand + ', I need a service.')}" rel="noopener" aria-label="Chat on WhatsApp">${icon('message-circle')}<span>WhatsApp</span></a>`;
}

// ---------- full page ----------
export function layout({ r = '', title, desc, body, active = '', jsonld = [], ogImage = 'hero-home', noindex = false }) {
  const fullTitle = title.includes(site.brand) ? title : `${title} | ${site.brand}`;
  const og = has(ogImage) ? `${r}assets/img/${ogImage}.jpg` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0D5C57">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
${og ? `<meta property="og:image" content="${og}">` : ''}
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap">
<link rel="stylesheet" href="${r}assets/css/style.css">
<script src="${r}assets/js/main.js" defer></script>
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body data-root="${r}">
${header(r, active)}
<main id="main">
${body}
</main>
${footer(r)}
</body>
</html>
`;
}

// ---------- components ----------
export const stars = (n = 5) => `<span class="stars" role="img" aria-label="${n} out of 5 stars">${Array.from({ length: 5 }, (_, i) => `<span class="${i < n ? 'on' : ''}">${icon('star')}</span>`).join('')}</span>`;

export function pageHero(r, { eyebrow, title, text, crumbs = [], image = null }) {
  return `
<section class="page-hero">
  <div class="wrap">
    ${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${r}index.html">Home</a>${crumbs.map(([h, l]) => h ? ` ${icon('chevron-down', 'sep')} <a href="${r}${h}">${l}</a>` : ` ${icon('chevron-down', 'sep')} <span aria-current="page">${l}</span>`).join('')}</nav>` : ''}
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    ${text ? `<p class="lead">${text}</p>` : ''}
  </div>
</section>`;
}

export function sectionHead({ eyebrow, title, text = '', center = true }) {
  return `<div class="sec-head${center ? ' center' : ''} reveal"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${text ? `<p class="lead">${text}</p>` : ''}</div>`;
}

export function serviceCard(r, s) {
  const g = group(s.group);
  return `
<a class="svc-card reveal" href="${r}services/${s.slug}.html" data-group="${s.group}">
  <div class="svc-media">${img(r, 'svc-' + s.slug, `${s.name} by ${site.brand}`, { sizes: '(min-width: 1100px) 360px, (min-width: 640px) 45vw, 92vw' })}<span class="svc-icon">${icon(s.icon)}</span></div>
  <div class="svc-body">
    <p class="svc-grp">${g.name}</p>
    <h3>${s.name}</h3>
    <p>${s.short}</p>
    <p class="svc-foot"><span class="price"><small>From</small> ${rs(s.rate[0])}<small> / ${s.unit}</small></span><span class="go">${icon('arrow-right')}</span></p>
  </div>
</a>`;
}

export function pairCard(r, p) {
  const s = service(p.service);
  return `
<figure class="pair reveal" data-group="${p.group}">
  <div class="pair-imgs">
    <div>${img(r, `ba-${p.key}-before`, `Before: ${p.title}`, { sizes: '(min-width: 900px) 20vw, 45vw' })}<span class="tag tag-b">Before</span></div>
    <div>${img(r, `ba-${p.key}-after`, `After: ${p.title}`, { sizes: '(min-width: 900px) 20vw, 45vw' })}<span class="tag tag-a">After</span></div>
  </div>
  <figcaption><strong>${p.title}</strong><span>${p.caption}</span><a href="${r}services/${s.slug}.html">${s.name} ${icon('arrow-right')}</a></figcaption>
</figure>`;
}

export function slider(r, p, { eager = false } = {}) {
  return `
<div class="cmp reveal" data-compare style="--pos:50%">
  ${img(r, `ba-${p.key}-after`, `After: ${p.title}`, { cls: 'cmp-img', sizes: '(min-width: 900px) 460px, 92vw', eager })}
  <div class="cmp-before">${img(r, `ba-${p.key}-before`, `Before: ${p.title}`, { cls: 'cmp-img', sizes: '(min-width: 900px) 460px, 92vw', eager })}</div>
  <span class="tag tag-b">Before</span><span class="tag tag-a">After</span>
  <div class="cmp-handle" aria-hidden="true"><span>${icon('move-horizontal')}</span></div>
  <input class="cmp-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after: ${esc(p.title)}">
</div>`;
}

export function reviewCard(rv) {
  const initials = rv.name.split(' ').map(w => w[0]).join('');
  return `
<figure class="review reveal">
  ${stars(rv.stars)}
  <blockquote>${rv.text}</blockquote>
  <figcaption><span class="avatar">${initials}</span><span><strong>${rv.name}</strong><small>${rv.area} · ${rv.service}</small></span></figcaption>
</figure>`;
}

export function faqList(items, name = 'faq') {
  return `<div class="faq-list">${items.map((f, i) => `
  <details name="${name}"${i === 0 ? ' open' : ''}>
    <summary>${f.q || f[0]}<span class="chev">${icon('chevron-down')}</span></summary>
    <div class="faq-a"><p>${f.a || f[1]}</p></div>
  </details>`).join('')}</div>`;
}

export function ctaBand(r, { title = 'Ready to get it fixed?', text = 'Tell us what you need and we will send a clear PKR quote, usually within 15 minutes.' } = {}) {
  return `
<section class="cta-band">
  <div class="wrap cta-inner reveal">
    <div><h2>${title}</h2><p>${text}</p></div>
    <div class="cta-actions">
      <a class="btn btn-amber btn-lg" href="${r}contact.html">${icon('receipt')} Get a free quote</a>
      <a class="btn btn-white btn-lg" href="${waLink('Hi ' + site.brand + ', I would like a quote.')}" rel="noopener">${icon('message-circle')} WhatsApp us</a>
      <a class="btn btn-line btn-lg" href="${telLink}">${icon('phone')} ${site.phone}</a>
    </div>
  </div>
</section>`;
}
