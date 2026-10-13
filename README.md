# HomeCare Pro — multi-page home services website (demo)

A complete 31-page static website for a home-services company in Lahore, Pakistan:
home, services hub, **19 service pages**, gallery (before/after), pricing & plans, about, reviews,
areas, FAQ, contact + thank-you, privacy/terms and a 404 page. No framework, no build step for visitors —
just HTML, one CSS file and one small JS file.

## View it

Open `index.html` in a browser (works straight from the folder), or run a local server:

```bash
npm run dev        # http://localhost:4173
```

## Re-skin it for a client (about 10 minutes)

1. **Company details** — edit `data/site.json` (name, phone, WhatsApp number in international format
   without `+`, email, address, hours, stats, areas, reviews, FAQs, care plans).
2. **Services & prices** — edit `data/services.json` (names, PKR prices, what's included, FAQs).
   Remove a service by deleting its entry; its page, menu link, card and estimator row disappear.
3. **Images** — the web-ready copies in `assets/img/` are included. To swap a photo, put the new
   full-size original in `assets/img-src/` (not stored in Git because of its size) using the same file name, then run:
   ```bash
   npm run images     # makes fast web copies in assets/img/ (≈6 MB total instead of ≈115 MB)
   ```
4. **Colours** — change the variables at the top of `assets/css/style.css` (`--teal-*`, `--amber`).
5. **Rebuild the pages**:
   ```bash
   npm run build      # regenerates every .html file and checks for broken links/images
   ```

Upload the whole folder (without `node_modules`, `lib`, `data`, `*.mjs`, `assets/img-src`) to any
static host (Netlify, Vercel, Cloudflare Pages, cPanel hosting).

## Image file names

| File | Used for |
|---|---|
| `hero-home`, `hero-thumbsup`, `about-team` | home hero, "Why us" section, About page |
| `team-manager`, `team-ac-technician`, `team-electrician`, `team-cleaning-supervisor` | About page team |
| `svc-<service-slug>` | each service page hero + service cards (19) |
| `ba-<key>-before`, `ba-<key>-after` | before/after gallery (8 pairs) |

## Notes

- Prices, reviews, team names and contact details are **sample content** — replace them per client.
- The quote / contact form is a front-end demo (nothing is stored). Connect it to a form service
  (Formspree, Netlify Forms, WhatsApp API) for a real client; the "Send on WhatsApp" button already works.
