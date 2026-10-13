/* HomeCare Pro: small, dependency-free enhancements. The site works without JS. */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.body.dataset.root || '';

  // 12,50,000 style grouping
  const pkr = n => {
    const s = String(Math.round(n));
    return s.length <= 3 ? s : s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
  };

  /* ---------- header: mobile menu + mega menu ---------- */
  const header = $('.site-header');
  const burger = $('.burger');
  const nav = $('#primary-nav');
  const megaWrap = $('.has-mega');
  const megaBtn = $('.mega-btn');

  const setMega = open => {
    if (!megaWrap) return;
    megaWrap.classList.toggle('open', open);
    megaBtn.setAttribute('aria-expanded', String(open));
  };
  const setNav = open => {
    header.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) setMega(false);
  };
  burger?.addEventListener('click', () => setNav(burger.getAttribute('aria-expanded') !== 'true'));
  megaBtn?.addEventListener('click', e => { e.stopPropagation(); setMega(!megaWrap.classList.contains('open')); });
  document.addEventListener('click', e => { if (megaWrap && !megaWrap.contains(e.target)) setMega(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (megaWrap?.classList.contains('open')) { setMega(false); megaBtn.focus(); }
    else if (header.classList.contains('nav-open')) { setNav(false); burger.focus(); }
  });
  nav?.addEventListener('click', e => { if (e.target.closest('a') && header.classList.contains('nav-open')) setNav(false); });
  matchMedia('(min-width: 1061px)').addEventListener('change', e => { if (e.matches) setNav(false); });

  /* ---------- filter chips (services + gallery) ---------- */
  $$('.filters').forEach(bar => {
    const grid = bar.parentElement.querySelector('[data-filter-grid]');
    if (!grid) return;
    bar.addEventListener('click', e => {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      $$('.chip', bar).forEach(c => c.classList.toggle('is-on', c === chip));
      const f = chip.dataset.filter;
      [...grid.children].forEach(card => { card.hidden = !(f === 'all' || card.dataset.group === f); });
    });
  });

  /* ---------- animated counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const run = el => {
      const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, dur = 1400, t0 = performance.now();
      const fmt = v => dec ? v.toFixed(dec) : pkr(v);
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: .6 });
    counters.forEach(c => { const v = parseFloat(c.dataset.count), d = +c.dataset.dec || 0; c.textContent = d ? (0).toFixed(d) : '0'; io.observe(c); });
  } else counters.forEach(c => { const d = +c.dataset.dec || 0; c.textContent = d ? parseFloat(c.dataset.count).toFixed(d) : pkr(+c.dataset.count); });

  /* ---------- price estimator ---------- */
  const est = $('[data-estimator]');
  if (est) {
    const data = JSON.parse($('#svc-data').textContent);
    const sel = est.elements.service, qty = est.elements.qty;
    const total = $('[data-total]', est), note = $('[data-note]', est), unit = $('[data-unit]', est), link = $('[data-est-link]', est);
    const update = () => {
      const s = data.find(d => d.slug === sel.value);
      const q = Math.max(1, Math.min(500, parseInt(qty.value, 10) || 1));
      unit.textContent = `(${s.unit}${q > 1 ? 's' : ''})`;
      total.textContent = s.lo === s.hi ? `Rs ${pkr(s.lo * q)}` : `Rs ${pkr(s.lo * q)} – ${pkr(s.hi * q)}`;
      note.textContent = `${s.name} · ${q} × ${s.unit}`;
      link.href = `${root}contact.html?service=${s.slug}&qty=${q}`;
    };
    $('[data-dec]', est).addEventListener('click', () => { qty.value = Math.max(1, (+qty.value || 1) - 1); update(); });
    $('[data-inc]', est).addEventListener('click', () => { qty.value = Math.min(500, (+qty.value || 1) + 1); update(); });
    sel.addEventListener('change', update); qty.addEventListener('input', update);
    update();
  }

  /* ---------- before / after comparison ---------- */
  $$('[data-compare]').forEach(box => {
    const range = $('.cmp-range', box);
    const set = v => { v = Math.max(0, Math.min(100, v)); box.style.setProperty('--pos', v + '%'); range.value = v; };
    range.addEventListener('input', () => set(+range.value));
    let drag = false;
    const fromEvent = e => { const r = box.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    box.addEventListener('pointerdown', e => { drag = true; box.setPointerCapture?.(e.pointerId); fromEvent(e); });
    box.addEventListener('pointermove', e => { if (drag) fromEvent(e); });
    ['pointerup', 'pointercancel'].forEach(t => box.addEventListener(t, () => { drag = false; }));
    // gentle hint: nudge the handle once when it first scrolls into view
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return; io.disconnect();
        const t0 = performance.now(), anim = t => {
          const p = Math.min(1, (t - t0) / 1600);
          set(50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p));
          if (p < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
      }, { threshold: .6 });
      io.observe(box);
    }
  });

  /* ---------- FAQ search ---------- */
  const faqInput = $('[data-faq-search]');
  if (faqInput) {
    const items = $$('.faq-list details'), empty = $('.faq-empty');
    faqInput.addEventListener('input', () => {
      const q = faqInput.value.trim().toLowerCase();
      let shown = 0;
      items.forEach(d => { const hit = !q || d.textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) shown++; });
      empty.hidden = shown > 0;
    });
  }

  /* ---------- quote / contact forms ---------- */
  const params = new URLSearchParams(location.search);
  $$('form[data-quote]').forEach(form => {
    const svc = form.elements.service;
    if (svc && svc.tagName === 'SELECT' && params.get('service')) svc.value = params.get('service');
    if (form.elements.message && params.get('qty') && svc?.value) form.elements.message.placeholder = `e.g. ${params.get('qty')} unit(s) needed`;

    const check = () => {
      let ok = true;
      $$('[required]', form).forEach(f => {
        const bad = !f.value.trim() || Boolean(f.pattern && !new RegExp(`^(?:${f.pattern})$`, 'u').test(f.value.trim()));
        f.classList.toggle('is-invalid', bad);
        if (bad && ok) { f.focus(); ok = false; }
        let msg = f.parentElement.querySelector('.err');
        if (bad && !msg) { msg = document.createElement('span'); msg.className = 'err'; msg.setAttribute('role', 'alert'); f.parentElement.append(msg); }
        if (msg) msg.textContent = bad ? (f.type === 'tel' ? 'Please enter a valid phone number.' : 'This field is required.') : '';
        if (!bad && msg) msg.remove();
      });
      return ok;
    };
    form.addEventListener('submit', e => {
      if (!check()) { e.preventDefault(); return; }
      let sn = form.elements.sn;
      if (!sn) { sn = document.createElement('input'); sn.type = 'hidden'; sn.name = 'sn'; form.append(sn); }
      if (svc?.tagName === 'SELECT') sn.value = svc.selectedOptions[0]?.textContent || '';
    });
    form.addEventListener('input', e => { if (e.target.classList.contains('is-invalid')) check(); });

    $('[data-wa-send]', form)?.addEventListener('click', () => {
      const f = form.elements, s = f.service.selectedOptions[0]?.textContent;
      const parts = [`Hi, I need ${s && f.service.value ? s : 'a home service'}.`];
      if (f.name.value) parts.push(`Name: ${f.name.value}`);
      if (f.area.value) parts.push(`Area: ${f.area.value}`);
      if (f.date.value) parts.push(`Date: ${f.date.value} (${f.slot.value})`);
      if (f.message.value) parts.push(f.message.value);
      const phone = document.querySelector('a[href^="https://wa.me/"]').href.match(/wa\.me\/(\d+)/)[1];
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(parts.join('\n'))}`, '_blank', 'noopener');
    });
  });

  /* ---------- thank-you page ---------- */
  const tn = $('[data-thanks-name]');
  if (tn) {
    const name = (params.get('name') || '').trim().split(' ')[0];
    if (name) tn.textContent = `, ${name}`;
    const sv = params.get('sn');
    if (sv) $('[data-thanks-service]').textContent = ` for ${sv}`;
  }
})();
