/* Looped-DiT project page: a small SVG chart kit (no dependencies).
   Every colour comes from CSS classes (.s-ours, .s-naive, ...), so charts follow the light/dark theme. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function s(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function lin(d0, d1, r0, r1) {
    const f = v => r0 + (v - d0) / (d1 - d0) * (r1 - r0);
    f.inv = p => d0 + (p - r0) / (r1 - r0) * (d1 - d0);
    return f;
  }
  function logScale(d0, d1, r0, r1) {
    const l0 = Math.log10(d0), l1 = Math.log10(d1);
    const f = v => r0 + (Math.log10(v) - l0) / (l1 - l0) * (r1 - r0);
    f.inv = p => Math.pow(10, l0 + (p - r0) / (r1 - r0) * (l1 - l0));
    return f;
  }
  const fmt1 = v => (Math.round(v * 10) / 10).toFixed(1);

  function marker(kind, x, y, r, cls, parent) {
    if (kind === 'square') return s('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, rx: 0.8, class: cls }, parent);
    return s('circle', { cx: x, cy: y, r: r, class: cls }, parent);
  }

  /* Hover groups: charts that share a group name highlight the same x index together. */
  const groups = {};
  function joinGroup(name, api) {
    if (!name) return;
    (groups[name] = groups[name] || []).push(api);
  }
  function groupShow(name, i, src) {
    if (!name || !groups[name]) return src.show(i, true);
    groups[name].forEach(c => c.show(i, c === src));
  }
  function groupHide(name, src) {
    if (!name || !groups[name]) return src.hide();
    groups[name].forEach(c => c.hide());
  }

  /* ---------- line chart ----------
     o = { w, h, m:{t,r,b,l}, title, aria,
           x:{min,max,ticks,fmt,label,log}, y:{min,max,ticks,fmt,label},
           series:[{name, cls, x?, y:[...], marker:'circle'|'square', dash, pointLabels:[...], emph:index}],
           refs:[{y, label, cls}], vlines:[{x, label}], group, tipTitle:(xv)=>string, valueFmt } */
  // The chart is drawn at its on-screen width (1 unit = 1 px), so its text keeps the size set in the CSS.
  // o.w and o.h give the proportions; the height follows the width within a narrow range. Redrawn on resize.
  function lineChart(host, o) {
    host.classList.add('chart');
    const api = { el: host };
    const W0 = o.w || 360, H0 = o.h || 236;
    const size = () => {
      const cw = Math.round(host.clientWidth);
      if (!cw) return [W0, H0];
      return [cw, Math.round(H0 * Math.min(1.15, Math.max(0.9, cw / W0)))];
    };
    let cur = size();
    build(cur[0], cur[1]);
    joinGroup(o.group, api);
    if ('ResizeObserver' in window) new ResizeObserver(() => {
      const next = size();
      if (Math.abs(next[0] - cur[0]) < 4) return;
      cur = next;
      // keep series the reader switched off
      const off = Array.from(host.querySelectorAll('.series.off')).map(g => g.getAttribute('data-name'));
      build(cur[0], cur[1]);
      off.forEach(n => host.querySelectorAll('.series').forEach(g => { if (g.getAttribute('data-name') === n) g.classList.add('off'); }));
    }).observe(host);
    return api;

  function build(W, H) {
    host.textContent = '';
    const m = Object.assign({ t: 18, r: 14, b: 34, l: 42 }, o.m || {});
    const X = (o.x.log ? logScale : lin)(o.x.min, o.x.max, m.l, W - m.r);
    const Y = lin(o.y.min, o.y.max, H - m.b, m.t);
    const vf = o.valueFmt || fmt1;
    const vfA = o.valueFmt || fmt1;
    const autoAria = (o.x.label || 'x') + ' ' + (o.series[0].x || o.x.values).join(', ') + '. ' +
      o.series.map(sr => sr.name + ': ' + sr.y.map(v => v == null ? 'none' : vfA(v)).join(', ')).join('; ') +
      ((o.refs || []).length ? '; reference line at ' + o.refs.map(r => vfA(r.y)).join(', ') : '') + '.';
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart-svg', role: 'img', 'aria-label': o.aria || autoAria });
    host.appendChild(svg);

    // grid + y ticks
    const gGrid = s('g', { class: 'grid' }, svg);
    (o.y.ticks || []).forEach(t => {
      const y = Y(t);
      s('line', { x1: m.l, x2: W - m.r, y1: y, y2: y }, gGrid);
      const tx = s('text', { x: m.l - 7, y: y + 3.6, class: 'tick', 'text-anchor': 'end' }, svg);
      tx.textContent = (o.y.fmt || (v => v))(t);
    });
    // x axis
    s('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: 'axis' }, svg);
    (o.x.ticks || []).forEach(t => {
      const x = X(t);
      s('line', { x1: x, x2: x, y1: H - m.b, y2: H - m.b + 4, class: 'axis' }, svg);
      const tx = s('text', { x: x, y: H - m.b + 16, class: 'tick', 'text-anchor': 'middle' }, svg);
      tx.textContent = (o.x.fmt || (v => v))(t);
    });
    if (o.x.label) {
      const tx = s('text', { x: (m.l + W - m.r) / 2, y: H - 3, class: 'axis-label', 'text-anchor': 'middle' }, svg);
      tx.textContent = o.x.label;
    }
    if (o.y.label) {
      const tx = s('text', { x: 11, y: (m.t + H - m.b) / 2, class: 'axis-label', 'text-anchor': 'middle', transform: `rotate(-90 11 ${(m.t + H - m.b) / 2})` }, svg);
      tx.textContent = o.y.label;
    }
    // vertical markers (e.g. "trained ×4")
    (o.vlines || []).forEach(v => {
      const x = X(v.x);
      s('line', { x1: x, x2: x, y1: m.t - 4, y2: H - m.b, class: 'vline' }, svg);
      if (v.label) {
        const tx = s('text', { x: x + 4, y: m.t + 4, class: 'vline-label' }, svg);
        tx.textContent = v.label;
      }
    });
    // reference lines (e.g. non-looped baseline)
    (o.refs || []).forEach(r => {
      const y = Y(r.y);
      s('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, class: 'ref ' + (r.cls || '') }, svg);
      if (r.label) {
        const left = r.at === 'left';
        const tx = s('text', { x: left ? m.l + 4 : W - m.r, y: y + (left ? 13 : -5), class: 'ref-label ' + (r.cls || ''), 'text-anchor': left ? 'start' : 'end' }, svg);
        tx.textContent = r.label;
      }
    });

    // series
    const drawn = [];
    const xsAll = o.series[0].x || o.x.values;
    o.series.forEach((sr, si) => {
      const xs = sr.x || o.x.values;
      const g = s('g', { class: 'series ' + sr.cls, 'data-name': sr.name }, svg);
      const pts = sr.y.map((v, i) => v == null ? null : [X(xs[i]), Y(v)]);
      const d = pts.filter(Boolean).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' ');
      const path = s('path', { d: d, class: 'line' + (sr.dash ? ' dash' : '') }, g);
      const marks = [];
      pts.forEach((p, i) => {
        if (!p) return;
        const big = sr.emph === i;
        const mk = marker(sr.marker || 'circle', p[0], p[1], big ? 4.6 : 3.1, 'mk' + (big ? ' emph' : ''), g);
        marks.push(mk);
      });
      (sr.pointLabels || []).forEach((lab, i) => {
        if (lab == null || !pts[i]) return;
        // a label is a string (centred above, or below with labelBelow) or {t, dx, dy, anchor}
        const L = typeof lab === 'object' ? lab : { t: lab };
        const dy = L.dy != null ? L.dy : (sr.labelBelow ? 15 : -9);
        const tx = s('text', { x: pts[i][0] + (L.dx || 0), y: pts[i][1] + dy, class: 'pt-label', 'text-anchor': L.anchor || 'middle' }, g);
        tx.textContent = L.t;
      });
      drawn.push({ sr, path, marks, pts, g });
    });

    // annotations
    (o.notes || []).forEach(n => {
      const tx = s('text', { x: X(n.x) + (n.dx || 0), y: Y(n.y) + (n.dy || 0), class: 'note ' + (n.cls || ''), 'text-anchor': n.anchor || 'start' }, svg);
      tx.textContent = n.text;
    });

    // hover layer
    const guide = s('line', { x1: 0, x2: 0, y1: m.t - 4, y2: H - m.b, class: 'guide' }, svg);
    guide.style.opacity = 0;
    const hot = s('g', { class: 'hot' }, svg);
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.hidden = true;
    host.appendChild(tip);
    const overlay = s('rect', { x: m.l - 6, y: m.t - 6, width: W - m.l - m.r + 12, height: H - m.t - m.b + 12, class: 'overlay' }, svg);

    Object.assign(api, {
      show(i, withTip) {
        // i is an index into the shared x values, or {px} in 'nearest' mode (series with different x)
        const nearest = o.hover === 'nearest';
        const px = nearest ? i.px : X(xsAll[i]);
        hot.textContent = '';
        const rows = [];
        let gx = px, title = null;
        drawn.forEach((dw, k) => {
          let j = i;
          if (nearest) {
            let bd = Infinity;
            dw.pts.forEach((p, q) => { if (p && Math.abs(p[0] - px) < bd) { bd = Math.abs(p[0] - px); j = q; } });
            if (bd > 26) return;
            if (title == null) { gx = dw.pts[j][0]; title = o.tipTitle ? o.tipTitle((dw.sr.x || o.x.values)[j], j) : ''; }
          }
          if (dw.g.classList.contains('off')) return;
          const p = dw.pts[j];
          if (!p) return;
          s('circle', { cx: p[0], cy: p[1], r: 4.4, class: 'hot-dot ' + dw.sr.cls }, hot);
          rows.push(`<span class="tip-row"><i class="sw ${dw.sr.cls}"></i>${dw.sr.name}${nearest && o.xFmt ? ' · ' + o.xFmt((dw.sr.x || o.x.values)[j]) : ''}<b>${vf(dw.sr.y[j])}</b></span>`);
        });
        if (!rows.length) { api.hide(); return; }
        const x = gx;
        guide.setAttribute('x1', x); guide.setAttribute('x2', x); guide.style.opacity = 1;
        if (withTip) {
          const ttl = nearest ? (title || '') : (o.tipTitle ? o.tipTitle(xsAll[i], i) : (o.x.label || 'x') + ' ' + xsAll[i]);
          tip.innerHTML = (ttl ? `<span class="tip-h">${ttl}</span>` : '') + rows.join('');
          tip.hidden = false;
          const bw = host.clientWidth, sx = bw / W;
          const left = x * sx;
          tip.style.left = Math.min(Math.max(left, 70), bw - 70) + 'px';
          tip.style.top = (m.t * sx) + 'px';
        } else tip.hidden = true;
      },
      hide() { guide.style.opacity = 0; hot.textContent = ''; tip.hidden = true; },
      play() {
        if (reduceMotion) return;
        drawn.forEach((dw, k) => {
          const len = dw.path.getTotalLength();
          dw.path.style.transition = 'none';
          dw.path.style.strokeDasharray = len + ' ' + len;
          dw.path.style.strokeDashoffset = len;
          dw.marks.forEach(mk => { mk.style.transition = 'none'; mk.style.opacity = 0; });
          dw.path.getBoundingClientRect();
          const dur = 1100, delay = k * 140;
          dw.path.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.3,.7,.2,1) ${delay}ms`;
          dw.path.style.strokeDashoffset = 0;
          dw.marks.forEach((mk, j) => {
            mk.style.transition = `opacity 260ms ease ${delay + (j / Math.max(1, dw.marks.length - 1)) * dur * 0.85}ms`;
            mk.style.opacity = 1;
          });
          setTimeout(() => { dw.path.style.strokeDasharray = ''; dw.path.style.strokeDashoffset = ''; }, dur + delay + 60);
        });
      }
    });
    function idxAt(evt) {
      const r = svg.getBoundingClientRect();
      const px = (evt.clientX - r.left) / r.width * W;
      if (o.hover === 'nearest') return { px };
      let best = 0, bd = Infinity;
      xsAll.forEach((xv, i) => { const d = Math.abs(X(xv) - px); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    overlay.addEventListener('pointermove', e => groupShow(o.group, idxAt(e), api));
    overlay.addEventListener('pointerdown', e => groupShow(o.group, idxAt(e), api));
    overlay.addEventListener('pointerleave', () => groupHide(o.group, api));
  }
  }

  /* ---------- bubble chart (score vs. cost, log x) ----------
     o = { w, h, m, fields:{key:{label, min, max, ticks, fmt}}, field, y:{min,max,ticks},
           points:[{name, vals:{key:v}, y, r, cls, label, lab:{key:[dx,dy,anchor]}}], path:[names] } */
  function bubbleChart(host, o) {
    const W = o.w || 560, H = o.h || 360;
    const m = Object.assign({ t: 18, r: 18, b: 44, l: 46 }, o.m || {});
    host.classList.add('chart');
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart-svg bubble', role: 'img', 'aria-label': o.aria || '' });
    host.appendChild(svg);
    const Y = lin(o.y.min, o.y.max, H - m.b, m.t);
    const gGrid = s('g', { class: 'grid' }, svg);
    o.y.ticks.forEach(t => {
      s('line', { x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t) }, gGrid);
      const tx = s('text', { x: m.l - 8, y: Y(t) + 3.6, class: 'tick', 'text-anchor': 'end' }, svg);
      tx.textContent = t;
    });
    s('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: 'axis' }, svg);
    const yl = s('text', { x: 12, y: (m.t + H - m.b) / 2, class: 'axis-label', 'text-anchor': 'middle', transform: `rotate(-90 12 ${(m.t + H - m.b) / 2})` }, svg);
    yl.textContent = o.y.label || '';
    const gX = s('g', { class: 'xaxis' }, svg);
    const xl = s('text', { x: (m.l + W - m.r) / 2, y: H - 6, class: 'axis-label', 'text-anchor': 'middle' }, svg);
    const gPath = s('path', { class: 'pareto-path' }, svg);
    const gPts = s('g', {}, svg);
    const nodes = o.points.map(p => {
      const g = s('g', { class: 'pt ' + (p.cls || ''), style: p.color ? `--bubble-color:${p.color}` : null, tabindex: 0, role: 'img', 'aria-label': p.aria || p.name }, gPts);
      s('circle', { cx: 0, cy: 0, r: p.r, class: 'bub' }, g);
      const t = s('text', { x: 0, y: 0, class: 'bub-label' + (p.labelCls ? ' ' + p.labelCls : '') }, g);
      (p.label || p.name).split('\n').forEach((line, i) => {
        const ts = s('tspan', { x: 0, dy: i ? '1.15em' : 0 }, t);
        ts.textContent = line;
      });
      return { p, g, t };
    });
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.hidden = true;
    host.appendChild(tip);

    let X;
    function render(field, animate) {
      const f = o.fields[field];
      X = logScale(f.min, f.max, m.l, W - m.r);
      gX.textContent = '';
      f.ticks.forEach(t => {
        s('line', { x1: X(t), x2: X(t), y1: H - m.b, y2: H - m.b + 4, class: 'axis' }, gX);
        const tx = s('text', { x: X(t), y: H - m.b + 16, class: 'tick', 'text-anchor': 'middle' }, gX);
        tx.textContent = f.fmt ? f.fmt(t) : t;
      });
      xl.textContent = f.label;
      nodes.forEach(n => {
        const x = X(n.p.vals[field]), y = Y(n.p.y);
        n.g.style.transition = animate && !reduceMotion ? 'transform 700ms cubic-bezier(.3,.7,.2,1)' : 'none';
        n.g.style.transform = `translate(${x}px, ${y}px)`;
        const lab = (n.p.lab && (n.p.lab[field] || n.p.lab.all)) || [n.p.r + 5, 4, 'start'];
        n.t.setAttribute('x', lab[0]); n.t.setAttribute('y', lab[1]); n.t.setAttribute('text-anchor', lab[2] || 'start');
        n.t.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', lab[0]));
      });
      if (o.path) {
        const pts = o.path.map(nm => o.points.find(p => p.name === nm));
        const d = pts.map((p, i) => (i ? 'L' : 'M') + X(p.vals[field]).toFixed(1) + ' ' + Y(p.y).toFixed(1)).join(' ');
        if (animate && !reduceMotion) {
          gPath.style.transition = 'opacity 200ms';
          gPath.style.opacity = 0;
          setTimeout(() => { gPath.setAttribute('d', d); gPath.style.transition = 'opacity 400ms 300ms'; gPath.style.opacity = 1; }, 220);
        } else gPath.setAttribute('d', d);
      }
      api.field = field;
    }
    function showTip(n) {
      const f = o.fields[api.field];
      tip.innerHTML = `<span class="tip-h">${n.p.name}</span>` + (o.tipRows ? o.tipRows(n.p) : '');
      tip.hidden = false;
      const bw = host.clientWidth, sx = bw / W;
      tip.style.left = Math.min(Math.max(X(n.p.vals[api.field]) * sx, 90), bw - 90) + 'px';
      tip.style.top = Math.max(0, (Y(n.p.y) - n.p.r - 8) * sx - 8) + 'px';
      tip.classList.add('above');
    }
    nodes.forEach(n => {
      n.g.addEventListener('pointerenter', () => { n.g.classList.add('on'); showTip(n); });
      n.g.addEventListener('pointerleave', () => { n.g.classList.remove('on'); tip.hidden = true; });
      n.g.addEventListener('focus', () => { n.g.classList.add('on'); showTip(n); });
      n.g.addEventListener('blur', () => { n.g.classList.remove('on'); tip.hidden = true; });
    });
    const api = { set: (f, animate = true) => render(f, animate), field: o.field };
    render(o.field, false);
    return api;
  }

  /* Play a chart's draw-in once when it approaches the viewport. The chart is complete before that. */
  function playOnApproach(api) {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          const r = e.boundingClientRect;
          // only animate if it is still mostly below the fold, so a reader never sees the reset
          if (r.top > window.innerHeight * 0.6) api.play();
          io.disconnect();
        }
      });
    }, { rootMargin: '0px 0px 30% 0px' });
    io.observe(api.el);
  }

  window.LDCharts = { lineChart, bubbleChart, playOnApproach, fmt1 };
})();
