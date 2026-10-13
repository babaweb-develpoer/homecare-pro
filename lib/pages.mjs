// Every page body. Each function returns { file, title, desc, body, active, ... } for build.mjs.
import {
  site, groups, services, pairs, esc, rs, pkr, group, service, icon, img, hasImg, stars, waLink, telLink, fromPrice,
  pageHero, sectionHead, serviceCard, pairCard, slider, reviewCard, faqList, ctaBand
} from './ui.mjs';

const SERVICE_COUNT = services.length;
const optGroups = () => groups.map(g => `<optgroup label="${g.name}">${services.filter(s => s.group === g.id).map(s => `<option value="${s.slug}">${s.name}</option>`).join('')}</optgroup>`).join('');
const fmtStat = s => `<div class="stat reveal"><strong data-count="${s.value}" data-dec="${s.decimals || 0}">${s.value}</strong><span class="suf">${s.suffix}</span><p>${s.label}</p></div>`;

const localBusiness = () => ({
  '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: site.brand, telephone: site.phone, email: site.email,
  address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: site.city, addressCountry: 'PK' },
  areaServed: site.areas, priceRange: 'Rs 1,200 – Rs 1,650,000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '3200' }
});

/* ------------------------------------------------------------------ HOME */
export function home() {
  const r = '';
  const quick = ['ac', 'plumbing', 'electrician', 'deep-cleaning', 'painting', 'solar'].map(slug => service(slug));
  const featured = pairs.find(p => p.slider);
  const miniPairs = pairs.filter(p => !p.slider).slice(0, 3);
  const marquee = services.map(s => `<li>${icon(s.icon)} ${s.name}</li>`).join('');
  const body = `
<section class="hero">
  <div class="hero-media">${img(r, 'hero-home', 'HomeCare Pro technicians standing in a bright Lahore living room while a family relaxes behind them', { cls: 'hero-img', eager: true, high: true, sizes: '(min-width: 900px) 62vw, 100vw' })}</div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow on-dark">${icon('badge-check')} Lahore's all-in-one home service team</p>
      <h1>Every home service. <em>One trusted team.</em></h1>
      <p class="lead">AC, plumbing, electrical, deep cleaning, painting, solar and ${SERVICE_COUNT - 6} more, all done by verified technicians with upfront PKR pricing and a 30-day warranty.</p>
      <div class="hero-cta">
        <a class="btn btn-amber btn-lg" href="contact.html">${icon('receipt')} Get a free quote</a>
        <a class="btn btn-glass btn-lg" href="${waLink('Hi ' + site.brand + ', I need a service.')}" rel="noopener">${icon('message-circle')} WhatsApp us</a>
      </div>
      <ul class="hero-trust">
        <li>${icon('check')} Same-day visits</li><li>${icon('check')} Upfront PKR pricing</li><li>${icon('check')} 30-day warranty</li><li>${icon('check')} ID-verified team</li>
      </ul>
    </div>
    <aside class="hero-float" aria-label="Customer rating">
      <div class="float-card"><div class="float-stars">${stars(5)}</div><strong>4.9 / 5</strong><span>from 3,200+ happy homes in ${site.city}</span></div>
    </aside>
  </div>
  <div class="wrap quick">
    <p>What do you need today?</p>
    <ul>${quick.map(s => `<li><a href="services/${s.slug}.html">${icon(s.icon)} ${s.name.replace(' & Repair', '').replace(' Service', '')}</a></li>`).join('')}<li><a class="quick-all" href="services.html">All ${SERVICE_COUNT} services ${icon('arrow-right')}</a></li></ul>
  </div>
</section>

<div class="marquee" aria-hidden="true"><ul>${marquee}${marquee}</ul></div>

<section class="stats"><div class="wrap stats-grid">${site.stats.map(fmtStat).join('')}</div></section>

<section class="section" id="services">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Our services', title: `${SERVICE_COUNT} services. One number to call.`, text: 'Whatever your home needs, from a leaking tap to a full solar system, our specialist teams handle it.' })}
    <div class="filters reveal" role="group" aria-label="Filter services">
      <button type="button" class="chip is-on" data-filter="all">All</button>
      ${groups.map(g => `<button type="button" class="chip" data-filter="${g.id}">${g.name}</button>`).join('')}
    </div>
    <div class="svc-grid" data-filter-grid>${services.map(s => serviceCard(r, s)).join('')}</div>
  </div>
</section>

<section class="section section-tint estimator" id="estimate">
  <div class="wrap est-grid">
    <div class="est-copy reveal">
      <p class="eyebrow">Instant estimate</p>
      <h2>Know the cost before you call.</h2>
      <p class="lead">Pick a service and quantity to see a realistic price range in PKR. No sign-up, no waiting.</p>
      <ul class="ticks"><li>${icon('circle-check')} Transparent starting prices on every service</li><li>${icon('circle-check')} Free on-site inspection for bigger jobs</li><li>${icon('circle-check')} You approve the final price before work starts</li></ul>
    </div>
    <form class="est-card reveal" data-estimator onsubmit="return false">
      <label>Service<select name="service">${optGroups()}</select></label>
      <label>Quantity <small data-unit></small>
        <div class="stepper"><button type="button" data-dec aria-label="Decrease">−</button><input type="number" name="qty" value="1" min="1" max="500" inputmode="numeric"><button type="button" data-inc aria-label="Increase">+</button></div>
      </label>
      <div class="est-result" aria-live="polite"><small>Estimated cost</small><strong data-total>Rs 2,500</strong><small data-note></small></div>
      <a class="btn btn-amber btn-block" data-est-link href="contact.html">${icon('receipt')} Book at this price</a>
      <p class="fine">Estimates only. The final price is confirmed after inspection.</p>
    </form>
  </div>
  <script type="application/json" id="svc-data">${JSON.stringify(services.map(s => ({ slug: s.slug, name: s.name, unit: s.unit, lo: s.rate[0], hi: s.rate[1] })))}</script>
</section>

<section class="section why">
  <div class="wrap why-grid">
    <div class="why-media reveal">
      ${img(r, 'hero-thumbsup', 'A HomeCare Pro technician giving a thumbs up beside a freshly serviced split AC', { sizes: '(min-width: 900px) 46vw, 92vw' })}
      <div class="badge-float">${icon('shield-check')}<div><strong>30-day warranty</strong><span>on every job</span></div></div>
    </div>
    <div class="why-copy">
      ${sectionHead({ eyebrow: `Why ${site.brand}`, title: 'Professional service you can trust at your door.', center: false })}
      <div class="why-list">${site.why.map(w => `<div class="why-item reveal"><span class="why-ic">${icon(w.icon)}</span><div><h3>${w.title}</h3><p>${w.text}</p></div></div>`).join('')}</div>
    </div>
  </div>
</section>

<section class="section section-dark steps-sec">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'How it works', title: 'From call to done in four simple steps.' })}
    <ol class="steps">${site.steps.map((s, i) => `<li class="reveal"><span class="step-n">${i + 1}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section results">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Real results', title: 'See the difference our team makes.', text: 'Drag the slider on the AC job, then browse a few more transformations.' })}
    <div class="results-grid">
      <div class="results-main">${slider(r, featured)}<p class="cmp-cap reveal"><strong>${featured.title}.</strong> ${featured.caption}</p></div>
      <div class="results-side">${miniPairs.map(p => pairCard(r, p)).join('')}</div>
    </div>
    <p class="center reveal"><a class="btn btn-teal btn-lg" href="gallery.html">View all our work ${icon('arrow-right')}</a></p>
  </div>
</section>

<section class="section section-tint">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Customer reviews', title: 'Loved by homes across Lahore.', text: 'More than 3,200 five-star jobs and counting.' })}
    <div class="review-grid">${site.reviews.slice(0, 3).map(reviewCard).join('')}</div>
    <p class="center reveal"><a class="btn btn-ghost-dark" href="reviews.html">Read more reviews ${icon('arrow-right')}</a></p>
  </div>
</section>

<section class="section areas-teaser">
  <div class="wrap areas-grid">
    <div class="reveal">
      <p class="eyebrow">Where we work</p>
      <h2>Serving all of ${site.city}.</h2>
      <p class="lead">Technicians are based across the city, so help is rarely far away.</p>
      <a class="btn btn-teal" href="areas.html">${icon('map-pin')} See all areas</a>
    </div>
    <ul class="chips reveal">${site.areas.slice(0, 14).map(a => `<li>${icon('map-pin')} ${a}</li>`).join('')}<li class="more">+ more</li></ul>
  </div>
</section>

<section class="section">
  <div class="wrap faq-teaser">
    ${sectionHead({ eyebrow: 'Quick answers', title: 'Frequently asked questions' })}
    ${faqList(site.faqs.slice(0, 5), 'home-faq')}
    <p class="center reveal"><a class="btn btn-ghost-dark" href="faq.html">See all FAQs ${icon('arrow-right')}</a></p>
  </div>
</section>

${ctaBand(r)}`;
  return {
    file: 'index.html', r, active: 'home',
    title: `${site.brand}: Home Services in ${site.city} | AC, Plumbing, Cleaning, Solar`,
    desc: `${SERVICE_COUNT} home services in ${site.city}: AC, plumbing, electrician, deep cleaning, painting, roof heat-proofing, solar and more. Upfront PKR pricing and a 30-day warranty.`,
    body, jsonld: [localBusiness()]
  };
}

/* ------------------------------------------------------------ SERVICES HUB */
export function servicesHub() {
  const r = '';
  const body = `
${pageHero(r, { eyebrow: 'All services', title: `${SERVICE_COUNT} home services, one trusted team.`, text: 'Choose a service to see what is included, starting prices in PKR, FAQs and real results.', crumbs: [[null, 'Services']] })}
${groups.map(g => `
<section class="section${g.id === 'cleaning' || g.id === 'energy' ? ' section-tint' : ''}" id="${g.id}">
  <div class="wrap">
    <div class="grp-head reveal"><span class="grp-ic">${icon(g.icon)}</span><div><h2>${g.name}</h2><p>${g.blurb}</p></div></div>
    <div class="svc-grid">${services.filter(s => s.group === g.id).map(s => serviceCard(r, s)).join('')}</div>
  </div>
</section>`).join('')}
${ctaBand(r, { title: "Not sure which service you need?", text: 'Describe the problem and our team will point you to the right fix and a clear price.' })}`;
  return { file: 'services.html', r, active: 'services', title: `All Home Services in ${site.city}`, desc: `Browse all ${SERVICE_COUNT} services: repair, cleaning, renovation, solar, CCTV, shifting and gardening in ${site.city}.`, body };
}

/* ------------------------------------------------------------ SERVICE PAGE */
export function servicePage(s) {
  const r = '../';
  const g = group(s.group);
  const pair = s.ba ? pairs.find(p => p.key === s.ba) : null;
  const related = services.filter(x => x.group === s.group && x.slug !== s.slug);
  const more = [...related, ...services.filter(x => x.group !== s.group)].slice(0, 3);
  const pageUrl = `services/${s.slug}.html`;
  const body = `
<section class="svc-hero">
  <div class="wrap svc-hero-grid">
    <div class="svc-hero-copy">
      <nav class="crumbs on-dark" aria-label="Breadcrumb"><a href="${r}index.html">Home</a> ${icon('chevron-down', 'sep')} <a href="${r}services.html#${g.id}">${g.name}</a> ${icon('chevron-down', 'sep')} <span aria-current="page">${s.name}</span></nav>
      <p class="eyebrow on-dark">${icon(s.icon)} ${g.name}</p>
      <h1>${s.name} <em>in ${site.city}</em></h1>
      <p class="lead">${s.tagline} ${s.intro.split('. ')[0]}.</p>
      <p class="from-price"><small>Starting from</small><strong>${rs(s.rate[0])}</strong><small>/ ${s.unit}</small></p>
      <div class="hero-cta">
        <a class="btn btn-amber btn-lg" href="${r}contact.html?service=${s.slug}">${icon('receipt')} Get a free quote</a>
        <a class="btn btn-glass btn-lg" href="${waLink(`Hi ${site.brand}, I need ${s.name}.`)}" rel="noopener">${icon('message-circle')} WhatsApp</a>
      </div>
      <ul class="hero-trust"><li>${icon('timer')} ${s.time}</li><li>${icon('shield-check')} ${s.warranty}</li></ul>
    </div>
    <div class="svc-hero-media">${img(r, 'svc-' + s.slug, `${s.name} by ${site.brand} technicians`, { eager: true, high: true, sizes: '(min-width: 900px) 48vw, 92vw' })}</div>
  </div>
</section>

<section class="section">
  <div class="wrap svc-layout">
    <div class="svc-main">
      <div class="reveal">
        <p class="eyebrow">About this service</p>
        <h2>${s.tagline}</h2>
        <p class="lead">${s.intro}</p>
      </div>
      <div class="includes reveal">
        <h3>What's included</h3>
        <ul class="ticks cols">${s.includes.map(i => `<li>${icon('circle-check')} ${i}</li>`).join('')}</ul>
      </div>

      <div class="reveal">
        <h3 class="h-mt">How it works</h3>
        <ol class="mini-steps">${site.steps.map((st, i) => `<li><span>${i + 1}</span><div><strong>${st.title}</strong><p>${st.text}</p></div></li>`).join('')}</ol>
      </div>

      <div id="pricing" class="reveal">
        <h3 class="h-mt">Pricing</h3>
        <div class="tiers">${s.tiers.map((t, i) => `<div class="tier${i === 1 ? ' is-pop' : ''}">${i === 1 ? '<span class="pop">Most booked</span>' : ''}<h4>${t[0]}</h4><p class="tier-price">${t[1]}</p><p>${t[2]}</p><a class="btn ${i === 1 ? 'btn-amber' : 'btn-ghost-dark'} btn-block" href="${r}contact.html?service=${s.slug}">Book this</a></div>`).join('')}</div>
        <p class="fine">Sample prices for this demo. Parts and materials are quoted separately. Final price confirmed before work begins.</p>
      </div>

      ${pair ? `<div class="reveal"><h3 class="h-mt">Real results</h3>${pairCard(r, pair).replace('pair reveal', 'pair pair-wide')}</div>` : ''}

      <div class="reveal">
        <h3 class="h-mt">${s.name}: your questions answered</h3>
        ${faqList(s.faqs, 'svc-faq')}
      </div>
    </div>

    <aside class="svc-side">
      <form class="quote-card" data-quote action="${r}thank-you.html" method="get" novalidate>
        <h3>Get a free quote</h3>
        <p>Reply within 15 minutes, ${site.hours.split('·')[0].trim().toLowerCase()}.</p>
        <input type="hidden" name="service" value="${s.slug}">
        <input type="hidden" name="sn" value="${s.name}">
        <label>Your name<input name="name" autocomplete="name" required placeholder="e.g. Ahmed Khan"></label>
        <label>Phone / WhatsApp<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+\\s\\-]{10,16}" placeholder="03XX XXXXXXX"></label>
        <label>Area<input name="area" list="area-list" autocomplete="off" placeholder="e.g. DHA Phase 5"></label>
        <datalist id="area-list">${site.areas.map(a => `<option value="${a}">`).join('')}</datalist>
        <button class="btn btn-amber btn-block btn-lg" type="submit">${icon('send')} Request quote</button>
        <a class="btn btn-wa btn-block" href="${waLink(`Hi ${site.brand}, I need ${s.name}. Please share a quote.`)}" rel="noopener">${icon('message-circle')} Or chat on WhatsApp</a>
        <ul class="side-trust"><li>${icon('check')} No hidden charges</li><li>${icon('check')} ${s.warranty}</li><li>${icon('check')} ID-verified technicians</li></ul>
      </form>
      <a class="call-card" href="${telLink}">${icon('phone-call')}<span><small>Prefer to talk?</small><strong>${site.phone}</strong></span></a>
    </aside>
  </div>
</section>

<section class="section section-tint">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'You may also need', title: 'Related services' })}
    <div class="svc-grid">${more.map(x => serviceCard(r, x)).join('')}</div>
  </div>
</section>
${ctaBand(r, { title: `Book ${s.name.toLowerCase()} today.`, text: `Starting from ${fromPrice(s)}. Same-day visits available across ${site.city}.` })}`;
  return {
    file: pageUrl, r, active: 'services', ogImage: 'svc-' + s.slug,
    title: `${s.name} in ${site.city}: from ${rs(s.rate[0])}`,
    desc: `${s.short} Verified technicians, upfront PKR pricing and ${s.warranty.toLowerCase()} in ${site.city}.`,
    body,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name, provider: { '@type': 'HomeAndConstructionBusiness', name: site.brand, telephone: site.phone }, areaServed: site.city, description: s.intro, offers: { '@type': 'Offer', priceCurrency: 'PKR', price: s.rate[0] } },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faqs.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }
    ]
  };
}

/* ----------------------------------------------------------------- GALLERY */
export function gallery() {
  const r = '';
  const featured = pairs.find(p => p.slider);
  const jobs = services.filter(s => hasImg('svc-' + s.slug));
  const body = `
${pageHero(r, { eyebrow: 'Our work', title: 'Real jobs. Real transformations.', text: 'A look at recent before-and-after results and our teams on site across Lahore.', crumbs: [[null, 'Our Work']] })}
<section class="section">
  <div class="wrap">
    <div class="gal-feature">
      <div>${slider(r, featured, { eager: true })}</div>
      <div class="reveal gal-feature-copy"><p class="eyebrow">Featured</p><h2>${featured.title}</h2><p class="lead">${featured.caption} Drag the handle to compare the same AC before and after our deep clean.</p><a class="btn btn-teal" href="services/${featured.service}.html">${icon('wind')} AC service details</a></div>
    </div>
  </div>
</section>
<section class="section section-tint">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Before & after', title: 'Eight jobs, eight transformations.' })}
    <div class="filters reveal" role="group" aria-label="Filter results">
      <button type="button" class="chip is-on" data-filter="all">All</button>
      <button type="button" class="chip" data-filter="repair">Repair</button>
      <button type="button" class="chip" data-filter="cleaning">Cleaning</button>
      <button type="button" class="chip" data-filter="renovation">Renovation</button>
    </div>
    <div class="pair-grid" data-filter-grid>${pairs.map(p => pairCard(r, p)).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'On the job', title: 'Our teams at work.', text: 'Every service page shows the crew and equipment you can expect at your door.' })}
    <div class="mosaic">${jobs.map(s => `<a class="mosaic-item reveal" href="services/${s.slug}.html">${img(r, 'svc-' + s.slug, `${s.name} team at work`, { sizes: '(min-width: 900px) 24vw, 46vw' })}<span>${icon(s.icon)} ${s.name}</span></a>`).join('')}</div>
  </div>
</section>
${ctaBand(r, { title: 'Want results like these?', text: 'Send us a photo on WhatsApp for a fast, free quote.' })}`;
  return { file: 'gallery.html', r, active: 'gallery', ogImage: 'ba-roof-after', title: 'Our Work: Before & After Gallery', desc: 'See real before-and-after results for AC cleaning, painting, roof heat-proofing, bathroom renovation and more across Lahore.', body };
}

/* ----------------------------------------------------------------- PRICING */
export function pricing() {
  const r = '';
  const body = `
${pageHero(r, { eyebrow: 'Pricing & plans', title: 'Clear prices. No surprises.', text: 'Starting prices for every service, plus Annual Care Plans that save you money all year.', crumbs: [[null, 'Pricing']] })}
<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Annual Care Plans', title: 'Maintain your home, year-round.', text: 'Bundle servicing, checks and discounts into one simple yearly price.' })}
    <div class="plans">${site.plans.map(p => `
      <div class="plan reveal${p.highlight ? ' is-pop' : ''}">
        ${p.highlight ? '<span class="pop">Most popular</span>' : ''}
        <h3>${p.name}</h3><p class="plan-price">${p.price}</p><p class="plan-note">${p.note}</p>
        <ul class="ticks">${p.features.map(f => `<li>${icon('circle-check')} ${f}</li>`).join('')}</ul>
        <a class="btn ${p.highlight ? 'btn-amber' : 'btn-ghost-dark'} btn-block" href="contact.html">Choose ${p.name.replace('Annual Care ', '')}</a>
      </div>`).join('')}</div>
  </div>
</section>
<section class="section section-tint">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Price list', title: 'Starting prices by service.', text: 'Sample prices in PKR. Parts and materials are quoted separately.' })}
    ${groups.map(g => `
    <div class="price-group reveal">
      <h3>${icon(g.icon)} ${g.name}</h3>
      <div class="table-wrap"><table>
        <thead><tr><th scope="col">Service</th><th scope="col">Unit</th><th scope="col">Starting price</th><th scope="col"><span class="sr">Details</span></th></tr></thead>
        <tbody>${services.filter(s => s.group === g.id).map(s => `<tr><th scope="row"><a href="services/${s.slug}.html">${s.name}</a></th><td>per ${s.unit}</td><td><strong>${rs(s.rate[0])}</strong></td><td><a class="row-link" href="services/${s.slug}.html">Details ${icon('arrow-right')}</a></td></tr>`).join('')}</tbody>
      </table></div>
    </div>`).join('')}
    <p class="fine center">These are sample prices for a demonstration website and will be replaced with the company's real rates.</p>
  </div>
</section>
<section class="section">
  <div class="wrap pay-grid">
    <div class="reveal"><p class="eyebrow">How you pay</p><h2>Pay after you approve the work.</h2><p class="lead">No advance for standard jobs. For larger projects such as solar, renovation and shifting, we agree a simple milestone schedule in writing.</p></div>
    <ul class="pay-list reveal"><li>${icon('banknote')} Cash on completion</li><li>${icon('building-2')} Bank transfer</li><li>${icon('phone')} JazzCash &amp; Easypaisa</li><li>${icon('receipt')} Itemised receipt for every job</li></ul>
  </div>
</section>
${ctaBand(r)}`;
  return { file: 'pricing.html', r, active: 'pricing', title: 'Pricing & Annual Care Plans', desc: `Transparent starting prices in PKR for all ${SERVICE_COUNT} home services in ${site.city}, plus Annual Care Plans from Rs 12,000.`, body };
}

/* ------------------------------------------------------------------- ABOUT */
export function about() {
  const r = '';
  const team = [
    ['team-manager', 'Imran Qureshi', 'Operations Manager', 'Runs daily scheduling and quality checks across all teams.'],
    ['team-ac-technician', 'Kamran Yousaf', 'Senior AC Technician', '12 years servicing and installing every major AC brand.'],
    ['team-electrician', 'Adeel Raza', 'Lead Electrician', 'Certified for load balancing, rewiring and safety audits.'],
    ['team-cleaning-supervisor', 'Nasreen Akhtar', 'Cleaning Supervisor', 'Trains and leads our deep-cleaning crews.']
  ];
  const values = [['shield-check', 'Safety first', 'Trained, insured crews and tested equipment on every job.'], ['badge-percent', 'Honest pricing', 'We quote before we start and explain every line.'], ['clock', 'Respect for your time', 'On-time arrival, tidy work and a clean-up when we leave.'], ['heart-handshake', 'Accountability', 'If something is not right, we come back and fix it.']];
  const timeline = [['2016', 'Started with 3 technicians and a single AC service van in Gulberg.'], ['2018', 'Added cleaning, plumbing and electrical teams as customers asked for more.'], ['2021', 'Launched painting, roof heat-proofing and renovation services.'], ['2023', 'Introduced solar installation and CCTV security.'], ['Today', `${site.stats[3].value} verified technicians covering all of ${site.city}.`]];
  const body = `
${pageHero(r, { eyebrow: 'About us', title: `The team behind ${site.brand}.`, text: `Since ${site.since}, we have helped thousands of ${site.city} families keep their homes comfortable, clean and safe.`, crumbs: [[null, 'About']] })}
<section class="section">
  <div class="wrap about-grid">
    <div class="about-media reveal">${img(r, 'about-team', `The ${site.brand} team in uniform in front of a service van`, { sizes: '(min-width: 900px) 56vw, 92vw' })}</div>
    <div class="about-copy reveal">
      <p class="eyebrow">Our story</p>
      <h2>One call. Every home service. Done properly.</h2>
      <p>${site.brand} began with a simple frustration: finding a reliable plumber, a trustworthy AC technician and a good cleaner meant three different phone numbers and three different surprises on the bill.</p>
      <p>We built one team that handles all of it, with trained and verified technicians, written prices and a warranty on every job. Today, customers across ${site.city} call us first for almost anything their home needs.</p>
      <a class="btn btn-teal" href="contact.html">${icon('receipt')} Talk to our team</a>
    </div>
  </div>
</section>
<section class="stats"><div class="wrap stats-grid">${site.stats.map(fmtStat).join('')}</div></section>
<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'What we stand for', title: 'Our promises.' })}
    <div class="values">${values.map(v => `<div class="value reveal"><span class="why-ic">${icon(v[0])}</span><h3>${v[1]}</h3><p>${v[2]}</p></div>`).join('')}</div>
  </div>
</section>
<section class="section section-tint">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Meet the team', title: 'The people you will meet at your door.' })}
    <div class="team">${team.map(t => `<figure class="member reveal">${img(r, t[0], `${t[1]}, ${t[2]}`, { sizes: '(min-width: 900px) 22vw, 46vw' })}<figcaption><strong>${t[1]}</strong><span>${t[2]}</span><p>${t[3]}</p></figcaption></figure>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="wrap tl-wrap">
    ${sectionHead({ eyebrow: 'Our journey', title: 'Growing with Lahore.' })}
    <ol class="timeline">${timeline.map(t => `<li class="reveal"><strong>${t[0]}</strong><p>${t[1]}</p></li>`).join('')}</ol>
  </div>
</section>
${ctaBand(r)}`;
  return { file: 'about.html', r, active: 'about', ogImage: 'about-team', title: `About ${site.brand}`, desc: `Meet the verified team behind ${site.brand}: ${site.stats[3].value} technicians, ${site.stats[0].value}+ jobs and a 30-day warranty across ${site.city}.`, body };
}

/* ----------------------------------------------------------------- REVIEWS */
export function reviews() {
  const r = '';
  const bars = [[5, 92], [4, 6], [3, 1], [2, 1], [1, 0]];
  const body = `
${pageHero(r, { eyebrow: 'Reviews', title: 'What our customers say.', text: 'Honest feedback from homes across Lahore.', crumbs: [[null, 'Reviews']] })}
<section class="section">
  <div class="wrap">
    <div class="rating-sum reveal">
      <div class="rating-big"><strong>4.9</strong>${stars(5)}<span>from 3,200+ reviews</span></div>
      <ul class="rating-bars">${bars.map(b => `<li><span>${b[0]}★</span><div class="bar"><i style="width:${b[1]}%"></i></div><span>${b[1]}%</span></li>`).join('')}</ul>
    </div>
    <div class="review-grid">${site.reviews.map(reviewCard).join('')}</div>
    <p class="fine center">Sample reviews for demonstration purposes.</p>
  </div>
</section>
${ctaBand(r, { title: 'Join thousands of happy homes.', text: 'Book your first service and see why customers keep coming back.' })}`;
  return { file: 'reviews.html', r, active: '', title: 'Customer Reviews', desc: `Read reviews from ${site.city} homeowners about our AC, cleaning, plumbing, solar and renovation services.`, body };
}

/* ------------------------------------------------------------------- AREAS */
export function areas() {
  const r = '';
  const body = `
${pageHero(r, { eyebrow: 'Areas we serve', title: `Technicians across all of ${site.city}.`, text: 'Same-day service in the areas below, with scheduled visits across the wider city.', crumbs: [[null, 'Areas']] })}
<section class="section">
  <div class="wrap">
    <div class="area-grid">${site.areas.map(a => `<div class="area reveal">${icon('map-pin')}<div><strong>${a}</strong><span>Same-day available</span></div></div>`).join('')}</div>
    <div class="area-note reveal">
      ${icon('navigation')}
      <div><h3>Don't see your area?</h3><p>We regularly travel beyond the list for larger jobs such as solar, renovation and shifting. Message us your location and we will confirm.</p></div>
      <a class="btn btn-teal" href="${waLink('Hi ' + site.brand + ', do you serve my area?')}" rel="noopener">${icon('message-circle')} Ask on WhatsApp</a>
    </div>
  </div>
</section>
${ctaBand(r)}`;
  return { file: 'areas.html', r, active: 'areas', title: `Areas We Serve in ${site.city}`, desc: `${site.brand} serves DHA, Gulberg, Johar Town, Model Town, Bahria Town, Wapda Town and more across ${site.city}.`, body };
}

/* --------------------------------------------------------------------- FAQ */
export function faq() {
  const r = '';
  const body = `
${pageHero(r, { eyebrow: 'FAQ', title: 'Answers to common questions.', text: 'Can\'t find what you need? Message us on WhatsApp.', crumbs: [[null, 'FAQ']] })}
<section class="section">
  <div class="wrap faq-wrap">
    <label class="faq-search reveal">${icon('search')}<input type="search" placeholder="Search questions…" data-faq-search aria-label="Search questions"></label>
    ${faqList(site.faqs, 'main-faq')}
    <p class="faq-empty" hidden>No matching questions. Try another word, or <a href="contact.html">contact us</a>.</p>
  </div>
</section>
${ctaBand(r, { title: 'Still have a question?', text: 'Our team replies on WhatsApp within minutes during business hours.' })}`;
  return {
    file: 'faq.html', r, active: '', title: 'Frequently Asked Questions', desc: `Answers about pricing, warranty, booking, payment and coverage for ${site.brand} home services in ${site.city}.`, body,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: site.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }]
  };
}

/* ----------------------------------------------------------------- CONTACT */
export function contact() {
  const r = '';
  const body = `
${pageHero(r, { eyebrow: 'Contact', title: 'Get your free quote.', text: 'Tell us what you need. We reply within 15 minutes during business hours.', crumbs: [[null, 'Contact']] })}
<section class="section">
  <div class="wrap contact-grid">
    <form class="form-card reveal" data-quote data-contact action="thank-you.html" method="get" novalidate>
      <h2>Request a quote</h2>
      <div class="f-row">
        <label>Your name<input name="name" autocomplete="name" required placeholder="e.g. Ahmed Khan"></label>
        <label>Phone / WhatsApp<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+\\s\\-]{10,16}" placeholder="03XX XXXXXXX"></label>
      </div>
      <div class="f-row">
        <label>Service needed<select name="service" required><option value="">Select a service…</option>${optGroups()}</select></label>
        <label>Area<input name="area" list="area-list" autocomplete="off" placeholder="e.g. Johar Town"></label>
      </div>
      <datalist id="area-list">${site.areas.map(a => `<option value="${a}">`).join('')}</datalist>
      <div class="f-row">
        <label>Preferred date<input name="date" type="date"></label>
        <label>Time slot<select name="slot"><option>Morning (8am–12pm)</option><option>Afternoon (12pm–4pm)</option><option>Evening (4pm–9pm)</option></select></label>
      </div>
      <label>Tell us a little more <small>(optional)</small><textarea name="message" rows="4" placeholder="e.g. 2 split ACs, not cooling properly"></textarea></label>
      <div class="f-actions">
        <button class="btn btn-amber btn-lg" type="submit">${icon('send')} Request free quote</button>
        <button class="btn btn-wa btn-lg" type="button" data-wa-send>${icon('message-circle')} Send on WhatsApp</button>
      </div>
      <p class="fine">Demo form: nothing is stored or sent. Press "Send on WhatsApp" to try the prefilled message.</p>
    </form>
    <div class="contact-side">
      <a class="c-card reveal" href="${telLink}">${icon('phone-call')}<div><small>Call us</small><strong>${site.phone}</strong></div></a>
      <a class="c-card reveal" href="${waLink('Hi ' + site.brand + ', I need a service.')}" rel="noopener">${icon('message-circle')}<div><small>WhatsApp</small><strong>Chat now</strong></div></a>
      <a class="c-card reveal" href="mailto:${site.email}">${icon('mail')}<div><small>Email</small><strong>${site.email}</strong></div></a>
      <div class="c-card reveal">${icon('map-pin')}<div><small>Office</small><strong>${site.address}</strong></div></div>
      <div class="c-card reveal">${icon('clock')}<div><small>Hours</small><strong>${site.hours}</strong></div></div>
      <div class="next reveal"><h3>What happens next?</h3><ol>${site.steps.map(s => `<li>${s.title}</li>`).join('')}</ol></div>
    </div>
  </div>
</section>`;
  return { file: 'contact.html', r, active: 'contact', title: 'Contact & Free Quote', desc: `Request a free quote from ${site.brand} in ${site.city}. Call ${site.phone}, WhatsApp us or use the quick form.`, body };
}

/* ---------------------------------------------------------------- THANK YOU */
export function thankYou() {
  const r = '';
  const body = `
<section class="section thanks">
  <div class="wrap narrow center">
    <span class="thanks-ic">${icon('circle-check')}</span>
    <h1>Thank you<span data-thanks-name></span>!</h1>
    <p class="lead">We have received your request<span data-thanks-service></span>. A team member will contact you shortly with a clear quote.</p>
    <ol class="mini-steps left">${site.steps.slice(1).map((st, i) => `<li><span>${i + 1}</span><div><strong>${st.title}</strong><p>${st.text}</p></div></li>`).join('')}</ol>
    <div class="hero-cta center-cta"><a class="btn btn-teal btn-lg" href="index.html">Back to home</a><a class="btn btn-wa btn-lg" href="${waLink('Hi ' + site.brand + ', I just sent a request.')}" rel="noopener">${icon('message-circle')} Message us now</a></div>
    <p class="fine">Demo page: no information was stored or transmitted.</p>
  </div>
</section>`;
  return { file: 'thank-you.html', r, active: '', title: 'Thank You', desc: 'Your request has been received.', body, noindex: true };
}

/* ----------------------------------------------------------------- PRIVACY */
export function privacy() {
  const r = '';
  const body = `
${pageHero(r, { eyebrow: 'Legal', title: 'Privacy & Terms', text: 'Sample policy text for this demonstration website.', crumbs: [[null, 'Privacy & Terms']] })}
<section class="section"><div class="wrap narrow prose">
  <h2>Privacy</h2>
  <p>${site.brand} collects only the information you choose to give us, such as your name, phone number, area and service needs, so that we can prepare a quote and schedule your visit. We do not sell your information. We keep it only as long as needed to provide the service and meet legal obligations.</p>
  <h2>Cookies</h2>
  <p>This website uses no advertising cookies. If analytics are added, they will be anonymous and you will be able to decline them.</p>
  <h2>Service terms</h2>
  <ul>
    <li>Quotes are valid for 7 days and are confirmed in writing before work begins.</li>
    <li>Parts and materials are quoted separately unless stated otherwise.</li>
    <li>All jobs carry a 30-day service warranty unless a longer period is listed on the service page.</li>
    <li>Cancellations made at least 3 hours before the visit are free of charge.</li>
    <li>Warranty does not cover damage caused by misuse, third-party repairs or events outside our control.</li>
  </ul>
  <h2>Contact</h2>
  <p>Questions about this policy? Email <a href="mailto:${site.email}">${site.email}</a> or call <a href="${telLink}">${site.phone}</a>.</p>
  <p class="fine">This text is a placeholder and should be replaced with the client's own legal policy before launch.</p>
</div></section>`;
  return { file: 'privacy.html', r, active: '', title: 'Privacy & Terms', desc: `Privacy policy and service terms for ${site.brand}.`, body };
}

/* --------------------------------------------------------------------- 404 */
export function notFound() {
  const r = '';
  const body = `
<section class="section thanks">
  <div class="wrap narrow center">
    <p class="big-404">404</p>
    <h1>This page can't be found.</h1>
    <p class="lead">The page may have moved. Try one of these instead.</p>
    <div class="hero-cta center-cta"><a class="btn btn-teal btn-lg" href="index.html">Home</a><a class="btn btn-ghost-dark btn-lg" href="services.html">All services</a><a class="btn btn-amber btn-lg" href="contact.html">Get a quote</a></div>
  </div>
</section>`;
  return { file: '404.html', r, active: '', title: 'Page not found', desc: 'Page not found.', body, noindex: true };
}
