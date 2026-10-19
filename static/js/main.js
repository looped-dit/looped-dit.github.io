/* Looped-DiT project page: page behaviour. Numbers live in data.js, images in gallery.js. */
(function () {
  'use strict';
  const D = window.LD, G = window.LDG || {};
  const C = window.LDCharts;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const f1 = v => (Math.round(v * 10) / 10).toFixed(1);
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function sv(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function svText(parent, x, y, txt, cls, anchor) {
    const t = sv('text', { x: x, y: y, class: cls, 'text-anchor': anchor || 'start' }, parent);
    t.textContent = txt;
    return t;
  }
  function img(src, alt, extra) {
    const i = new Image();
    i.src = src; i.alt = alt || ''; i.loading = 'lazy'; i.decoding = 'async';
    if (extra) for (const k in extra) i.setAttribute(k, extra[k]);
    if (extra && extra['data-lb']) {
      i.tabIndex = 0;
      i.setAttribute('role', 'button');
      i.setAttribute('aria-haspopup', 'dialog');
    }
    return i;
  }

  // Prompt cards unfold in place. Desktop hover and keyboard focus open them;
  // touch users tap, with an internal scroll area for unusually long prompts.
  const promptPreviews = new Map();
  const promptHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let promptFrame = 0, promptId = 0;
  function refreshPromptPreviews() {
    promptFrame = 0;
    promptPreviews.forEach((r, preview) => {
      if (!preview.isConnected) {
        if (promptObserver) promptObserver.unobserve(preview);
        promptPreviews.delete(preview);
        return;
      }
      const line = parseFloat(getComputedStyle(preview).lineHeight);
      r.closedHeight = Math.ceil(line * 2);
      r.clipped = preview.scrollHeight > r.closedHeight + 2;
      r.fold.classList.toggle('is-clipped', r.clipped);
      r.fold.tabIndex = r.clipped && !r.fold.closest('[aria-hidden="true"]') ? 0 : -1;
      if (r.clipped) {
        r.fold.setAttribute('role', 'button');
        r.fold.setAttribute('aria-controls', preview.id);
        r.fold.setAttribute('aria-describedby', preview.id);
      } else {
        r.fold.removeAttribute('role');
        r.fold.removeAttribute('aria-controls');
        r.fold.removeAttribute('aria-describedby');
      }
      r.setOpen(r.open);
    });
  }
  function queuePromptPreviews() {
    if (!promptFrame) promptFrame = requestAnimationFrame(refreshPromptPreviews);
  }
  const promptObserver = 'ResizeObserver' in window ? new ResizeObserver(queuePromptPreviews) : null;
  function foldPrompt(preview, hoverHost = null) {
    if (!preview.id) preview.id = 'prompt-preview-' + (++promptId);
    const fold = h('div', { class: 'prompt-fold' });
    fold.appendChild(preview);
    fold.appendChild(h('span', { class: 'prompt-chevron', 'aria-hidden': 'true' }));
    const host = hoverHost || fold;
    const r = { fold, open: false, clipped: false, closedHeight: 0, setOpen(open) {
      const next = !!open && r.clipped;
      if (next !== r.open) fold.scrollTop = 0;
      r.open = next;
      fold.classList.toggle('is-expanded', next);
      fold.style.maxHeight = (next ? Math.min(preview.scrollHeight, hoverHost ? 240 : 320) : r.closedHeight) + 'px';
      if (r.clipped) {
        fold.setAttribute('aria-expanded', String(next));
        fold.setAttribute('aria-label', next ? 'Collapse prompt' : 'Expand prompt');
      } else {
        fold.removeAttribute('aria-expanded');
        fold.removeAttribute('aria-label');
      }
    } };
    host.addEventListener('pointerenter', e => {
      if (promptHover.matches && e.pointerType !== 'touch') r.setOpen(true);
    });
    host.addEventListener('pointerleave', () => {
      if (promptHover.matches && !fold.matches(':focus-visible')) r.setOpen(false);
    });
    fold.addEventListener('focusin', () => { if (promptHover.matches) r.setOpen(true); });
    fold.addEventListener('focusout', () => {
      if (!promptHover.matches || !host.matches(':hover')) r.setOpen(false);
    });
    fold.addEventListener('click', () => {
      if (!promptHover.matches) r.setOpen(!r.open);
    });
    fold.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); r.setOpen(!r.open); }
      if (e.key === 'Escape') { e.preventDefault(); r.setOpen(false); }
    });
    promptPreviews.set(preview, r);
    if (promptObserver) promptObserver.observe(preview);
    queuePromptPreviews();
    return fold;
  }
  window.addEventListener('resize', queuePromptPreviews, { passive: true });
  if (document.fonts) document.fonts.ready.then(queuePromptPreviews);

  // Typeset a formula with the page's KaTeX (plain text if it is missing).
  const texHtml = src => (window.katex ? window.katex.renderToString(src, { throwOnError: false }) : src);
  // Count a headline number up inside `el` (SVG text or HTML), easing out; shows the final value at once with reduced motion.
  function countUp(el, to, o) {
    o = Object.assign({ from: 0, dec: 1, pre: '', post: '', dur: 900, delay: 0 }, o || {});
    const fmt = v => o.pre + v.toFixed(o.dec) + o.post;
    if (reduceMotion) { el.textContent = fmt(to); return; }
    el.textContent = fmt(o.from);
    const t0 = performance.now() + o.delay, run = el._countRun = (el._countRun || 0) + 1;
    const tick = now => {
      if (el._countRun !== run) return;  // a newer count took over
      const k = Math.min(1, Math.max(0, (now - t0) / o.dur)), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(o.from + (to - o.from) * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- theme ---------- */
  (function theme() {
    const btn = $('#themeBtn');
    const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
    const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
    const root = document.documentElement;
    const isDark = () => root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const paint = () => { btn.innerHTML = isDark() ? sun : moon; btn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme'); };
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ld-theme', next); } catch (e) {}
      paint();
    });
    paint();
  })();

  /* ---------- logos ---------- */
  (function logos() {
    const box = $('#logos');
    (G.logos || []).forEach(l => {
      const s = l.url ? h('a', { href: l.url, title: l.name }) : h('span', { title: l.name });
      s.appendChild(img(l.src, l.name, { style: l.h ? `height:${l.h}px` : null }));
      box.appendChild(s);
    });
    if (!box.children.length) box.remove();
  })();

  // Until the slideshow starts (see teaserShow), its first slide is shown finished, without build-up or counting.
  const tzWaiting = () => { const s = $('#tzShow'); return !!s && s.classList.contains('waiting'); };

  /* ---------- teaser figure frame: every slide fills the same box, drawn 1:1 with the screen ---------- */
  // All four slides share one width (the panel) and one height (--tz-h). Charts are redrawn at that exact size,
  // so every slide's figure spans the panel and its text keeps the same size.
  const tzFrame = (function () {
    const slides = $('#tzSlides'), probe = slides && $('.tz-body', slides);
    const fns = [];
    let size = null;
    function measure() {
      const w = Math.round(probe.getBoundingClientRect().width);
      const narrow = w < 560;
      return { w, h: narrow ? 560 : Math.round(Math.min(420, Math.max(330, w * 0.47))), narrow };
    }
    function apply(force) {
      const s = measure();
      if (!force && size && s.w === size.w && s.h === size.h) return;
      size = s;
      slides.style.setProperty('--tz-h', s.h + 'px');
      fns.forEach(fn => fn(s));
    }
    if (probe) {
      apply(true);
      if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(() => apply(false))).observe(slides);
    }
    return { on(fn) { if (!probe) return; fns.push(fn); fn(size); } };
  })();

  /* ---------- teaser: the paper's Fig. 1(a, b), with its exact fills from figures/intro_teaser.pdf ---------- */
  (function teaserBench() {
    const box = $('#tzBench'), slide = box.closest('.tz-slide');
    // the gains count up each time the slide comes up, once the bars have risen
    let heroes = [];
    const play = () => { if (!tzWaiting()) heroes.forEach(({ el, to }) => countUp(el, to, { pre: '+', delay: 1150, dur: 900 })); };
    if (slide) slide.addEventListener('tz:show', play);
    // Looped-DiT in the page's orange; other models in its cool neutrals, darkest to lightest as in the paper's Fig. 1
    const fills = { 'Looped-DiT B/16': '#E8590C', 'InternVL-U': '#64748B', 'Uni-CoT': '#475569', 'UniLIP-3B': '#CBD5E1', 'CogView4': '#64748B' };
    const light = ['#8593A8', '#CBD5E1'];
    const rows = D.main.groups.flatMap(g => g.rows).concat([D.main.ours]);
    const benches = [
      { name: 'T2I-CoReBench', j: D.main.cols.indexOf('CoRe'), min: 42, max: 54, ticks: [42, 46, 50, 54] },
      { name: 'PRISM', j: D.main.cols.indexOf('PRISM'), min: 56, max: 68, ticks: [56, 60, 64, 68] }
    ];
    tzFrame.on(({ w: fw, h: fh, narrow }) => {
      box.textContent = '';
      heroes = [];
      box.classList.toggle('narrow', narrow);
      // two charts side by side, or stacked on phones; 42 px under each for the benchmark name
      const W = narrow ? fw : Math.floor((fw - 16) / 2), H = (narrow ? Math.floor((fh - 16) / 2) : fh) - 42;
      benches.forEach(b => {
        const models = Object.keys(fills).map(n => ({ n, v: rows.find(r => r[0] === n)[2][b.j] })).sort((p, q) => q.v - p.v);
        const m = { l: 40, r: 8, t: 14, b: 84 };
        const Y = v => m.t + (b.max - v) / (b.max - b.min) * (H - m.t - m.b), base = Y(b.min);
        const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'tz-svg', role: 'img', 'aria-label': `${b.name}: ` + models.map(p => `${p.n} ${f1(p.v)}`).join(', ') });
        b.ticks.forEach(t => {
          if (t !== b.min) sv('line', { x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t), class: 'tz-grid' }, svg);
          svText(svg, m.l - 7, Y(t) + 4.5, String(t), 'tz-tick', 'end');
        });
        const slot = (W - m.l - m.r) / models.length, bw = slot * 0.84;
        models.forEach((p, i) => {
          const x = m.l + i * slot + (slot - bw) / 2, y = Y(p.v);
          const d = `--d:${i * 90}ms`;
          sv('rect', { x, y, width: bw, height: base - y, fill: fills[p.n], class: 'bar', style: d }, svg);
          svText(svg, x + bw / 2, y + 18, f1(p.v), 'tz-val' + (light.includes(fills[p.n]) ? ' dark' : ''), 'middle').setAttribute('style', d);
          const lx = x + bw / 2 + 7, ly = base + 15;
          const t = sv('text', { x: lx, y: ly, class: 'tz-model' + (i === 0 ? ' ours' : ''), 'text-anchor': 'end', transform: `rotate(-35 ${lx} ${ly})` }, svg);
          (p.n === 'Looped-DiT B/16' ? ['Looped-DiT', 'B/16'] : [p.n]).forEach((line, k) => {
            const ts = sv('tspan', { x: lx, dy: k ? '1.1em' : 0 }, t);
            ts.textContent = line;
          });
        });
        sv('line', { x1: m.l, x2: W - m.r, y1: base, y2: base, class: 'tz-axis' }, svg);
        sv('line', { x1: m.l, x2: m.l, y1: m.t - 4, y2: base, class: 'tz-axis' }, svg);
        // axis break: the bars start at b.min, not at zero
        sv('path', { d: `M${m.l - 5} ${base - 5} l10 -5 M${m.l - 5} ${base - 1} l10 -5`, class: 'tz-break' }, svg);
        // the margin over the runner-up: a dashed line at its score, a bracket on Looped-DiT's bar, and the gain in large type
        const us = models[0], ru = models[1], x0 = m.l + (slot - bw) / 2, yo = Y(us.v), yr = Y(ru.v), bx = x0 + bw + 7;
        sv('path', { d: `M${x0} ${yr} H${x0 + slot + bw}`, class: 'tz-ref' }, svg);
        sv('path', { d: `M${bx - 4} ${yr} H${bx + 4} M${bx} ${yr} V${yo} M${bx - 4} ${yo} H${bx + 4}`, class: 'tz-brk' }, svg);
        const fs = Math.round(Math.max(22, Math.min(42, (H - m.t - m.b) * 0.17)));
        const hero = svText(svg, bx + 9, (yo + yr) / 2 + fs * 0.36, `+${f1(us.v - ru.v)}`, 'tz-hero', 'start');
        hero.setAttribute('style', `font-size:${fs}px;--d:1150ms`);
        heroes.push({ el: hero, to: us.v - ru.v });
        const cell = h('div', { class: 'tz-plate' });
        cell.appendChild(svg);
        cell.appendChild(h('p', { class: 'tz-bench-name' }, b.name));
        box.appendChild(cell);
      });
      if (slide && slide.classList.contains('on')) play();
    });
  })();

  (function teaserEff() {
    const box = $('#tzEff'), slide = box.closest('.tz-slide');
    const ref = D.pareto.find(p => p.name === 'InternVL-U');
    const ours = D.pareto.find(p => p.ours && p.loops === 4 && p.steps === 100);
    const groups = [
      { name: 'Parameters', unit: '(B)', claim: 'fewer parameters', a: ref.params, b: ours.params },
      { name: 'Compute', unit: '(TFLOPs)', claim: 'less compute', a: ref.tflops, b: ours.tflops },
      { name: 'Latency', unit: '(s)', claim: 'lower latency', a: ref.latency, b: ours.latency }
    ];
    const fills = { ref: '#64748B', ours: '#E8590C' };
    const delay = i => 650 + i * 160;
    // Looped-DiT's bar starts as tall as InternVL-U's and shrinks to its real size while the factor counts up
    let heroes = [];
    const play = () => { if (!tzWaiting()) heroes.forEach(({ el, to }, i) => countUp(el, to, { from: 1, post: '×', delay: delay(i), dur: 1000 })); };
    if (slide) slide.addEventListener('tz:show', play);
    tzFrame.on(({ w: fw, h: fh, narrow }) => {
      box.textContent = '';
      heroes = [];
      const W = fw, H = fh, fsHero = narrow ? 30 : 46, heroY = narrow ? 76 : 100, claimY = heroY + (narrow ? 20 : 26);
      const top = claimY + (narrow ? 34 : 30), base = H - 62;
      const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'tz-svg', role: 'img', 'aria-label': 'Looped-DiT B/16 against InternVL-U: ' + groups.map(g => `${f1(g.a / g.b)} times ${g.claim}, ${g.b} vs ${g.a} ${g.unit}`).join('; ') });
      // legend, one centred line
      const items = [['InternVL-U', fills.ref], ['Looped-DiT B/16', fills.ours]], lw = [96, 128];
      let lx = W / 2 - (lw[0] + lw[1]) / 2;
      items.forEach(([n, c], i) => {
        sv('rect', { x: lx, y: 12, width: 14, height: 14, rx: 2, fill: c }, svg);
        svText(svg, lx + 21, 24, n, 'tz-legend');
        lx += lw[i];
      });
      const pad = 16, slot = (W - 2 * pad) / groups.length, bw = Math.min(96, slot * 0.3), gap = 10;
      groups.forEach((g, i) => {
        const cx = pad + slot * i + slot / 2, hA = base - top, hB = hA * g.b / g.a, f = g.a / g.b;
        const dA = `--d:${i * 120}ms`;
        sv('rect', { x: cx - gap / 2 - bw, y: top, width: bw, height: hA, fill: fills.ref, class: 'bar', style: dA }, svg);
        sv('rect', { x: cx + gap / 2, y: base - hB, width: bw, height: hB, fill: fills.ours, class: 'shrink', style: `--k:${(hA / hB).toFixed(3)};--d:${delay(i)}ms` }, svg);
        svText(svg, cx - gap / 2 - bw / 2, top + 18, String(g.a), 'tz-val', 'middle').setAttribute('style', dA);
        svText(svg, cx + gap / 2 + bw / 2, base - hB + 18, String(g.b), 'tz-val', 'middle').setAttribute('style', `--d:${delay(i) + 700}ms`);
        // the factor in large type, with what it saves
        const hero = svText(svg, cx, heroY, `${f1(f)}×`, 'tz-hero', 'middle');
        hero.setAttribute('style', `font-size:${fsHero}px;--d:${delay(i)}ms`);
        heroes.push({ el: hero, to: f });
        const claim = sv('text', { x: cx, y: claimY, class: 'tz-claim', 'text-anchor': 'middle', style: `--d:${delay(i)}ms` }, svg);
        (narrow ? g.claim.split(' ') : [g.claim]).forEach((line, k) => { const ts = sv('tspan', { x: cx, dy: k ? '1.15em' : 0 }, claim); ts.textContent = line; });
        sv('line', { x1: cx - gap / 2 - bw - 14, x2: cx + gap / 2 + bw + 14, y1: base, y2: base, class: 'tz-axis' }, svg);
        svText(svg, cx, base + 26, g.name, 'tz-group', 'middle');
        svText(svg, cx, base + 46, g.unit, 'tz-group', 'middle');
      });
      box.appendChild(svg);
      if (slide && slide.classList.contains('on')) play();
    });
  })();

  /* ---------- teaser (d): self-correction across loops, the paper's Fig. 1(c), stepping through the loop depths ---------- */
  (function teaserFix() {
    const box = $('#tzFix'), H = G.hero;
    if (!H) { box.closest('.tz-slide').remove(); return; }
    const STEP = 3;  // seconds on each loop depth
    const slide = box.closest('.tz-slide');
    // The slideshow stays on this slide for one full pass through the loop depths.
    slide.dataset.dwell = String(H.images.length * STEP);
    box.style.setProperty('--step', STEP + 's');
    box.appendChild(h('p', { class: 'tz-prompt' }, `“${H.promptHtml}”`));
    const verdict = (ok, note) => `<span aria-hidden="true">${ok ? '✓' : '✗'}</span>${note}`;
    const stage = h('figure', { class: 'tz-stage' });
    const label = h('figcaption', { 'aria-live': 'off' });
    const frames = h('div', { class: 'tz-frames' });
    const frameImgs = H.images.map(im => {
      const el = img(im.src, `Loop ×${im.n}: ${H.prompt}`, { 'data-lb': 'teaser-fix', 'data-lab': `Loop ×${im.n}`, 'data-cap': H.prompt });
      frames.appendChild(el);
      return el;
    });
    const mark = h('p', { class: 'tz-mark' });
    [label, frames, mark].forEach(el => stage.appendChild(el));
    const steps = h('div', { class: 'tz-steps', role: 'tablist', 'aria-label': 'Loop depth' });
    const stepBtns = H.images.map((im, i) => {
      const b = h('button', { type: 'button', class: 'tz-step', role: 'tab', 'aria-label': `Loop ×${im.n}` }, `<img src="${im.src}" alt=""><span>×${im.n}</span><i class="tz-step-bar" aria-hidden="true"></i>`);
      b.addEventListener('click', () => { box.classList.remove('rotating'); select(i); });
      steps.appendChild(b);
      return b;
    });
    const loops = h('div', { class: 'tz-fix-loops' });
    loops.appendChild(stage);
    loops.appendChild(steps);
    const fix = h('div', { class: 'tz-fix' });
    fix.appendChild(loops);
    if (H.baseline) {
      const other = h('figure', { class: 'tz-shot tz-fix-base' });
      other.appendChild(h('figcaption', {}, H.baseline.label));
      other.appendChild(img(H.baseline.src, `${H.baseline.label}: ${H.prompt}`, { 'data-lb': 'teaser-fix', 'data-lab': H.baseline.label, 'data-cap': H.prompt }));
      other.appendChild(h('p', { class: 'tz-mark ' + (H.baseline.ok ? 'ok' : 'bad') }, verdict(H.baseline.ok, 'garbled text')));
      fix.appendChild(other);
    }
    box.appendChild(fix);

    let cur = 0;
    function select(i) {
      cur = i;
      const im = H.images[i];
      frameImgs.forEach((el, j) => el.classList.toggle('on', j === i));
      stepBtns.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
      label.textContent = `Loop ×${im.n}`;
      stage.classList.toggle('final', im.ok);
      mark.className = 'tz-mark ' + (im.ok ? 'ok' : 'bad');
      mark.innerHTML = verdict(im.ok, im.note);
    }
    // Each depth is timed by the bar under its thumbnail, as in the slideshow.
    steps.addEventListener('animationend', e => {
      if (e.animationName === 'tz-fill' && box.classList.contains('rotating')) select((cur + 1) % frameImgs.length);
    });
    slide.addEventListener('tz:show', () => {
      select(0);
      box.classList.remove('rotating');
      if (!reduceMotion) { void box.offsetWidth; box.classList.add('rotating'); }
    });
    slide.addEventListener('tz:hide', () => box.classList.remove('rotating'));
    select(0);
    // Posters take the frame's height: prompt, label and verdict need about 84 px; on phones the parts stack.
    tzFrame.on(({ w: fw, h: fh, narrow }) => {
      box.classList.toggle('narrow', narrow);
      const p = narrow ? Math.min(fw * 0.8, (fh - 146) / 1.85) : Math.min(fh - 84, (fw - 150) / 2);
      box.style.setProperty('--tz-p', Math.floor(p) + 'px');
    });
  })();

  /* ---------- method: one denoising step, with the shared middle blocks looping (horizontal; vertical on phones) ---------- */
  (function methodLoop() {
    const host = $('#methodAnim');
    if (!host) return;
    const N = 4, PRE = 6, MID = 5, POST = 6, STEP = 90, ARC = 380, HOLD = 2400;
    const IMG = 'static/img/paper/tea_loop4.webp';
    host.setAttribute('aria-label', 'One denoising step of Looped-DiT: a noisy image passes 6 pre-loop blocks once, the 5 shared middle blocks four times, and 6 post-loop blocks once, giving the prediction. 32 blocks run from 17 distinct blocks.');
    const stats = h('div', { class: 'ma-stats', 'aria-hidden': 'true' },
      '<div class="ma-stat runs"><b>32</b><span>Blocks run per step</span></div>' +
      '<div class="ma-loop">Loop 4 of 4</div>' +
      '<div class="ma-stat"><b>17</b><span>Distinct blocks</span></div>');
    const fig = h('div', { class: 'ma-fig' });
    host.appendChild(stats);
    host.appendChild(fig);
    const runsEl = $('.ma-stat.runs b', stats), loopEl = $('.ma-loop', stats);
    let blocks = null, arc = null, arcLen = 0, out = null, timers = [], visible = true, running = false, width = 0;
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const setLoop = k => { loopEl.textContent = `Loop ${k} of ${N}`; };
    // the step's input (the same picture under generated noise) and its prediction
    function pic(svg, defs, x, y, size, noisy) {
      const id = noisy ? 'maClipIn' : 'maClipOut';
      sv('rect', { x, y, width: size, height: size, rx: 10 }, sv('clipPath', { id }, defs));
      const g = sv('g', { class: noisy ? 'pic-in' : 'pic-out' }, svg);
      const im = sv('image', { href: IMG, x, y, width: size, height: size, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${id})` }, g);
      im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', IMG);
      if (noisy) sv('rect', { x, y, width: size, height: size, filter: 'url(#maNoise)', opacity: 0.72, 'clip-path': `url(#${id})` }, g);
      return g;
    }
    // Draws at the current width; returns false (and draws nothing) before the layout has given the figure a real width.
    function draw() {
      width = Math.round(fig.getBoundingClientRect().width);
      if (width < 200) return false;
      const vertical = width < 760;
      fig.textContent = '';
      const svg = sv('svg', { class: 'loop-svg', 'aria-hidden': 'true' }, fig);
      const defs = sv('defs', {}, svg);
      const noise = sv('filter', { id: 'maNoise', x: 0, y: 0, width: '100%', height: '100%' }, defs);
      sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.85', numOctaves: '2', seed: '7' }, noise);
      sv('feColorMatrix', { type: 'saturate', values: '0' }, noise);
      const groups = { pre: [], mid: [], post: [] };
      let W = width, H, midA, midB;
      if (!vertical) {
        const T = 112, bw = 20, bh = 104, gap = 8, aw = 46, top = 74, gw = n => n * bw + (n - 1) * gap;
        const total = T + aw + gw(PRE) + aw + gw(MID) + aw + gw(POST) + aw + T;
        let x = Math.max(0, (W - total) / 2);
        const cy = top + bh / 2, ly = top + bh + 30;
        pic(svg, defs, x, cy - T / 2, T, true);
        svText(svg, x + T / 2, ly, 'Noisy image', 'lbl', 'middle');
        x += T;
        const arrow = () => { sv('path', { d: `M${x + 10} ${cy} H${x + aw - 10} m-6 -5 l6 5 l-6 5`, class: 'wire' }, svg); x += aw; };
        const group = (n, key, l1, l2) => {
          const x0 = x;
          for (let i = 0; i < n; i++) { groups[key].push(sv('rect', { x, y: top, width: bw, height: bh, rx: 5, class: 'blk ' + key }, svg)); x += bw + gap; }
          x -= gap;
          svText(svg, (x0 + x) / 2, ly, l1, 'lbl' + (key === 'mid' ? ' mid' : ''), 'middle');
          svText(svg, (x0 + x) / 2, ly + 20, l2, 'sub', 'middle');
          return [x0, x];
        };
        arrow(); group(PRE, 'pre', 'Pre-loop', '6 blocks, run once');
        arrow(); [midA, midB] = group(MID, 'mid', 'Looped', '5 shared blocks × N');
        arrow(); group(POST, 'post', 'Post-loop', '6 blocks, run once');
        arrow();
        out = pic(svg, defs, x, cy - T / 2, T, false);
        svText(svg, x + T / 2, ly, 'Prediction', 'lbl', 'middle');
        arc = sv('path', { d: `M${midB - 4} ${top - 8} C ${midB - 4} ${top - 52}, ${midA + 4} ${top - 52}, ${midA + 4} ${top - 10}`, class: 'arc' }, svg);
        sv('path', { d: `M${midA + 4} ${top - 3} l-5.5 -8 h11 z`, class: 'arc-head' }, svg);
        svText(svg, (midA + midB) / 2, top - 60, 'shared weights', 'sub', 'middle');
        H = ly + 30;
      } else {
        const T = Math.min(128, W * 0.4), room = 66, bwid = Math.min(240, W - room - 10), left = (W - room - bwid) / 2, bh = 12, gap = 5;
        let y = 0;
        pic(svg, defs, left + bwid / 2 - T / 2, y, T, true); y += T + 20;
        svText(svg, left + bwid / 2, y, 'Noisy image', 'lbl', 'middle'); y += 12;
        const arrow = () => { sv('path', { d: `M${left + bwid / 2} ${y} v14 m-5 -6 l5 6 l5 -6`, class: 'wire' }, svg); y += 24; };
        const group = (n, key, l1, l2) => {
          svText(svg, left, y + 13, l1, 'lbl' + (key === 'mid' ? ' mid' : ''));
          svText(svg, left + bwid, y + 13, l2, 'sub', 'end');
          y += 22;
          const y0 = y;
          for (let i = 0; i < n; i++) { groups[key].push(sv('rect', { x: left, y, width: bwid, height: bh, rx: 4, class: 'blk ' + key }, svg)); y += bh + gap; }
          const y1 = y - gap;
          y += 10;
          return [y0, y1];
        };
        arrow(); group(PRE, 'pre', 'Pre-loop', 'run once');
        [midA, midB] = group(MID, 'mid', 'Looped', 'shared × N');
        group(POST, 'post', 'Post-loop', 'run once');
        arrow();
        out = pic(svg, defs, left + bwid / 2 - T / 2, y, T, false); y += T + 20;
        svText(svg, left + bwid / 2, y, 'Prediction', 'lbl', 'middle');
        H = y + 8;
        const ax = left + bwid + 8;
        arc = sv('path', { d: `M${ax} ${midB - 3} C ${ax + 44} ${midB - 3}, ${ax + 44} ${midA + 3}, ${ax + 6} ${midA + 3}`, class: 'arc' }, svg);
        sv('path', { d: `M${ax + 1} ${midA + 3} l8 -5.5 v11 z`, class: 'arc-head' }, svg);
      }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      arcLen = arc.getTotalLength ? arc.getTotalLength() : 150;
      blocks = groups;
      settle();
      return true;
    }
    // the resting state: all four loops done, prediction shown
    function settle() {
      Object.values(blocks).flat().forEach(b => b.classList.remove('hot'));
      runsEl.textContent = String(PRE + MID * N + POST);
      setLoop(N);
      out.classList.add('on');
    }
    function cycle() {
      clear();
      if (!blocks) { running = false; return; }
      running = true;
      const all = [...blocks.pre, ...blocks.mid, ...blocks.post];
      let runs = 0, t = 500;
      runsEl.textContent = '0';
      setLoop(1);
      out.classList.remove('on');
      all.forEach(b => b.classList.remove('hot'));
      const light = b => at(t, () => { all.forEach(o => o.classList.remove('hot')); b.classList.add('hot'); runsEl.textContent = String(++runs); });
      blocks.pre.forEach(b => { light(b); t += STEP; });
      for (let k = 1; k <= N; k++) {
        at(t, () => setLoop(k));
        blocks.mid.forEach(b => { light(b); t += STEP; });
        if (k < N) {
          at(t, () => { if (arc.animate) arc.animate([{ strokeDasharray: `${arcLen}`, strokeDashoffset: arcLen }, { strokeDasharray: `${arcLen}`, strokeDashoffset: 0 }], { duration: ARC, easing: 'ease-in-out' }); });
          t += ARC;
        }
      }
      blocks.post.forEach(b => { light(b); t += STEP; });
      at(t, () => { all.forEach(o => o.classList.remove('hot')); out.classList.add('on'); });
      at(t + HOLD, () => { if (visible) cycle(); else running = false; });
    }
    draw();
    if (!reduceMotion) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => {
          visible = es[0].isIntersecting;
          if (visible && !running) cycle();
        }, { threshold: 0.3 }).observe(host);
      } else cycle();
    }
    if ('ResizeObserver' in window) new ResizeObserver(() => {
      if (Math.abs(Math.round(fig.getBoundingClientRect().width) - width) < 8) return;
      clear(); running = false;
      if (draw() && visible && !reduceMotion) cycle();
    }).observe(fig);
  })();

  /* ---------- teaser slideshow: one panel at a time, 3 s each, until the reader pauses it ---------- */
  (function teaserShow() {
    const show = $('#tzShow');
    const box = $('#tzSlides'), dotsBox = $('#tzDots'), playBtn = $('#tzPlay');
    const slides = $$('.tz-slide', box), N = slides.length;
    const icon = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
    let cur = 0;
    const dots = slides.map((sl, i) => {
      const b = h('button', { type: 'button', class: 'tz-dot', 'aria-label': `Slide ${i + 1}: ${sl.querySelector('.tz-title').textContent}` }, `<span class="tz-dot-l">${sl.dataset.short}</span><i class="tz-dot-bar" aria-hidden="true"></i>`);
      if (sl.dataset.dwell) b.style.setProperty('--dwell', sl.dataset.dwell + 's');
      b.addEventListener('click', () => go(i, true));
      dotsBox.appendChild(b);
      return b;
    });
    function go(i, byHand) {
      if (byHand) start();  // choosing a slide starts the slideshow at once
      cur = (i + N) % N;
      slides.forEach((sl, j) => {
        const on = j === cur, was = sl.classList.contains('on');
        sl.classList.toggle('on', on);
        if (on !== was) sl.dispatchEvent(new Event(on ? 'tz:show' : 'tz:hide'));
        sl.setAttribute('aria-hidden', String(!on));
        sl.inert = !on;
      });
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === cur)));
      // A page chosen by hand gets its full time before the slideshow moves on.
      if (byHand && show.classList.contains('playing')) { show.classList.remove('playing'); void show.offsetWidth; show.classList.add('playing'); }
    }
    function setPaused(p) {
      show.classList.toggle('paused', p);
      playBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
      playBtn.innerHTML = p ? icon('M8 5.5l10 6.5-10 6.5z') : icon('M9 6v12M15 6v12');
      box.setAttribute('aria-live', p ? 'polite' : 'off');
    }
    // Autoplay is timed by the bar under the current page button, so pausing the bar pauses the slideshow.
    dotsBox.addEventListener('animationend', e => { if (e.animationName === 'tz-fill' && show.classList.contains('playing')) go(cur + 1); });
    $('#tzPrev').addEventListener('click', () => go(cur - 1, true));
    $('#tzNext').addEventListener('click', () => go(cur + 1, true));
    playBtn.addEventListener('click', () => setPaused(!show.classList.contains('paused')));
    show.addEventListener('keydown', e => {
      if (e.target.closest('.seg')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur + (e.key === 'ArrowRight' ? 1 : -1), true); }
    });
    // Using something inside a slide (a toggle, a thumbnail, an image) holds it there; the play button resumes.
    box.addEventListener('click', e => { if (e.target.closest('button, img')) setPaused(true); });
    let sx = null, sy = 0;
    box.addEventListener('pointerdown', e => { sx = e.pointerType === 'mouse' || e.target.closest('.chart-x') ? null : e.clientX; sy = e.clientY; });
    box.addEventListener('pointerup', e => {
      if (sx == null) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - sy)) go(cur + (dx < 0 ? 1 : -1), true);
      sx = null;
    });
    go(0);
    if (N < 2) { playBtn.remove(); return; }
    setPaused(reduceMotion);  // with reduced motion, nothing moves until the reader presses play
    // Nothing rotates until the whole panel has been on screen once (or as much of it as fits), so a reader still
    // at the title is not shown a later slide. Until then the first slide is shown finished ('waiting' in the HTML);
    // it stays that way ('built') when the timer starts, and builds itself normally on later visits.
    function start() {
      if (!show.classList.contains('waiting')) return;
      slides[cur].classList.add('built');
      show.classList.remove('waiting');
      show.classList.add('playing');
    }
    slides.forEach(sl => sl.addEventListener('tz:hide', () => sl.classList.remove('built')));
    if (reduceMotion || !('IntersectionObserver' in window)) { show.classList.remove('waiting'); show.classList.add('playing'); }
    else {
      const steps = Array.from({ length: 21 }, (_, i) => i / 20);
      const seen = new IntersectionObserver(es => {
        const e = es[0], need = Math.min(0.98, (window.innerHeight * 0.98) / e.boundingClientRect.height);
        if (e.intersectionRatio >= need - 0.01) { seen.disconnect(); start(); }
      }, { threshold: steps });
      seen.observe(show);
    }
    // Rest only while the slideshow is completely off screen.
    if ('IntersectionObserver' in window) new IntersectionObserver(es => show.classList.toggle('off', !es[0].isIntersecting), { threshold: 0 }).observe(show);
  })();

  /* ---------- marquee: loop x1 -> loop x4 for the same prompt and seed ---------- */
  (function marquee() {
    const tr = $('#mqTrack');
    const pairs = [];
    if (G.hero) pairs.push({ id: 'embrace', a: G.hero.images[0].src, b: G.hero.images[3].src, src: 'Paper · Fig. 1', prompt: G.hero.prompt });
    (G.marquee || []).forEach(p => pairs.push(p));
    if (pairs.length < 4) (G.compare || []).forEach(r => pairs.push({ id: r.id, a: r.images[0].src, b: r.images[3].src, src: 'Paper · Fig. 5', prompt: r.prompt }));
    if (!pairs.length) { $('#marquee').remove(); return; }
    const card = (p, copy) => {
      const c = h('div', { class: 'mq-card' });
      const pr = h('div', { class: 'pair' });
      const capTxt = `${p.prompt}`;
      pr.appendChild(img(p.a, `Loop ×1: ${p.prompt}`, { 'data-lb': 'mq-' + p.id + copy, 'data-lab': 'Loop ×1', 'data-cap': capTxt }));
      pr.appendChild(h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→'));
      pr.appendChild(img(p.b, `Loop ×4: ${p.prompt}`, { 'data-lb': 'mq-' + p.id + copy, 'data-lab': 'Loop ×4', 'data-cap': capTxt }));
      c.appendChild(pr);
      c.appendChild(h('div', { class: 'meta' }, `<span>${p.src || ''}</span><b>Loop ×1 → ×4</b>`));
      const preview = h('div', { class: 'cap2', text: p.prompt });
      c.appendChild(foldPrompt(preview, c));
      return c;
    };
    pairs.forEach(p => tr.appendChild(card(p, '')));
    if (!reduceMotion) pairs.forEach(p => { const c = card(p, 'b'); c.setAttribute('aria-hidden', 'true'); $$('img, button', c).forEach(i => i.setAttribute('tabindex', '-1')); tr.appendChild(c); });
    // only animate while it is on screen
    const mq = $('#marquee');
    if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => mq.classList.toggle('paused', !e.isIntersecting))).observe(mq);
  })();

  /* ---------- key finding cards ---------- */
  (function finding() {
    const box = $('#findingCards');
    const base = D.ablation[0].v, naive = D.ablation[1].v, ours = D.ablation[6].v;
    const cards = [
      { name: 'Non-looped DiT', sub: '17 blocks, no looping', v: base, spark: null, p: '' },
      { name: 'Naive looping', sub: '5 shared blocks × 4, final loop trained', v: naive, spark: D.naive.prism,
        p: 'Early loops fall below the baseline.' },
      { name: 'Looped-DiT', sub: '+ deep supervision + XSA', v: ours, spark: D.deepsup.PRISM.ds, ours: true,
        p: 'The gain holds past four loops.' }
    ];
    const names = ['DPG', 'PRISM', 'CoRe', 'Spatial'];
    cards.forEach((c, ci) => {
      const card = h('div', { class: 'card finding' + (c.ours ? ' ours' : '') });
      card.appendChild(h('div', { class: 'head' }, `<div class="name">${c.name}</div><div class="cap">${c.sub}</div>`));
      const sc = h('div', { class: 'scores' });
      names.forEach((nm, i) => {
        const d = c.v[i] - base[i];
        const delta = ci === 0 ? '<i>&nbsp;</i>' : `<i class="${d > 0.05 ? 'up' : d < -0.05 ? 'dn' : ''}">${d >= 0 ? '+' : '−'}${f1(Math.abs(d))}</i>`;
        sc.appendChild(h('div', { class: 'sc' }, `<span>${nm}</span><b>${f1(c.v[i])}</b>${delta}`));
      });
      card.appendChild(sc);
      // PRISM vs loop depth sparkline (1..8), baseline dashed; drawn 1:1 with the card's width and redrawn on resize
      card.appendChild(h('div', { class: 'spark-t' }, 'PRISM at loop depths 1–8'));
      const sparkBox = h('div', { class: 'spark-box' });
      card.appendChild(sparkBox);
      card.appendChild(h('div', { class: 'avg' }, `<span>Average of 4</span><b>${f1(c.v[4])}</b>`));
      if (c.p) card.appendChild(h('p', {}, c.p));
      box.appendChild(card);
      let drawnW = 0;
      const drawSpark = () => {
      const W = Math.round(sparkBox.clientWidth) || 260;
      if (Math.abs(W - drawnW) < 4) return;
      drawnW = W;
      sparkBox.textContent = '';
      const Hh = 74, padL = 6, padR = 6, padT = 10, padB = 18;
      const y = v => padT + (1 - (v - 38) / (56 - 38)) * (Hh - padT - padB);
      const x = i => padL + i / 7 * (W - padL - padR);
      const svg = sv('svg', { viewBox: `0 0 ${W} ${Hh}`, class: 'spark', role: 'img', 'aria-label': 'PRISM accuracy at loop depths 1 to 8' });
      sv('line', { x1: padL, x2: W - padR, y1: y(51.2), y2: y(51.2), style: 'stroke:var(--base);stroke-width:1.2;stroke-dasharray:4 3' }, svg);
      if (c.spark) sv('line', { x1: x(3), x2: x(3), y1: padT - 4, y2: Hh - padB, style: 'stroke:var(--loop-line);stroke-dasharray:2 3' }, svg);
      for (let i = 0; i < 8; i++) svText(svg, x(i), Hh - 3, String(i + 1), '', 'middle').setAttribute('style', 'font:500 11.5px var(--mono);fill:var(--muted)');
      if (c.spark) {
        const col = c.ours ? 'var(--ours)' : 'var(--loop)';
        if (!c.ours) {
          const gradient = sv('linearGradient', { id: 'naive-spark-colors', gradientUnits: 'userSpaceOnUse', x1: x(0), x2: x(7), y1: 0, y2: 0 }, sv('defs', {}, svg));
          sv('stop', { offset: 3 / 7, style: 'stop-color:var(--loop)' }, gradient);
          sv('stop', { offset: 3 / 7, style: 'stop-color:var(--fail)' }, gradient);
        }
        sv('path', { d: c.spark.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' '), style: `fill:none;stroke:${c.ours ? col : 'url(#naive-spark-colors)'};stroke-width:2.2;stroke-linejoin:round` }, svg);
        c.spark.forEach((v, i) => sv('circle', { cx: x(i), cy: y(v), r: i === 3 ? 3.8 : 2.6, style: `fill:${!c.ours && i > 3 ? 'var(--fail)' : col};stroke:var(--surface);stroke-width:1` }, svg));
      } else {
        svText(svg, W / 2, y(51.2) - 7, 'no loops', '', 'middle').setAttribute('style', 'font:500 12px var(--mono);fill:var(--muted)');
      }
      sparkBox.appendChild(svg);
      };
      drawSpark();
      if ('ResizeObserver' in window) new ResizeObserver(drawSpark).observe(sparkBox);
    });
  })();

  /* ---------- method: deep supervision as trained: decode every loop, one loss per loop against the same clean image ---------- */
  // Shapes are SVG; formulas are KaTeX in an HTML layer on top (the SVG is drawn 1:1, so coordinates match).
  (function dsAnim() {
    const box = $('#dsAnim');
    if (!box) return;
    const N = 4, TARGET = 'static/img/paper/tea_loop4.webp';
    let svg = null, cols = [], totalL = null, timers = [], visible = false, running = false, width = 0;
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    function draw() {
      width = Math.round(box.getBoundingClientRect().width);
      if (width < 200) return false;
      const narrow = width < 520;
      box.textContent = '';
      const stage = h('div', { class: 'ml-stage ds-stage' + (narrow ? '' : ' wide') });
      box.appendChild(stage);
      svg = sv('svg', { class: 'ds-svg' + (narrow ? '' : ' wide'), 'aria-hidden': 'true' }, stage);
      const layer = h('div', { class: 'ml-layer', 'aria-hidden': 'true' });
      stage.appendChild(layer);
      const ml = (x, y, html, cls) => { const d = h('div', { class: 'ml ' + cls, style: `left:${x}px;top:${y}px` }, html); layer.appendChild(d); return d; };
      const defs = sv('defs', {}, svg);
      const W = width, GAP = narrow ? 8 : 16, TCOL = narrow ? 0 : 150, TGAP = narrow ? 0 : 22;
      const cw = (W - TCOL - TGAP - 3 * GAP) / N, cx = i => i * (cw + GAP) + cw / 2;
      const yLoop = 4, hLoop = narrow ? 30 : 40, yDrop = yLoop + hLoop, hDrop = narrow ? 54 : 64, P = Math.min(cw - 12, narrow ? 50 : 76);
      const LW = narrow ? 44 : 54, hLoss = narrow ? 26 : 32;
      const yPred = yDrop + hDrop, yLoss = yPred + P + 16, yBus = yLoss + hLoss + 16;
      cols = [];
      for (let i = 0; i < N; i++) {
        const g = sv('g', { class: 'col' }, svg), x = cx(i);
        // loop i (shared weights)
        const lp = sv('g', { class: 'loop' }, g);
        sv('rect', { x: x - cw / 2, y: yLoop, width: cw, height: hLoop, rx: 9 }, lp);
        svText(lp, x, yLoop + hLoop / 2 + 5, `Loop ${i + 1}`, 'loop-t', 'middle');
        if (i < N - 1) sv('path', { d: `M${x + cw / 2 + 2} ${yLoop + hLoop / 2} h${GAP - 4} m-4.5 -4 l4.5 4 l-4.5 4`, class: 'ds-arrow' }, g);
        // training only: decode with the shared post-loop blocks
        const dr = sv('g', { class: 'drop' }, g);
        sv('path', { d: `M${x} ${yDrop + 2} V${yPred - 3}`, class: 'dash' }, dr);
        const bw = narrow ? 22 : 32, by = yDrop + hDrop / 2 - 10;
        for (let k = 0; k < 3; k++) sv('rect', { x: x - bw / 2, y: by + k * 7, width: bw, height: 5, rx: 2, class: 'post' }, dr);
        if (i === 0) svText(dr, x + bw / 2 + 6, by + 14, 'decode', 'note', 'start');
        // prediction after loop i, and its own loss
        const pr = sv('g', { class: 'pred' }, g);
        sv('rect', { x: x - P / 2, y: yPred, width: P, height: P, rx: 9 }, pr);
        sv('path', { d: `M${x} ${yPred + P + 2} V${yLoss - 2}`, class: 'link' }, pr);
        const ls = sv('g', { class: 'loss' }, g);
        sv('rect', { x: x - LW / 2, y: yLoss, width: LW, height: hLoss, rx: hLoss / 2 }, ls);
        sv('path', { d: `M${x} ${yLoss + hLoss} V${yBus}`, class: 'link' }, ls);
        cols.push({
          g,
          pred: ml(x, yPred + P / 2, texHtml(`\\hat{x}_0^{(${i + 1})}`), 'pred'),
          loss: ml(x, yLoss + hLoss / 2, texHtml(`\\ell_{${i + 1}}`), 'loss')
        });
      }
      // one clean image, the target for every loop
      const tg = sv('g', { class: 'target' }, svg);
      let T, tx, ty, H, lx, ly;
      if (!narrow) {
        T = 124; tx = W - TCOL / 2 - T / 2; ty = yPred - 10; lx = W - TCOL / 2; ly = ty - 34;
        sv('path', { d: `M${cx(0)} ${yBus} H${W - TCOL / 2} V${ty + T + 2}`, class: 'bus' }, tg);
        H = yBus + 52;
      } else {
        T = 76; tx = W / 2 - T / 2; ty = yBus + 22; lx = W / 2; ly = ty + T + 20;
        sv('path', { d: `M${cx(0)} ${yBus} H${cx(N - 1)} M${W / 2} ${yBus} V${ty - 2}`, class: 'bus' }, tg);
        H = ty + T + 84;
      }
      ml(lx, ly, `Clean image ${texHtml('x_0')}`, 'tgt on');
      ml(lx, ly + 18, 'same target, every loop', 'note on');
      sv('rect', { x: tx, y: ty, width: T, height: T, rx: 10 }, sv('clipPath', { id: 'dsClip' }, defs));
      const im = sv('image', { href: TARGET, x: tx, y: ty, width: T, height: T, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#dsClip)' }, tg);
      im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', TARGET);
      sv('rect', { x: tx, y: ty, width: T, height: T, rx: 10, class: 'tgt-frame' }, tg);
      // the training loss: every loop's loss, weighted and summed
      totalL = ml(narrow ? W / 2 : (W - TCOL - TGAP) / 2, H - 16, `Training loss ${texHtml('\\mathcal{L} = \\textstyle\\sum_{n} w_n\\,\\ell_n')}`, 'total');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      settle();
      return true;
    }
    function setCol(c, k) {
      c.g.classList.add('s' + k);
      if (k === 3) c.pred.classList.add('on');
      if (k === 4) c.loss.classList.add('on');
    }
    function settle() {
      cols.forEach(c => [1, 2, 3, 4].forEach(k => setCol(c, k)));
      svg.classList.add('bus-on'); totalL.classList.add('on');
    }
    function cycle() {
      clear();
      if (!svg) { running = false; return; }
      running = true;
      cols.forEach(c => { c.g.setAttribute('class', 'col'); c.pred.classList.remove('on'); c.loss.classList.remove('on'); });
      svg.classList.remove('bus-on'); totalL.classList.remove('on');
      const STEP = 1500;
      cols.forEach((c, i) => {
        const t0 = 450 + i * STEP;
        at(t0, () => { cols.forEach(o => o.g.classList.remove('hot')); c.g.classList.add('hot'); setCol(c, 1); });
        at(t0 + 250, () => setCol(c, 2));
        at(t0 + 600, () => setCol(c, 3));
        at(t0 + 950, () => { setCol(c, 4); svg.classList.add('bus-on'); });
      });
      const tEnd = 450 + N * STEP;
      at(tEnd, () => { cols.forEach(o => o.g.classList.remove('hot')); totalL.classList.add('on'); });
      at(tEnd + 3400, () => { if (visible) cycle(); else { running = false; settle(); } });
    }
    draw();
    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(es => {
        visible = es[0].isIntersecting;
        if (visible && !running) cycle();
      }, { threshold: 0.4 }).observe(box);
    }
    if ('ResizeObserver' in window) new ResizeObserver(() => {
      if (Math.abs(Math.round(box.getBoundingClientRect().width) - width) < 8) return;
      clear(); running = false;
      if (draw() && visible && !reduceMotion) cycle();
    }).observe(box);
  })();

  /* ---------- method: self-modulating attention: how XSA modulates (the paper's definition), and what it changes ---------- */
  (function smaAnim() {
    const box = $('#smaAnim'), cs = G.xsaCase;
    if (!box || !cs) return;
    const grid = h('div', { class: 'sma-grid' });
    box.appendChild(grid);

    // How it modulates: first the general operation z = G·o, then the paper's two choices of G (gated attention, XSA).
    const mech = h('div', { class: 'sma-mech' });
    mech.appendChild(h('div', { class: 'sma-sub' }, 'How it modulates'));
    const mTitle = h('div', { class: 'mech-title' });
    mech.appendChild(mTitle);
    const vec = h('div', { class: 'sma-vec' });
    mech.appendChild(vec);
    const mPills = h('div', { class: 'mech-steps', role: 'tablist', 'aria-label': 'Modulation' });
    mech.appendChild(mPills);
    grid.appendChild(mech);
    const SCENES = [
      { pill: 'Modulate', title: 'A gate modulates each attention output', dur: 5600 },
      { pill: 'Gated', title: 'Option 1 is gated attention', dur: 5200 },
      { pill: 'XSA', title: 'Option 2 is XSA, which worked better', dur: 6400 }
    ];
    const pillBtns = SCENES.map((sc, k) => {
      const b = h('button', { type: 'button', role: 'tab', 'aria-label': sc.title }, sc.pill);
      b.addEventListener('click', () => showScene(k, !reduceMotion));
      mPills.appendChild(b);
      return b;
    });
    let scenes = [], mw = 0, mt = [], vvis = false, vrun = false, mcur = 0;
    const mclear = () => { mt.forEach(clearTimeout); mt = []; };
    const rad = a => a * Math.PI / 180;
    // one scene: an SVG with a KaTeX label layer; `st` toggles drawing states, `lab` makes a label that shows with a state
    function makeScene(stage, W, H) {
      const el = h('div', { class: 'scene' });
      stage.appendChild(el);
      const svg = sv('svg', { class: 'vec-svg', viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true' }, el);
      const layer = h('div', { class: 'ml-layer', 'aria-hidden': 'true' });
      el.appendChild(layer);
      const labels = [];
      const lab = (x, y, html, cls, state) => {
        const d = h('div', { class: 'ml ' + cls + (state ? '' : ' on'), style: `left:${x}px;top:${y}px` }, html);
        layer.appendChild(d);
        if (state) labels.push([state, d]);
        return d;
      };
      const arrow = (from, to, cls) => {
        const g = sv('g', { class: 'arr ' + cls }, svg);
        sv('path', { d: `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`, pathLength: 1, class: 'shaft' }, g);
        const ang = Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI;
        sv('path', { d: 'M1 0 L-9 -4.5 L-9 4.5 Z', class: 'head', transform: `translate(${to[0]} ${to[1]}) rotate(${ang})` }, g);
        return g;
      };
      const sc = { el, svg, arrow, lab, states: [] };
      sc.set = (state, on) => { svg.classList.toggle(state, on); labels.forEach(([s, d]) => { if (s === state) d.classList.toggle('on', on); }); };
      sc.reset = () => sc.states.forEach(s => sc.set(s, false));
      sc.settle = () => sc.states.forEach(s => sc.set(s, true));
      return sc;
    }
    function drawMech() {
      mw = Math.round(vec.getBoundingClientRect().width);
      if (mw < 160) return false;
      vec.textContent = '';
      const W = Math.min(mw, 380), H = Math.round(W * 0.8), s = W / 340;
      const stage = h('div', { class: 'ml-stage mech-stage', style: `width:${W}px;height:${H}px` });
      vec.appendChild(stage);
      scenes = [];

      // 1. The general operation: the attention output o passes a gate G, computed from the current state at every loop.
      {
        const sc = makeScene(stage, W, H), y = H * 0.4;
        const x0 = 16 * s, x1 = 112 * s, gx = 122 * s, gw = 72 * s, gh = 66 * s, x2 = gx + gw + 8 * s, x3 = x2 + 62 * s, px = x3 + 25 * s;
        sc.arrow([x0, y], [x1, y], 'o draw');
        sv('rect', { x: gx, y: y - gh / 2, width: gw, height: gh, rx: 12 * s, class: 'gate' }, sc.svg);
        sc.arrow([gx + gw / 2, H * 0.8], [gx + gw / 2, y + gh / 2 + 5], 'st draw');
        sc.arrow([x2, y], [x3, y], 'z draw');
        sv('circle', { cx: px, cy: y, r: 13 * s, class: 'plus' }, sc.svg);
        sv('path', { d: `M${px - 6 * s} ${y} H${px + 6 * s} M${px} ${y - 6 * s} V${y + 6 * s}`, class: 'plus-t' }, sc.svg);
        sc.lab((x0 + x1) / 2, y - 22 * s, texHtml('o_i'), 'lo', 'st-o');
        sc.lab((x0 + x1) / 2, y + 22 * s, 'attention output', 'cap', 'st-o');
        sc.lab(gx + gw / 2, y, texHtml('G_i'), 'lg', 'st-g');
        sc.lab(gx + gw / 2, H * 0.8 + 16 * s, 'current state, recomputed every loop', 'cap', 'st-g');
        sc.lab((x2 + x3) / 2 + 4 * s, y - 24 * s, texHtml('z_i = G_i\\, o_i'), 'lz', 'st-z');
        sc.lab(px, y + 28 * s, 'written back', 'cap', 'st-z');
        sc.states = ['st-o', 'st-g', 'st-z'];
        sc.timeline = [[350, 'st-o'], [1300, 'st-g'], [2300, 'st-z']];
        scenes.push(sc);
      }

      // 2. Gated attention: G = σ(wᵀu + b), a learned scalar per head that scales the update and keeps its direction.
      {
        const sc = makeScene(stage, W, H), x0 = 74 * s, L = 196 * s, gates = [0.9, 0.5, 0.2];
        gates.forEach((g, k) => {
          const y = H * (0.2 + k * 0.2);
          sc.lab(34 * s, y, `head ${k + 1}`, 'cap', null);
          sc.arrow([x0, y], [x0 + L, y], 'o draw');
          sc.arrow([x0, y], [x0 + L * g, y], 'z draw');
          sc.lab(x0 + L + 30 * s, y, texHtml(`\\times\\,${g.toFixed(1)}`), 'lg', 'st-z');
        });
        sc.lab(W / 2, H * 0.83, texHtml('G_{i,h} = \\sigma\\!\\left(w_{g,h}^{\\top} u_i + b_{g,h}\\right)'), 'lf', 'st-z');
        sc.states = ['st-o', 'st-z'];
        sc.timeline = [[350, 'st-o'], [1500, 'st-z']];
        scenes.push(sc);
      }

      // 3. XSA: G = I − v̂v̂ᵀ removes the token's own value direction v̂ from o; the result z is perpendicular to v̂ and never longer.
      {
        const sc = makeScene(stage, W, H), O = [W * 0.33, H * 0.62];
        const pt = (a, l) => [O[0] + Math.cos(rad(a)) * l * s, O[1] - Math.sin(rad(a)) * l * s];
        const VA = 12, OA = 64, OL = 160;
        [[36, 104], [142, 88], [168, 72]].forEach(([a, l]) => sc.arrow(O, pt(a, l), 'vj'));
        const vEnd = pt(VA, 186);
        sv('path', { d: `M${O[0]} ${O[1]} L${vEnd[0]} ${vEnd[1]}`, class: 'vhat' }, sc.svg);
        const oTip = pt(OA, OL), along = OL * Math.cos(rad(OA - VA));
        const zTip = [oTip[0] - Math.cos(rad(VA)) * along * s, oTip[1] + Math.sin(rad(VA)) * along * s];
        sc.arrow(O, oTip, 'o draw');
        sv('path', { d: `M${zTip[0]} ${zTip[1]} L${oTip[0]} ${oTip[1]}`, class: 'rm' }, sc.svg);
        const c = 9 * s, u2 = [Math.cos(rad(VA)), -Math.sin(rad(VA))], n2 = [Math.cos(rad(VA + 90)), -Math.sin(rad(VA + 90))];
        sv('path', { d: `M${O[0] + u2[0] * c} ${O[1] + u2[1] * c} L${O[0] + (u2[0] + n2[0]) * c} ${O[1] + (u2[1] + n2[1]) * c} L${O[0] + n2[0] * c} ${O[1] + n2[1] * c}`, class: 'perp' }, sc.svg);
        sc.arrow(O, zTip, 'z draw');
        sc.lab(vEnd[0] + 4, vEnd[1] - 16, texHtml('\\hat{v}_i'), 'lv', null);
        sc.lab(vEnd[0] - 6, vEnd[1] + 16, 'own value', 'cap', null);
        const vj = pt(142, 100);
        sc.lab(vj[0] - 4, vj[1] - 8, texHtml('v_j'), 'lvj', null);
        sc.lab(oTip[0] + 16, oTip[1] - 4, texHtml('o_i'), 'lo', 'st-o');
        sc.lab((zTip[0] + oTip[0]) / 2, (zTip[1] + oTip[1]) / 2 - 16, 'removed', 'lrm', 'st-rm');
        sc.lab(zTip[0] - 16, zTip[1] - 6, texHtml('z_i'), 'lz', 'st-z');
        sc.lab(W / 2, H * 0.89, texHtml('G_i = I - \\hat{v}_i \\hat{v}_i^{\\top}'), 'lf', 'st-z');
        sc.states = ['st-o', 'st-rm', 'st-z', 'st-dim'];
        sc.timeline = [[350, 'st-o'], [1500, 'st-rm'], [2400, 'st-z'], [3300, 'st-dim']];
        scenes.push(sc);
      }
      showScene(mcur, false);
      return true;
    }
    // Show scene k; when playing, run its timeline and then move on to the next scene.
    function showScene(k, play) {
      mclear();
      mcur = k;
      scenes.forEach((sc, i) => sc.el.classList.toggle('on', i === k));
      pillBtns.forEach((b, i) => b.setAttribute('aria-selected', String(i === k)));
      mTitle.textContent = SCENES[k].title;
      const sc = scenes[k];
      if (!sc) return;
      if (!play) { sc.settle(); vrun = false; return; }
      vrun = true;
      sc.reset();
      sc.timeline.forEach(([ms, state]) => mt.push(setTimeout(() => sc.set(state, true), ms)));
      mt.push(setTimeout(() => { if (vvis) showScene((k + 1) % SCENES.length, true); else { vrun = false; sc.settle(); } }, SCENES[k].dur));
    }
    drawMech();

    // What it changes: the paper's balloon example, loops 1-4 side by side
    const eff = h('div', { class: 'sma-effect' });
    eff.appendChild(h('div', { class: 'sma-sub' }, 'What it changes'));
    grid.appendChild(eff);
    const STEP = 2000;
    eff.appendChild(h('p', { class: 'mp-prompt' }, cs.promptHtml.replace(/^Prompt:\s*/, '')));
    const lanes = [
      { row: cs.rows.find(r => !r.ok), name: 'Plain attention' },
      { row: cs.rows.find(r => r.ok), name: 'With XSA' }
    ].map(l => {
      const lane = h('figure', { class: 'sma-lane' });
      lane.appendChild(h('figcaption', {}, l.name));
      const frames = h('div', { class: 'sma-frames' });
      // the strip holds the four loop predictions side by side; each frame shows one quarter
      const fr = [0, 1, 2, 3].map(i => frames.appendChild(h('i', { style: `background-image:url(${l.row.heat});background-position:${i * 100 / 3}% 0` })));
      lane.appendChild(frames);
      const mark = h('p', { class: 'tz-mark' });
      lane.appendChild(mark);
      return { lane, fr, mark, counts: l.row.counts };
    });
    const pair = h('div', { class: 'sma-pair' });
    lanes.forEach(l => pair.appendChild(l.lane));
    eff.appendChild(pair);
    const steps = h('div', { class: 'sma-steps', role: 'tablist', 'aria-label': 'Loop' });
    const btns = [0, 1, 2, 3].map(i => {
      const b = h('button', { type: 'button', role: 'tab', 'aria-label': `Loop ${i + 1}` }, `Loop ×${i + 1}<i class="sma-bar" aria-hidden="true"></i>`);
      b.addEventListener('click', () => { box.classList.remove('rotating'); select(i); });
      steps.appendChild(b);
      return b;
    });
    eff.appendChild(steps);
    eff.appendChild(h('div', { class: 'sma-legend', 'aria-hidden': 'true' }, '<span>small update</span><i></i><span>large update</span>'));
    box.style.setProperty('--step', STEP / 1000 + 's');
    let cur = 0;
    function select(i) {
      cur = i;
      btns.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
      lanes.forEach(l => {
        l.fr.forEach((f, j) => f.classList.toggle('on', j === i));
        const n = l.counts[i], ok = n === 4;
        l.mark.className = 'tz-mark ' + (ok ? 'ok' : 'bad');
        l.mark.innerHTML = `<span aria-hidden="true">${ok ? '✓' : '✗'}</span>${n} balloons`;
      });
    }
    // each loop is timed by the bar under its button, as in the slideshow
    steps.addEventListener('animationend', e => { if (e.animationName === 'tz-fill' && box.classList.contains('rotating')) select((cur + 1) % 4); });
    select(3);

    if ('ResizeObserver' in window) new ResizeObserver(() => {
      if (Math.abs(Math.round(vec.getBoundingClientRect().width) - mw) < 8) return;
      const playing = vrun;
      mclear(); vrun = false;
      if (drawMech() && playing && vvis && !reduceMotion) showScene(mcur, true);
    }).observe(vec);
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    let started = false;
    new IntersectionObserver(es => {
      const on = es[0].isIntersecting;
      box.classList.toggle('offscreen', !on);
      vvis = on;
      if (on && !vrun) showScene(started ? mcur : 0, true);
      if (on && !started) { started = true; select(0); box.classList.add('rotating'); }
    }, { threshold: 0.35 }).observe(box);
  })();

  /* ---------- results: main table ---------- */
  (function mainTable() {
    const t = $('#mainTable');
    const cols = ['Params', ...D.main.cols];
    const all = [];
    D.main.groups.forEach(g => g.rows.forEach(r => all.push({ name: r[0], p: r[1], v: r[2], grp: g.name })));
    const ours = { name: D.main.ours[0], p: D.main.ours[1], v: D.main.ours[2], ours: true };
    all.push(ours);
    const best = D.main.cols.map((_, j) => Math.max(...all.map(r => r.v[j])));
    let sortKey = null, sortDir = -1;
    function cell(r, j) {
      const v = r.v[j];
      return `<td class="${v === best[j] ? 'best' : ''}">${f1(v)}</td>`;
    }
    function rowHtml(r) {
      return `<tr class="${r.ours ? 'ours' : ''}"><td class="model">${r.name}</td><td>${r.p < 1 ? r.p.toFixed(2) : r.p.toFixed(1)}B</td>${D.main.cols.map((_, j) => cell(r, j)).join('')}</tr>`;
    }
    function render() {
      const head = '<thead><tr><th scope="col">Model</th>' + cols.map((c, i) => {
        const key = i === 0 ? 'p' : i - 1;
        const s = sortKey === key ? ` aria-sort="${sortDir < 0 ? 'descending' : 'ascending'}"` : '';
        const arr = sortKey === key ? (sortDir < 0 ? '↓' : '↑') : '↕';
        return `<th scope="col"${s}><button type="button" data-k="${key}">${c}<span class="arr">${arr}</span></button></th>`;
      }).join('') + '</tr></thead>';
      let body = '';
      if (sortKey == null) {
        D.main.groups.forEach(g => {
          body += `<tr class="grp"><td colspan="${cols.length + 1}">${g.name}</td></tr>`;
          g.rows.forEach(r => { body += rowHtml(all.find(a => a.name === r[0])); });
        });
        body += `<tr class="grp"><td colspan="${cols.length + 1}">Looped model</td></tr>` + rowHtml(ours);
      } else {
        const val = r => sortKey === 'p' ? r.p : r.v[sortKey];
        [...all].sort((a, b) => sortDir * (val(a) - val(b)) || (a.ours ? -1 : 1)).forEach(r => { body += rowHtml(r); });
      }
      t.innerHTML = head + '<tbody>' + body + '</tbody>';
      $$('thead button', t).forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.k === 'p' ? 'p' : +b.dataset.k;
        if (sortKey === k) { if (sortDir === -1) sortDir = 1; else { sortKey = null; sortDir = -1; } }
        else { sortKey = k; sortDir = k === 'p' ? 1 : -1; }
        render();
        const nb = $(`thead button[data-k="${b.dataset.k}"]`, t); if (nb) nb.focus();
      }));
    }
    render();
  })();

  /* ---------- results: Pareto bubbles ---------- */
  (function pareto() {
    // Looped-DiT in the page's orange, lighter for cheaper settings; every other model in one cool neutral.
    const loopColors = {
      '1:25': '#F7C9A9', '4:25': '#F3A877', '1:100': '#EE8848',
      '2:100': '#EA6F28', '4:100': '#E8590C'
    };
    const otherColor = '#8593A8';
    const pts = D.pareto.map(p => {
      const r = 8 + 23 * Math.sqrt(p.params);
      const o = { name: p.name, vals: { tflops: p.tflops, latency: p.latency }, y: p.avg, r: p.ours ? 11 : r, cls: p.ours ? 'ours' : '', color: p.ours ? loopColors[`${p.loops}:${p.steps}`] : otherColor };
      if (p.ours) {
        // Spelled out as in the paper's figure, so the chart needs no legend or footnote.
        o.label = p.steps === 25 ? `Loop ×${p.loops}\n${p.steps} steps` : `Loop ×${p.loops} · ${p.steps} steps`;
        o.lab = { all: [15, 4, 'start'] };
        if (p.loops === 1 && p.steps === 25) o.lab = { all: [0, 27, 'middle'] };
        if (p.loops === 4 && p.steps === 25) o.lab = { all: [-13, -25, 'end'] };
        if (p.loops === 1 && p.steps === 100) o.lab = { all: [-15, -10, 'end'] };
        if (p.loops === 2 && p.steps === 100) o.lab = { all: [-15, -10, 'end'] };
        if (p.loops === 4 && p.steps === 100) o.lab = { all: [16, 4, 'start'] };
      } else {
        o.lab = { all: [r + 5, 4, 'start'] };
        if (p.name === 'CogView4') o.lab = { all: [0, -r - 6, 'middle'] };
        if (p.name === 'MiniT2I-B/16') o.lab = { all: [r + 5, 12, 'start'] };
        if (p.name === 'DeCo-XXL/16') o.lab = { all: [-r - 5, 4, 'end'] };
      }
      o.aria = `${p.name}: average ${p.avg}, ${p.tflops} TFLOPs, ${p.latency} s`;
      o.raw = p;
      return o;
    });
    const host = $('#chPareto');
    let api = null, field = 'tflops';
    const opts = {
      m: { l: 62, r: 24, t: 20, b: 54 },
      y: { min: 60, max: 73, ticks: [60, 63, 66, 69, 72], label: 'Average score (6 benchmarks)' },
      fields: {
        tflops: { label: 'Inference compute per image (TFLOPs, log scale)', min: 14, max: 9000, ticks: [20, 50, 100, 200, 500, 1000, 2000, 5000] , fmt: v => v >= 1000 ? (v / 1000) + 'k' : v },
        latency: { label: 'Latency per image (s, log scale, 1× H100)', min: 0.07, max: 15, ticks: [0.1, 0.2, 0.5, 1, 2, 5, 10] }
      },
      points: pts,
      path: D.pareto.filter(p => p.ours).map(p => p.name),
      tipRows: p => {
        const r = p.raw;
        return `<span class="tip-row">Average<b>${f1(r.avg)}</b></span><span class="tip-row">Compute<b>${r.tflops} TFLOPs</b></span><span class="tip-row">Latency<b>${r.latency} s</b></span><span class="tip-row">Parameters<b>${r.params}B</b></span>`;
      },
      aria: 'Average benchmark score against inference cost for Looped-DiT B/16 and other models'
    };
    const build = (w, h) => {
      host.textContent = '';
      api = C.bubbleChart(host, Object.assign({}, opts, { w, h, field }));
      let mine = 0, other = 0;
      $$('.pt', host).forEach(g => g.style.setProperty('--d', (g.classList.contains('ours') ? 520 + 110 * mine++ : 70 * other++) + 'ms'));
    };
    // In the slideshow the chart fills the shared frame (phones scroll it sideways at 560 px).
    if (host.closest('.tz-slide')) tzFrame.on(({ w: fw, h: fh, narrow }) => build(narrow ? 560 : fw, fh));
    else build(760, 380);
    const seg = $$('#paretoSeg button');
    const setField = (f, animate) => {
      field = f;
      seg.forEach(o => o.setAttribute('aria-selected', String(o.dataset.f === f)));
      api.set(f, animate);
    };
    seg.forEach(b => b.addEventListener('click', () => setField(b.dataset.f, true)));
    // In the slideshow: open on Compute, then switch to Latency when the slide's timer runs out.
    const slide = $('#chPareto').closest('.tz-slide');
    if (slide) {
      slide.addEventListener('tz:show', () => setField('tflops', false));
      slide.addEventListener('animationend', e => { if (e.target.classList.contains('tz-timer')) setField('latency', true); });
    }
  })();

  /* ---------- matched parameters / compute ---------- */
  (function matched() {
    const box = $('#matchedRows');
    const names = ['Non-looped MiniT2I', 'Deeper MiniT2I', 'Wider MiniT2I', 'Deeper + deep supervision', 'Looped-DiT'];
    const notes = ['Parameter-matched baseline', 'Similar inference compute', 'Similar inference compute', 'Matched training compute', 'Shared blocks, loop depth 4'];
    // Gains are from unrounded paper scores, rather than differences of displayed averages.
    const gains = ['—', '+2.6', '+3.5', '+3.0', '+4.0'];
    const table = h('table', { class: 'tbl matched-table', 'aria-label': 'B/32 model size, compute cost, and average score' });
    table.innerHTML = '<thead><tr><th scope="col">Model</th><th scope="col">Parameters<small>millions</small></th><th scope="col">Inference<small>GFLOPs / pass</small></th><th scope="col">Training<small>GFLOPs / sample</small></th><th scope="col">Average<small>4 benchmarks</small></th><th scope="col">Gain<small>points</small></th></tr></thead>';
    const body = h('tbody');
    D.matched.forEach((r, i) => {
      const row = h('tr', { class: r.ours ? 'ours' : '' });
      row.appendChild(h('th', { scope: 'row', class: 'model-cell' }, `${names[i]}<small>${notes[i]}</small>`));
      [r.params, r.infer, r.train].forEach((v, j) => row.appendChild(h('td', { 'data-label': ['Parameters (M)', 'Inference (GFLOPs)', 'Training (GFLOPs)'][j] }, v.toLocaleString('en-US'))));
      row.appendChild(h('td', { class: 'average-cell', 'data-label': 'Average score' }, f1(r.avg)));
      row.appendChild(h('td', { class: 'gain-cell', 'data-label': 'Gain (points)' }, gains[i]));
      body.appendChild(row);
    });
    table.appendChild(body);
    box.appendChild(table);
  })();

  /* ---------- loops vs. denoising steps ---------- */
  (function steps() {
    const box = $('#stepsMultiples');
    const S = D.steps, apis = [];
    const yr = { DPG: [83.2, 85.9, [83.5, 84, 84.5, 85, 85.5]], PRISM: [50.0, 53.8, [50, 51, 52, 53]], CoRe: [39.5, 44.5, [40, 41, 42, 43, 44]], Spatial: [49.85, 52.0, [50, 50.5, 51, 51.5]] };
    ['DPG', 'PRISM', 'CoRe', 'Spatial'].forEach(k => {
      const cell = h('div', {});
      cell.appendChild(h('div', { class: 'mtitle' }, k === 'CoRe' ? 'T2I-CoReBench' : k === 'Spatial' ? 'SpatialGenEval' : k === 'DPG' ? 'DPG-Bench' : 'PRISM'));
      const c = h('div', {});
      cell.appendChild(c);
      box.appendChild(cell);
      apis.push(C.lineChart(c, {
        // four across on wide screens: tall enough to fill the height of the question beside them
        w: 250, h: cw => cw < 320 ? 300 : 244, m: { l: 36, r: 10, t: 18, b: 40 },
        x: { min: 6.6, max: 31.5, log: true, ticks: [7, 10, 14, 20, 28], values: S.tflops.l4, label: 'TFLOPs per image' },
        y: { min: yr[k][0], max: yr[k][1], ticks: yr[k][2], fmt: v => k === 'DPG' || k === 'Spatial' ? v.toFixed(1) : String(v) },
        group: 'steps',
        tipTitle: (x, i) => `Budget ≈ ${S.budgets[i]} TFLOPs`,
        series: [
          { name: `Loop ×4`, cls: 's-ours', x: S.tflops.l4, y: S[k].l4, pointLabels: S.loop4Steps.map(String) },
          { name: `Loop ×1`, cls: 's-naive', x: S.tflops.l1, y: S[k].l1, pointLabels: S.loop1Steps.map(String) },
          { name: 'Non-looped', cls: 's-base', x: S.tflops.l1, y: S[k].base, marker: 'square', pointLabels: S.loop1Steps.map(String) }
        ]
      }));
    });
    apis.forEach(a => C.playOnApproach(a));
  })();

  /* ---------- CoT complementarity ---------- */
  (function cot() {
    const box = $('#cotChart');
    const methods = [
      { key: 'cot', name: 'CoT', cls: 'cot-rewrite' },
      { key: 'loop', name: 'Looping', cls: 'cot-loop' },
      { key: 'both', name: 'Both', cls: 'cot-both' }
    ];
    // The average gains are in the question's headline; the chart shows where each one helps.

    const details = h('div', { class: 'cot-details' });
    const group = (title, rows) => {
      const panel = h('div', { class: 'cot-group' });
      panel.appendChild(h('h4', {}, title));
      const axis = h('div', { class: 'cot-axis', 'aria-hidden': 'true' });
      [0, 5, 10, 15, 20, 25].forEach(v => axis.appendChild(h('span', { style: `left:${v / 25 * 100}%` }, String(v))));
      panel.appendChild(axis);
      rows.forEach(r => {
        const row = h('div', { class: 'cot-task' });
        row.appendChild(h('h5', {}, r[0]));
        methods.forEach((method, i) => {
          const value = r[i + 1];
          const bar = h('div', { class: 'cot-bar ' + method.cls, role: 'img', 'aria-label': `${r[0]}, ${method.name}: +${f1(value)} points` });
          bar.appendChild(h('span', { class: 'cot-bar-label', 'aria-hidden': 'true' }, method.name));
          bar.appendChild(h('div', { class: 'cot-track', 'aria-hidden': 'true' }, `<span class="cot-fill" style="width:${value / 25 * 100}%"></span>`));
          bar.appendChild(h('span', { class: 'cot-value', 'aria-hidden': 'true' }, `+${f1(value)}`));
          row.appendChild(bar);
        });
        panel.appendChild(row);
      });
      details.appendChild(panel);
    };
    // three subtasks on each side: where looping's gain over CoT is largest, and every CoT-favoured one
    group('Where looping helps most', D.cot.loopFavored.filter(r => ['PRISM · Long Text', 'CoRe · Multi-Relation', 'Spatial · Orientation'].includes(r[0])));
    group('Where chain of thought helps most', D.cot.cotFavored);
    box.appendChild(details);
  })();

  /* ---------- ablation table ---------- */
  (function abl() {
    const t = $('#ablTable');
    const best = [0, 1, 2, 3, 4].map(j => Math.max(...D.ablation.map(r => r.v[j])));
    const x = '<span class="x">✗</span>', ok = '<span class="chk">✓</span>';
    // Loop weights (w1..w4) from the paper's Table 4 caption; without deep supervision only the final loop is supervised.
    const dsCell = r => !r.loop ? '<span class="x">—</span>' : !r.ds ? '<span class="x">Final loop only</span>' : r.ds;
    let html = '<thead><tr><th scope="col" class="l">Looping</th><th scope="col" class="l">Deep supervision</th><th scope="col" class="l">Attention</th><th scope="col">DPG</th><th scope="col">PRISM</th><th scope="col">CoRe</th><th scope="col">Spatial</th><th scope="col" style="min-width:190px">Average</th></tr></thead><tbody>';
    D.ablation.forEach(r => {
      const w = Math.max(4, Math.round((r.v[4] - 54) / (60 - 54) * 96));
      html += `<tr class="${r.ours ? 'ours' : ''}"><td style="text-align:left">${r.loop ? ok : x}</td><td style="text-align:left">${dsCell(r)}</td><td style="text-align:left">${r.attn ? r.attn : x}</td>` +
        r.v.slice(0, 4).map((v, j) => `<td class="${v === best[j] ? 'best' : ''}">${f1(v)}</td>`).join('') +
        `<td><span class="pbar" style="width:${w}px"></span><b class="${r.v[4] === best[4] ? 'best' : ''}" style="${r.v[4] === best[4] ? 'color:var(--ours)' : ''}">${f1(r.v[4])}</b></td></tr>`;
    });
    t.innerHTML = html + '</tbody>';
  })();

  /* ---------- deep supervision multiples ---------- */
  (function deepsup() {
    const box = $('#dsMultiples');
    const S = D.deepsup, apis = [];
    const yr = { DPG: [72, 87, [72, 76, 80, 84]], PRISM: [37.5, 56, [38, 42, 46, 50, 54]], CoRe: [32, 46.5, [32, 36, 40, 44]], Spatial: [44, 53.4, [44, 46, 48, 50, 52]] };
    ['DPG', 'PRISM', 'CoRe', 'Spatial'].forEach(k => {
      const cell = h('div', {});
      cell.appendChild(h('div', { class: 'mtitle' }, k === 'CoRe' ? 'T2I-CoReBench' : k === 'Spatial' ? 'SpatialGenEval' : k === 'DPG' ? 'DPG-Bench' : 'PRISM'));
      const c = h('div', {});
      cell.appendChild(c);
      box.appendChild(cell);
      apis.push(C.lineChart(c, {
        w: 250, h: 200, m: { l: 34, r: 8, t: 16, b: 28 },
        x: { min: 1, max: 8, ticks: [1, 2, 3, 4, 5, 6, 7, 8], values: S.x },
        y: { min: yr[k][0], max: yr[k][1], ticks: yr[k][2] },
        group: 'ds', tipTitle: x => 'Loop depth ' + x,
        series: [
          { name: 'Deep supervision', cls: 's-ours', y: S[k].ds, emph: 3 },
          { name: 'No deep supervision', cls: 's-plain', y: S[k].no, marker: 'square' }
        ],
        refs: [{ y: S[k].base }], vlines: [{ x: 4, label: '×4' }]
      }));
    });
    apis.forEach(a => C.playOnApproach(a));
  })();

  /* ---------- adaptive looping ---------- */
  (function adaptive() {
    const A = D.adaptive;
    C.lineChart($('#chAdaptive'), {
      w: 460, h: 260, m: { l: 44, r: 14, t: 18, b: 36 }, hover: 'nearest',
      x: { min: 0.85, max: 4.15, ticks: [1, 2, 3, 4], values: A.adaptive.x, label: 'Average loops per image' },
      y: { min: 57.5, max: 59.4, ticks: [57.5, 58, 58.5, 59], fmt: v => v.toFixed(1) },
      tipTitle: (x) => `≈ ${x.toFixed(2)} loops per image`, valueFmt: v => v.toFixed(2),
      series: [
        { name: 'Adaptive', cls: 's-ours', x: A.adaptive.x, y: A.adaptive.y, pointLabels: [
          { t: '1', dx: -8, dy: 4, anchor: 'end' }, { t: '1.25', dx: -8, dy: 4, anchor: 'end' }, { t: '1.58', dx: -6, dy: -8, anchor: 'end' },
          { t: '2.22', dy: -10 }, { t: '2.70', dy: -10 }, { t: '3.27', dy: -10 }, { t: '4', dy: -10 }] },
        { name: 'Fixed', cls: 's-naive', x: A.fixed.x, y: [...A.fixed.y], pointLabels: [null, { t: '2', dy: 17 }, { t: '3', dy: 17 }, null] }
      ]
    });
    const box = $('#adaptiveCases');
    (G.adaptive || []).forEach(cs => {
      const wrap = h('div', { style: 'display:grid;gap:8px' });
      const strip = h('div', { class: 'lstrip', style: 'grid-template-columns:repeat(5,minmax(0,1fr))' });
      cs.images.forEach((im, i) => {
        const fig = h('figure', { class: im.adaptive ? 'last' : '' });
        const d = h('div', { class: 'im' });
        const n = im.label.split('=')[1].trim();
        const lab = im.adaptive ? `Adaptive<br>×${n} avg` : `×${n}`;
        d.appendChild(img(im.src, cs.prompt, { 'data-lb': 'adaptive-' + cs.id, 'data-lab': `${im.adaptive ? `Adaptive, ×${n} on average` : `×${n}`} · ${im.ok ? 'correct' : 'incorrect'}`, 'data-cap': cs.prompt }));
        fig.appendChild(d);
        fig.appendChild(h('figcaption', {}, `<span>${lab}</span><span class="badge ${im.ok ? 'pass' : 'fail'}">${im.ok ? '✓' : '✗'}</span>`));
        strip.appendChild(fig);
      });
      wrap.appendChild(strip);
      wrap.appendChild(h('p', { class: 'gnote' }, `“${cs.promptHtml || cs.prompt}”`));
      box.appendChild(wrap);
    });
    if (!box.children.length) (box.closest('.card') || box).remove();
  })();

  /* ---------- SMA analysis ---------- */
  (function smaCharts() {
    const S = D.sma;
    const cls = { 'DeepSup + XSA': 's-ours', 'DeepSup + Gated': 's-gated', 'DeepSup': 's-ds', 'Naive looping': 's-naive' };
    // the page's names for the paper's variants
    const label = { 'DeepSup + XSA': 'Deep supervision + XSA', 'DeepSup + Gated': 'Deep supervision + gated', 'DeepSup': 'Deep supervision only', 'Naive looping': 'Naive looping' };
    const names = Object.keys(S.r2);
    const r2 = C.lineChart($('#chSmaR2'), {
      w: 460, h: 250, m: { l: 42, r: 12, t: 18, b: 34 }, group: 'sma',
      x: { min: 1, max: 8, ticks: [1, 2, 3, 4, 5, 6, 7, 8], values: S.x, label: 'Loop depth' },
      y: { min: 0.54, max: 0.9, ticks: [0.55, 0.65, 0.75, 0.85], fmt: v => v.toFixed(2) },
      valueFmt: v => v.toFixed(3), tipTitle: x => 'Loop depth ' + x,
      series: names.map(n => ({ name: label[n], cls: cls[n], y: S.r2[n] })),
      refs: [{ y: S.r2Base, label: 'non-looped 0.668', at: 'left' }], vlines: [{ x: 4, label: 'trained' }]
    });
    const upd = C.lineChart($('#chSmaUpd'), {
      w: 460, h: 250, m: { l: 46, r: 12, t: 18, b: 34 }, group: 'sma',
      x: { min: 1, max: 8, ticks: [1, 2, 3, 4, 5, 6, 7, 8], values: S.x, label: 'Loop depth' },
      y: { min: 0.027, max: 0.0625, ticks: [0.03, 0.04, 0.05, 0.06], fmt: v => v.toFixed(2) },
      valueFmt: v => v.toFixed(4), tipTitle: x => 'Loop depth ' + x,
      series: names.map(n => ({ name: label[n], cls: cls[n], y: S.upd[n] })),
      vlines: [{ x: 4, label: 'trained' }]
    });
    const lg = $('#smaLegend');
    names.forEach(n => {
      const b = h('button', { type: 'button', class: 'li', 'aria-pressed': 'true' }, `<i class="ln ${cls[n]}"></i>${label[n]}`);
      b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        [r2, upd].forEach(api => $$(`.series[data-name="${label[n]}"]`, api.el).forEach(g => g.classList.toggle('off', !on)));
      });
      lg.appendChild(b);
    });
    lg.appendChild(h('span', { class: 'li' }, '<i class="ln dash"></i>Non-looped'));
  })();

  /* ---------- XSA gains ----------
     Left, the message: how much adding XSA gains for each model, Looped-DiT in orange. Right, the scores behind it:
     each model without and with XSA, so Looped-DiT's steeper line (it overtakes the compute-matched model) shows
     the same thing. Both are drawn 1:1 with their width and redrawn on resize. */
  (function xsa() {
    const box = $('#xsaRows');
    const models = D.xsa.map(r => ({
      name: r.ours ? 'Looped-DiT' : 'Non-looped',
      detail: r.ours ? 'looped ×4' : r.depth === 17 ? 'same parameters' : 'same compute',
      cls: r.ours ? 'm-ours' : r.depth === 17 ? 'm-par' : 'm-cmp',
      no: r.no, xsa: r.xsa, gain: Math.round((r.xsa - r.no) * 10) / 10, ours: !!r.ours
    }));
    const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + f1(Math.abs(v));
    box.classList.add('xsa-fig');
    const panel = (title) => {
      const p = h('div', { class: 'xsa-panel' });
      p.appendChild(h('div', { class: 'mtitle' }, title));
      const host = h('div', { class: 'xsa-host' });
      p.appendChild(host);
      box.appendChild(p);
      return host;
    };
    const gainHost = panel('Gain from adding XSA (points)');
    const slopeHost = panel('Average score without and with XSA');
    const H = 300;

    function drawGain() {
      const W = Math.round(gainHost.clientWidth) || 420;
      gainHost.textContent = '';
      const m = { t: 40, b: 52, l: 6, r: 6 };
      const lo = -0.35, hi = 1.75, y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b), y0 = y(0);
      const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'xsa-svg', role: 'img',
        'aria-label': 'Gain from adding XSA: ' + models.map(o => `${o.name}, ${o.detail}, ${sign(o.gain)} points`).join('; ') }, gainHost);
      [0.5, 1, 1.5].forEach(t => sv('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: 'xg-grid' }, svg));
      const slot = (W - m.l - m.r) / models.length, bw = Math.min(88, slot * 0.46);
      models.forEach((o, i) => {
        const cx = m.l + slot * (i + 0.5), top = y(Math.max(o.gain, 0)), bot = y(Math.min(o.gain, 0));
        sv('rect', { x: cx - bw / 2, y: top, width: bw, height: Math.max(2, bot - top), rx: 3, class: 'xb ' + o.cls,
          style: `transform-origin:${cx}px ${y0}px;--d:${i * 120}ms` }, svg);
        const vy = o.gain >= 0 ? top - 10 : bot + 20;
        svText(svg, cx, vy, sign(o.gain), 'xv ' + o.cls + (o.ours ? ' big' : ''), 'middle').setAttribute('style', `--d:${i * 120 + 350}ms`);
        svText(svg, cx, H - m.b + 24, o.name, 'xn' + (o.ours ? ' ours' : ''), 'middle');
        svText(svg, cx, H - m.b + 42, o.detail, 'xd', 'middle');
      });
      sv('line', { x1: m.l, x2: W - m.r, y1: y0, y2: y0, class: 'xg-zero' }, svg);
    }

    function drawSlope() {
      const W = Math.round(slopeHost.clientWidth) || 520;
      slopeHost.textContent = '';
      const narrow = W < 460;
      const m = { t: 22, b: 52, l: 46, r: narrow ? 150 : 236 };
      const lo = 54.6, hi = 59.6, y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
      const x0 = m.l, x1 = W - m.r;
      const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'xsa-svg', role: 'img',
        'aria-label': 'Average score without and with XSA: ' + models.map(o => `${o.name}, ${o.detail}, ${f1(o.no)} to ${f1(o.xsa)}`).join('; ') }, slopeHost);
      [x0, x1].forEach(x => sv('line', { x1: x, x2: x, y1: m.t - 8, y2: H - m.b + 6, class: 'xs-col' }, svg));
      svText(svg, x0, H - m.b + 26, 'Without XSA', 'xn', 'middle');
      svText(svg, x1, H - m.b + 26, 'With XSA', 'xn', 'middle');
      // end labels, nudged apart where scores are close
      const spread = (vals, gap) => {
        const idx = vals.map((v, i) => i).sort((a, b) => vals[a] - vals[b]), out = vals.slice();
        for (let k = 1; k < idx.length; k++) if (out[idx[k]] - out[idx[k - 1]] < gap) out[idx[k]] = out[idx[k - 1]] + gap;
        return out;
      };
      const ly0 = spread(models.map(o => y(o.no)), 19), ly1 = spread(models.map(o => y(o.xsa)), 19);
      // draw Looped-DiT last, on top
      models.map((o, i) => [o, i]).sort((a, b) => a[0].ours - b[0].ours).forEach(([o, i]) => {
        const g = sv('g', { class: 'xs-line ' + o.cls }, svg);
        sv('line', { x1: x0, y1: y(o.no), x2: x1, y2: y(o.xsa), pathLength: 1, style: `--d:${i * 120}ms` }, g);
        sv('circle', { cx: x0, cy: y(o.no), r: o.ours ? 5.5 : 4.5 }, g);
        sv('circle', { cx: x1, cy: y(o.xsa), r: o.ours ? 5.5 : 4.5 }, g);
        svText(g, x0 - 10, ly0[i] + 4.5, f1(o.no), 'xs-v', 'end');
        const t = svText(g, x1 + 10, ly1[i] + 4.5, f1(o.xsa), 'xs-v', 'start');
        const lab = sv('tspan', { class: 'xs-name', dx: 8 }, t);
        lab.textContent = narrow ? (o.ours ? 'Looped-DiT' : o.detail) : (o.ours ? 'Looped-DiT' : 'Non-looped, ' + o.detail);
      });
    }

    let wG = 0, wS = 0;
    const redraw = () => {
      const g = Math.round(gainHost.clientWidth), s = Math.round(slopeHost.clientWidth);
      if (Math.abs(g - wG) >= 4) { wG = g; drawGain(); }
      if (Math.abs(s - wS) >= 4) { wS = s; drawSlope(); }
    };
    redraw();
    if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(box);
    // bars rise and lines draw once, if the figure is still mostly below the fold when it comes near
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        if (es[0].boundingClientRect.top < window.innerHeight * 0.6) return;
        box.classList.add('armed');
        void box.offsetWidth;
        box.classList.remove('armed');
        box.classList.add('play');
      }, { rootMargin: '0px 0px 30% 0px' });
      io.observe(box);
    }
  })();

  /* ---------- loop by loop comparisons ---------- */
  (function compare() {
    const root = $('#cmpRows');
    const rows = G.compare || [];
    if (!rows.length) { root.closest('article').remove(); return; }
    // one example at a time, chosen with tabs, so the question's evidence stays compact
    const names = { gym: 'Spatial layout', stop: 'Text', tea: 'Counting' };
    const tabs = h('div', { class: 'seg cmp-tabs', role: 'tablist', 'aria-label': 'Example' });
    root.appendChild(tabs);
    const blocks = [];
    const show = k => blocks.forEach((b, i) => { b.hidden = i !== k; tabs.children[i].setAttribute('aria-selected', String(i === k)); });
    rows.forEach((r, ri) => {
      const tab = h('button', { type: 'button', role: 'tab' }, names[r.id] || r.theme);
      tab.addEventListener('click', () => show(ri));
      tabs.appendChild(tab);
      const block = h('div', { class: 'cmp' });
      blocks.push(block);
      const sc = h('div', { class: 'cmp-scroll' });
      const inner = h('div', { class: 'cmp' });
      const head = h('div', { class: 'cmp-head' });
      head.innerHTML = '<div class="grp-l">Looped-DiT</div><div class="grp-o">Non-looped</div><div class="grp-o">InternVL-U</div><div class="grp-o">Uni-CoT</div>';
      inner.appendChild(head);
      const sub = h('div', { class: 'cmp-head' });
      sub.innerHTML = '<div class="l">Loop ×1</div><div class="l">Loop ×2</div><div class="l">Loop ×3</div><div class="l">Loop ×4</div><div>same size</div><div>6.5× larger</div><div>25× larger, CoT</div>';
      inner.appendChild(sub);
      const row = h('div', { class: 'cmp-row' });
      r.images.forEach((im, i) => {
        const cell = h('div', { class: 'cmp-cell' + (i === 3 ? ' is-final' : '') });
        cell.appendChild(img(im.src, `${im.label}: ${r.prompt}`, { 'data-lb': 'cmp' + ri, 'data-lab': im.label, 'data-cap': r.prompt }));
        row.appendChild(cell);
      });
      inner.appendChild(row);
      sc.appendChild(inner);
      block.appendChild(sc);
      block.appendChild(h('p', { class: 'cmp-prompt' }, r.promptHtml || r.prompt));
      if (r.note) block.appendChild(h('p', { class: 'cap', style: 'text-align:center;max-width:80ch;margin-inline:auto' }, r.note));
      root.appendChild(block);
    });
    show(0);
  })();

  /* ---------- gallery ---------- */
  (function gallery() {
    const root = $('#galleryRoot');
    const GG = G.gallery;
    if (!GG || !GG.items || !GG.items.length) { root.remove(); return; }
    const cats = ['All', ...Array.from(new Set(GG.items.map(i => i.filter)))];
    const filt = h('div', { class: 'filters', role: 'group', 'aria-label': 'Filter samples' });
    let active = 'All';
    cats.forEach(c => {
      const n = c === 'All' ? GG.items.length : GG.items.filter(i => i.filter === c).length;
      const b = h('button', { type: 'button', 'aria-pressed': String(c === 'All') }, `${c}<span class="n">${n}</span>`);
      b.addEventListener('click', () => { active = c; expanded = false; $$('button', filt).forEach(o => o.setAttribute('aria-pressed', String(o === b))); render(); });
      filt.appendChild(b);
    });
    root.appendChild(filt);
    const grid = h('div', { class: 'gallery' });
    root.appendChild(grid);
    // The first eight examples show at once; the rest wait behind a button (reset when the filter changes).
    const FIRST = 8;
    let expanded = false;
    const more = h('button', { type: 'button', class: 'more-btn' });
    root.appendChild(more);
    more.addEventListener('click', () => {
      expanded = true;
      render();
      const next = grid.children[FIRST];  // keep keyboard focus at the first newly shown example
      if (next) { next.setAttribute('tabindex', '-1'); next.focus({ preventScroll: true }); }
    });
    // Scores read as a verdict: ✓/✗ where the benchmark gives one, else by how close the score is to full marks.
    const scoreOf = im => (im.score == null ? null : String(im.score).replace(/^align (\d+)$/, '$1/10'));
    function tone(im) {
      if (im.ok === true) return 'pass';
      if (im.ok === false) return 'fail';
      const s = scoreOf(im) || '';
      let m = s.match(/^(\d+)\/(\d+)$/), r = null;
      if (m) r = +m[1] / +m[2];
      else if ((m = s.match(/^(\d+(?:\.\d+)?)%$/))) r = +m[1] / 100;
      return r == null ? 'mid' : r >= 0.9 ? 'pass' : r <= 0.5 ? 'fail' : 'mid';
    }
    const verdict = im => [im.ok === true ? '✓' : im.ok === false ? '✗' : '', scoreOf(im)].filter(Boolean).join(' ');
    // A before-and-after card: loop ×1 and loop ×4 large, ×2 and ×3 small between them.
    function card(it, idx) {
      const c = h('article', { class: 'gcard' });
      const ims = it.images, first = ims[0], last = ims[ims.length - 1];
      c.appendChild(h('div', { class: 'meta' }, `<span class="bench">${it.bench}</span><span class="cat">${it.cat || ''}</span>`));
      const fig = (im, i, size) => {
        const f = h('figure', { class: 'gx-' + size + (i === ims.length - 1 ? ' final' : '') });
        f.appendChild(img(im.src, `${im.label}, ${it.prompt}`, { 'data-lb': 'g' + idx, 'data-lab': `${it.bench} · ${im.label}`, 'data-cap': it.prompt }));
        f.appendChild(h('span', { class: 'gx-n', 'aria-hidden': 'true' }, '×' + (i + 1)));
        const v = verdict(im);
        if (v) f.appendChild(h('span', { class: 'gx-v ' + tone(im) }, v));
        return f;
      };
      const gx = h('div', { class: 'gx' });
      gx.appendChild(fig(first, 0, 'big'));
      const mid = h('div', { class: 'gx-mid' });
      ims.slice(1, -1).forEach((im, k) => mid.appendChild(fig(im, k + 1, 'small')));
      gx.appendChild(mid);
      gx.appendChild(fig(last, ims.length - 1, 'big'));
      c.appendChild(gx);
      // the note says what changed; quoted text in it is the evidence, so it stands out
      if (it.note) c.appendChild(h('p', { class: 'gnote' }, it.note.replace(/“([^”]+)”/g, '“<b>$1</b>”')));
      const pr = h('p', { class: 'pr', id: 'gallery-prompt-' + idx });
      pr.textContent = '“' + it.prompt + '”';
      c.appendChild(foldPrompt(pr));
      return c;
    }
    function render() {
      grid.innerHTML = '';
      const list = GG.items.filter(i => active === 'All' || i.filter === active);
      const shown = expanded ? list : list.slice(0, FIRST);
      shown.forEach(it => grid.appendChild(card(it, GG.items.indexOf(it))));
      more.hidden = shown.length === list.length;
      more.textContent = `Show more examples (${list.length - shown.length})`;
      queuePromptPreviews();
    }
    render();
    if (GG.finals && GG.finals.length) {
      root.appendChild(h('div', { class: 'shead', style: 'margin-top:26px' }, `<h3 class="sub-h">${GG.finalsTitle || 'Final images at loop depth 4'}</h3>`));
      const fg = h('div', { class: 'fin-grid' });
      GG.finals.forEach((f, i) => {
        const fig = h('figure', { class: 'fin' });
        const d = h('div', { class: 'im' });
        d.appendChild(img(f.src, f.prompt, { 'data-lb': 'finals', 'data-lab': f.bench || '', 'data-cap': f.prompt }));
        fig.appendChild(d);
        fg.appendChild(fig);
      });
      root.appendChild(fg);
    }

  })();

  /* ---------- video: the hero button brings the player into view ---------- */
  (function video() {
    const btn = $('#videoBtn'), card = $('#videoCard');
    if (!btn || !card) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      history.replaceState(null, '', '#video');
    });
  })();

  /* ---------- lightbox ---------- */
  (function lightbox() {
    const lb = $('#lb'), im = $('#lbImg'), cap = $('#lbCap');
    let group = [], k = 0, last = null;
    function show(i) {
      k = (i + group.length) % group.length;
      const el = group[k];
      im.src = el.getAttribute('data-full') || el.currentSrc || el.src;
      im.alt = el.alt;
      const lab = el.getAttribute('data-lab');
      cap.textContent = '';
      if (lab) { const b = document.createElement('b'); b.className = 'lb-lab'; b.textContent = lab; cap.appendChild(b); }
      cap.appendChild(document.createTextNode(el.getAttribute('data-cap') || el.alt));
      $('.box', lb).scrollTop = 0;
      $('#lbPrev').hidden = $('#lbNext').hidden = group.length < 2;
    }
    function open(el) {
      const g = el.getAttribute('data-lb');
      group = $$(`img[data-lb="${g}"]`).filter(x => x.offsetParent !== null || x.closest('.stack'));
      if (!group.length) group = [el];
      last = document.activeElement;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      show(group.indexOf(el));
      $('#lbClose').focus();
    }
    function close() { lb.hidden = true; document.body.style.overflow = ''; im.src = ''; if (last) last.focus(); }
    document.addEventListener('click', e => {
      const el = e.target.closest && e.target.closest('img[data-lb]');
      if (el && !lb.contains(el)) { e.preventDefault(); open(el); }
    });
    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', () => show(k - 1));
    $('#lbNext').addEventListener('click', () => show(k + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) {
        const el = e.target.closest && e.target.closest('img[data-lb]');
        if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(el); }
        return;
      }
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(k - 1);
      if (e.key === 'ArrowRight') show(k + 1);
      if (e.key === 'Tab') {
        const f = $$('button:not([hidden]), [tabindex="0"]', lb);
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  })();

  /* ---------- results: each question's headline number counts up when it scrolls into view ---------- */
  (function questionStats() {
    const els = $$('.q-stat strong[data-to]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, d = el.dataset;
      countUp(el, +d.to, { pre: d.pre || '', post: d.post || '', from: d.post ? 1 : 0, dur: 1000, delay: 150 });
      el.classList.add('pop');
      io.unobserve(el);
    }), { threshold: 0.8 });
    els.forEach(el => io.observe(el));
  })();

  /* ---------- nav: Paper and Code appear once the hero's own buttons are out of view ---------- */
  (function navLinks() {
    const nav = $('.topnav'), heroLinks = $('.hero .links');
    if (!nav || !heroLinks || !('IntersectionObserver' in window)) { if (nav) nav.classList.add('past-hero'); return; }
    new IntersectionObserver(es => {
      const e = es[0];
      nav.classList.toggle('past-hero', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: '-58px 0px 0px 0px' }).observe(heroLinks);
  })();

  /* ---------- nav scroll-spy ---------- */
  (function spy() {
    const bar = $('.topnav .sec');
    const links = $$('.topnav .sec a');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const secs = Array.from(map.keys()).map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.remove('on'));
        const a = map.get(e.target.id);
        if (!a) return;
        a.classList.add('on');
        // keep the active link visible in the nav bar itself; this never scrolls the page
        if (bar.scrollWidth > bar.clientWidth) {
          const l = a.offsetLeft - bar.offsetLeft, r = l + a.offsetWidth;
          if (l < bar.scrollLeft || r > bar.scrollLeft + bar.clientWidth) bar.scrollLeft = l - (bar.clientWidth - a.offsetWidth) / 2;
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(sec => io.observe(sec));
  })();

  /* ---------- typeset math (KaTeX, vendored) ---------- */
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'],
      throwOnError: false
    });
  }

  /* ---------- copy BibTeX ---------- */
  (function bib() {
    const b = $('#copyBib'), pre = $('#bibtex');
    b.addEventListener('click', () => {
      const done = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1600); };
      const fallback = () => {
        const r = document.createRange(); r.selectNodeContents(pre);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent = 'Selected: press Ctrl+C'; setTimeout(() => { b.textContent = 'Copy'; }, 2400);
      };
      try { navigator.clipboard.writeText(pre.textContent).then(done, fallback); } catch (e) { fallback(); }
    });
  })();

  /* ---------- images: load top to bottom ahead of the reader ---------- */
  // Lazy images are fetched only as they near the screen, so a fast scroll outruns them. Once the page has
  // loaded, switch them to eager in page order, four at a time, so images further down are usually ready
  // before the reader reaches them. Skipped when the browser asks to save data.
  (function loadAhead() {
    const conn = navigator.connection;
    if (conn && conn.saveData) return;
    const start = () => {
      const queue = $$('img[loading="lazy"]').filter(im => im.getAttribute('src'));
      let i = 0, active = 0;
      const next = () => {
        while (active < 4 && i < queue.length) {
          const im = queue[i++];
          if (im.complete && im.naturalWidth) continue;
          active++;
          const done = () => { im.removeEventListener('load', done); im.removeEventListener('error', done); active--; next(); };
          im.addEventListener('load', done);
          im.addEventListener('error', done);
          im.loading = 'eager';
        }
      };
      next();
    };
    if (document.readyState === 'complete') setTimeout(start, 200);
    else window.addEventListener('load', () => setTimeout(start, 200));
  })();
})();
