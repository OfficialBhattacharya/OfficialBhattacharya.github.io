/* Interactive figures for the lecture series. Each <div class="widget" data-widget="name"> is built here. */
(function () {
  'use strict';
  // ---------- helpers ----------
  const C = { ink: '#1d2733', soft: '#8a96a3', grid: '#ece8df', a: '#0f8a5f', b: '#2563eb', c: '#c2410c', d: '#7c3aed', fill: 'rgba(15,138,95,0.18)' };
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; }; }
  function gauss(r) { let u = 0, v = 0; while (!u) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function N(x) { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; }
  const npdf = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  function bs(S, K, T, r, s, type) {
    if (T <= 0) return Math.max(type === 'put' ? K - S : S - K, 0);
    const d1 = (Math.log(S / K) + (r + s * s / 2) * T) / (s * Math.sqrt(T)), d2 = d1 - s * Math.sqrt(T);
    return type === 'put' ? K * Math.exp(-r * T) * N(-d2) - S * N(-d1) : S * N(d1) - K * Math.exp(-r * T) * N(d2);
  }
  function greeks(S, K, T, r, s) {
    const d1 = (Math.log(S / K) + (r + s * s / 2) * T) / (s * Math.sqrt(T)), d2 = d1 - s * Math.sqrt(T);
    return { d1, d2, delta: N(d1), gamma: npdf(d1) / (S * s * Math.sqrt(T)), vega: S * npdf(d1) * Math.sqrt(T) / 100,
      theta: (-S * npdf(d1) * s / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * N(d2)) / 365 };
  }
  function el(tag, attrs, html) { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html != null) e.innerHTML = html; return e; }
  function canvas(w, root, W = 720, H = 320) {
    const cv = el('canvas'); const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; cv.style.aspectRatio = `${W} / ${H}`;
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); root.appendChild(cv); return { cv, ctx, W, H };
  }
  function frame(g, box, opts = {}) {
    const { ctx, W, H } = g; const L = opts.L ?? 52, R = 14, T = 14, B = 30;
    const X = (x) => L + (x - box.x0) / (box.x1 - box.x0) * (W - L - R);
    const Y = (y) => T + (1 - (y - box.y0) / (box.y1 - box.y0)) * (H - T - B);
    ctx.clearRect(0, 0, W, H); ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.strokeStyle = C.grid; ctx.fillStyle = C.soft; ctx.lineWidth = 1;
    const ticks = (a, b, n) => { const st = niceStep((b - a) / n); const out = []; for (let v = Math.ceil(a / st) * st; v <= b + 1e-9; v += st) out.push(+v.toFixed(10)); return out; };
    ticks(box.y0, box.y1, 5).forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(fmt(v), L - 6, Y(v) + 4); });
    ticks(box.x0, box.x1, 7).forEach((v) => { ctx.textAlign = 'center'; ctx.fillText(fmt(v), X(v), H - B + 16); });
    if (opts.xl) { ctx.textAlign = 'right'; ctx.fillText(opts.xl, W - R, H - 4); }
    if (opts.yl) { ctx.textAlign = 'left'; ctx.fillText(opts.yl, L + 4, T + 10); }
    return { X, Y, L, R, T, B };
  }
  function niceStep(x) { const p = Math.pow(10, Math.floor(Math.log10(x))); const m = x / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
  function fmt(v) { const a = Math.abs(v); return a >= 1000 ? v.toFixed(0) : a >= 10 ? v.toFixed(0) : a >= 1 ? +v.toFixed(1) + '' : +v.toFixed(2) + ''; }
  function line(ctx, pts, color, w = 2, dash) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); }
  function legend(ctx, items, x, y) { ctx.font = '12px Inter, system-ui, sans-serif'; items.forEach(([c, t], i) => { ctx.fillStyle = c; ctx.fillRect(x, y + i * 18 - 8, 14, 4); ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText(t, x + 20, y + i * 18 - 3); }); }
  function controls(root, defs, onChange) {
    const bar = el('div', { className: 'w-ctrl' }); const vals = {};
    defs.forEach((d) => {
      if (d.type === 'button') { const b = el('button', { type: 'button' }, d.label); b.onclick = () => d.onClick(vals); bar.appendChild(b); return; }
      if (d.type === 'select') { const lab = el('label', {}, d.label + ' '); const s = el('select'); d.options.forEach(([v, t]) => s.appendChild(el('option', { value: v }, t))); s.value = d.value; vals[d.key] = d.value; s.oninput = () => { vals[d.key] = s.value; onChange(vals); }; lab.appendChild(s); bar.appendChild(lab); return; }
      const lab = el('label', {}, d.label + ' '); const inp = el('input', { type: 'range', min: d.min, max: d.max, step: d.step, value: d.value }); const out = el('span', { className: 'val' });
      const set = () => { vals[d.key] = +inp.value; out.textContent = d.show ? d.show(+inp.value) : inp.value; };
      inp.oninput = () => { set(); onChange(vals); }; set(); lab.append(inp, out); bar.appendChild(lab);
    });
    root.appendChild(bar); return vals;
  }
  function output(root) { const o = el('div', { className: 'w-out' }); root.appendChild(o); return o; }

  const W = {};

  // ---------- Black-Scholes series ----------
  W.binomial = (root) => {
    const g = canvas(0, root);
    const v = controls(root, [{ key: 'n', label: 'coin flips n', min: 1, max: 200, step: 1, value: 10 }, { key: 'p', label: 'P(heads)', min: 0.1, max: 0.9, step: 0.05, value: 0.5 }], draw);
    function draw() {
      const { n, p } = v; const mu = n * p, sd = Math.sqrt(n * p * (1 - p));
      const pmf = []; let lp = n * Math.log(1 - p); for (let k = 0; k <= n; k++) { pmf.push(Math.exp(lp)); lp += Math.log((n - k) / (k + 1)) + Math.log(p / (1 - p)); }
      const ymax = Math.max(...pmf) * 1.15; const f = frame(g, { x0: -0.5, x1: n + 0.5, y0: 0, y1: ymax }, { xl: 'number of heads', yl: 'probability' });
      const bw = Math.max(1, (f.X(1) - f.X(0)) * 0.8);
      pmf.forEach((q, k) => { g.ctx.fillStyle = C.fill; g.ctx.fillRect(f.X(k) - bw / 2, f.Y(q), bw, f.Y(0) - f.Y(q)); });
      const pts = []; for (let x = 0; x <= n; x += n / 300) pts.push([f.X(x), f.Y(npdf((x - mu) / sd) / sd)]);
      line(g.ctx, pts, C.c, 2.5); legend(g.ctx, [[C.a, 'Binomial(n, p)'], [C.c, `Normal(np, np(1-p))`]], g.W - 210, 30);
    }
    draw();
  };
  W.lognormal = (root) => {
    const g = canvas(0, root); const o = output(root);
    const v = controls(root, [{ key: 'mu', label: 'drift μ', min: -0.2, max: 0.3, step: 0.01, value: 0.08 }, { key: 's', label: 'volatility σ', min: 0.05, max: 0.8, step: 0.01, value: 0.3 }, { key: 'T', label: 'years T', min: 0.25, max: 5, step: 0.25, value: 1 }], draw);
    function draw() {
      const { mu, s, T } = v; const r = rng(7); const S0 = 100, n = 20000, xs = [];
      for (let i = 0; i < n; i++) xs.push(S0 * Math.exp((mu - s * s / 2) * T + s * Math.sqrt(T) * gauss(r)));
      const xmax = S0 * Math.exp(mu * T + 3 * s * Math.sqrt(T)); const bins = 60, h = new Array(bins).fill(0);
      xs.forEach((x) => { const b = Math.floor(x / xmax * bins); if (b >= 0 && b < bins) h[b]++; });
      const dens = h.map((c) => c / n / (xmax / bins)); const ymax = Math.max(...dens) * 1.15;
      const f = frame(g, { x0: 0, x1: xmax, y0: 0, y1: ymax }, { xl: 'price S_T (S₀ = 100)', yl: 'density' });
      dens.forEach((d, i) => { g.ctx.fillStyle = C.fill; g.ctx.fillRect(f.X(i * xmax / bins), f.Y(d), f.X(xmax / bins) - f.X(0) - 1, f.Y(0) - f.Y(d)); });
      const pts = []; for (let x = 0.5; x <= xmax; x += xmax / 300) { const z = (Math.log(x / S0) - (mu - s * s / 2) * T) / (s * Math.sqrt(T)); pts.push([f.X(x), f.Y(npdf(z) / (x * s * Math.sqrt(T)))]); }
      line(g.ctx, pts, C.c, 2.5);
      const mean = xs.reduce((a, b) => a + b, 0) / n, med = [...xs].sort((a, b) => a - b)[n >> 1];
      [[mean, C.b, 'mean'], [med, C.d, 'median']].forEach(([x, c]) => line(g.ctx, [[f.X(x), f.Y(0)], [f.X(x), f.Y(ymax * 0.95)]], c, 2, [5, 4]));
      legend(g.ctx, [[C.c, 'lognormal density'], [C.b, 'sample mean'], [C.d, 'sample median']], g.W - 190, 30);
      o.textContent = `simulated mean ${mean.toFixed(2)}   theory S₀e^{μT} = ${(S0 * Math.exp(mu * T)).toFixed(2)}   median ${med.toFixed(2)}   theory S₀e^{(μ-σ²/2)T} = ${(S0 * Math.exp((mu - s * s / 2) * T)).toFixed(2)}`;
    }
    draw();
  };
  W.payoff = (root) => {
    const g = canvas(0, root); const o = output(root);
    const v = controls(root, [{ key: 'K', label: 'strike K', min: 60, max: 140, step: 1, value: 100 }, { key: 'prem', label: 'premium', min: 0, max: 20, step: 0.5, value: 8 },
      { key: 'kind', label: 'position', type: 'select', value: 'call', options: [['call', 'long call'], ['put', 'long put'], ['fwd', 'long forward'], ['straddle', 'straddle'], ['parity', 'call − put']] }], draw);
    function draw() {
      const { K, prem, kind } = v; const pay = (S) => kind === 'call' ? Math.max(S - K, 0) : kind === 'put' ? Math.max(K - S, 0) : kind === 'fwd' ? S - K : kind === 'straddle' ? Math.abs(S - K) : Math.max(S - K, 0) - Math.max(K - S, 0);
      const cost = kind === 'fwd' || kind === 'parity' ? 0 : kind === 'straddle' ? 2 * prem : prem;
      const f = frame(g, { x0: 40, x1: 160, y0: -60, y1: 60 }, { xl: 'price at expiry S_T', yl: 'payoff / profit' });
      line(g.ctx, [[f.X(40), f.Y(0)], [f.X(160), f.Y(0)]], C.soft, 1);
      const P = [], Q = []; for (let S = 40; S <= 160; S += 0.5) { P.push([f.X(S), f.Y(Math.max(-60, Math.min(60, pay(S))))]); Q.push([f.X(S), f.Y(Math.max(-60, Math.min(60, pay(S) - cost)))]); }
      line(g.ctx, P, C.a, 3); line(g.ctx, Q, C.c, 2, [6, 4]);
      legend(g.ctx, [[C.a, 'payoff'], [C.c, 'profit after premium']], 70, 30);
      o.textContent = kind === 'parity' ? 'Call − put = S_T − K at expiry: exactly a forward. Hence C − P = S₀ − K e^{−rT} today (put–call parity).' : `break-even: ${kind === 'put' ? K - cost : kind === 'straddle' ? `${K - cost} and ${K + cost}` : K + cost}`;
    }
    draw();
  };
  W.taylor = (root) => {
    const g = canvas(0, root); const o = output(root);
    const fns = { exp: [(x) => Math.exp(x), (k) => 1 / fact(k), 'eˣ', -3, 3, -1, 8], log: [(x) => Math.log(1 + x), (k) => k === 0 ? 0 : (k % 2 ? 1 : -1) / k, 'ln(1+x)', -0.95, 2, -3, 1.5], sin: [(x) => Math.sin(x), (k) => k % 2 ? ((k - 1) / 2 % 2 ? -1 : 1) / fact(k) : 0, 'sin x', -6, 6, -2, 2] };
    function fact(k) { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; }
    const v = controls(root, [{ key: 'fn', label: 'function', type: 'select', value: 'log', options: [['log', 'ln(1+x)'], ['exp', 'eˣ'], ['sin', 'sin x']] }, { key: 'n', label: 'order', min: 0, max: 12, step: 1, value: 2 }, { key: 'x', label: 'evaluate at x', min: -0.9, max: 2, step: 0.05, value: 0.2 }], draw);
    function draw() {
      const [F, c, name, x0, x1, y0, y1] = fns[v.fn]; const T = (x) => { let s = 0; for (let k = 0; k <= v.n; k++) s += c(k) * Math.pow(x, k); return s; };
      const f = frame(g, { x0, x1, y0, y1 }, { xl: 'x', yl: name });
      const A = [], B = []; for (let x = x0; x <= x1; x += (x1 - x0) / 400) { A.push([f.X(x), f.Y(F(x))]); const t = T(x); if (t > y0 - 5 && t < y1 + 5) B.push([f.X(x), f.Y(Math.max(y0 - 1, Math.min(y1 + 1, t)))]); }
      line(g.ctx, A, C.a, 3); line(g.ctx, B, C.c, 2, [6, 4]); legend(g.ctx, [[C.a, name], [C.c, `Taylor polynomial, order ${v.n}`]], 70, 30);
      const x = Math.max(x0, Math.min(x1, v.x)); o.textContent = `at x = ${x}:  f(x) = ${F(x).toFixed(6)}   T_${v.n}(x) = ${T(x).toFixed(6)}   error = ${(F(x) - T(x)).toExponential(2)}`;
    }
    draw();
  };
  W.euler = (root) => {
    const g = canvas(0, root); const o = output(root);
    const v = controls(root, [{ key: 'r', label: 'rate r', min: -1, max: 1, step: 0.05, value: 0.5 }, { key: 'n', label: 'Euler steps', min: 2, max: 60, step: 1, value: 6 }], draw);
    function draw() {
      const { r, n } = v; const T = 3, B0 = 1; const ex = (t) => B0 * Math.exp(r * t); const ymax = Math.max(ex(T), B0) * 1.15;
      const f = frame(g, { x0: 0, x1: T, y0: 0, y1: ymax }, { xl: 'time t', yl: 'B(t)' });
      const A = []; for (let t = 0; t <= T; t += T / 300) A.push([f.X(t), f.Y(ex(t))]); line(g.ctx, A, C.a, 3);
      const h = T / n; let b = B0; const E = [[f.X(0), f.Y(b)]]; for (let i = 1; i <= n; i++) { b += r * b * h; E.push([f.X(i * h), f.Y(b)]); }
      line(g.ctx, E, C.c, 2); E.forEach(([x, y]) => { g.ctx.fillStyle = C.c; g.ctx.beginPath(); g.ctx.arc(x, y, 3, 0, 7); g.ctx.fill(); });
      legend(g.ctx, [[C.a, 'exact  B₀e^{rt}'], [C.c, 'Euler: B += r·B·Δt']], 70, 30);
      o.textContent = `B(3) exact ${ex(T).toFixed(4)}   Euler ${b.toFixed(4)}   (1 + r·Δt)^n → e^{rT} as n → ∞`;
    }
    draw();
  };
  W.randomwalk = (root) => {
    const g = canvas(0, root); const o = output(root); let seed = 3;
    const v = controls(root, [{ key: 'n', label: 'steps n', min: 4, max: 2000, step: 1, value: 20 }, { key: 'paths', label: 'paths', min: 1, max: 30, step: 1, value: 8 }, { type: 'button', label: 'new paths', onClick: () => { seed++; draw(); } }], draw);
    function draw() {
      const { n, paths } = v; const f = frame(g, { x0: 0, x1: 1, y0: -3, y1: 3 }, { xl: 'time t', yl: 'W(t) ≈ (1/√n)·Σ ±1' });
      const r = rng(seed); let qv = 0;
      for (let p = 0; p < paths; p++) { let w = 0; const P = [[f.X(0), f.Y(0)]]; for (let i = 1; i <= n; i++) { const st = (r() < 0.5 ? -1 : 1) / Math.sqrt(n); w += st; if (p === 0) qv += st * st; P.push([f.X(i / n), f.Y(w)]); } line(g.ctx, P, `hsl(${150 + p * 23},55%,${38 + (p % 3) * 8}%)`, p ? 1.2 : 2.2); }
      [1, 2].forEach((k) => { const U = [], D = []; for (let t = 0; t <= 1; t += 0.01) { U.push([f.X(t), f.Y(k * Math.sqrt(t))]); D.push([f.X(t), f.Y(-k * Math.sqrt(t))]); } line(g.ctx, U, C.soft, 1, [4, 4]); line(g.ctx, D, C.soft, 1, [4, 4]); });
      o.textContent = `Each step is ±1/√n. Variance at t is t, so ±√t and ±2√t bands hold about 68% and 95% of paths.  Σ(ΔW)² for the first path = ${qv.toFixed(3)} (always 1 here: the quadratic variation)`;
    }
    draw();
  };
  W.gbm = (root) => {
    const g = canvas(0, root); const o = output(root); let seed = 11;
    const v = controls(root, [{ key: 'mu', label: 'drift μ', min: -0.3, max: 0.4, step: 0.01, value: 0.1 }, { key: 's', label: 'vol σ', min: 0.02, max: 0.9, step: 0.01, value: 0.25 }, { key: 'paths', label: 'paths', min: 1, max: 60, step: 1, value: 25 }, { type: 'button', label: 'resample', onClick: () => { seed++; draw(); } }], draw);
    function draw() {
      const { mu, s, paths } = v; const S0 = 100, T = 2, n = 250; const dt = T / n; const r = rng(seed);
      const all = []; for (let p = 0; p < paths; p++) { let S = S0; const P = [S]; for (let i = 0; i < n; i++) { S += mu * S * dt + s * S * Math.sqrt(dt) * gauss(r); S = Math.max(S, 0.01); P.push(S); } all.push(P); }
      const ymax = Math.max(S0 * 1.5, ...all.map((p) => Math.max(...p))) * 1.05;
      const f = frame(g, { x0: 0, x1: T, y0: 0, y1: ymax }, { xl: 'years', yl: 'S(t)' });
      all.forEach((P, k) => line(g.ctx, P.map((y, i) => [f.X(i * dt), f.Y(y)]), `hsla(${200 + k * 7},60%,45%,0.55)`, 1.2));
      const M = []; for (let t = 0; t <= T; t += 0.02) M.push([f.X(t), f.Y(S0 * Math.exp(mu * t))]); line(g.ctx, M, C.c, 3);
      const fin = all.map((p) => p[n]); const avg = fin.reduce((a, b) => a + b, 0) / fin.length;
      legend(g.ctx, [[C.c, 'E[S(t)] = S₀e^{μt}']], 70, 30);
      o.textContent = `Euler–Maruyama: S += μS·Δt + σS·√Δt·Z.  Average of ${paths} paths at T: ${avg.toFixed(2)} vs theory ${(S0 * Math.exp(mu * T)).toFixed(2)}`;
    }
    draw();
  };
  W.ito = (root) => {
    const g = canvas(0, root); const o = output(root); let seed = 5;
    const v = controls(root, [{ key: 'n', label: 'partition size n', min: 10, max: 5000, step: 10, value: 200 }, { type: 'button', label: 'new path', onClick: () => { seed++; draw(); } }], draw);
    function draw() {
      const { n } = v; const r = rng(seed); const dt = 1 / n; let w = 0, qv = 0, tv = 0, sum1 = 0; const QV = [[0, 0]], WW = [[0, 0]];
      for (let i = 1; i <= n; i++) { const dw = Math.sqrt(dt) * gauss(r); sum1 += w * dw; w += dw; qv += dw * dw; tv += Math.abs(dw); QV.push([i * dt, qv]); WW.push([i * dt, w]); }
      const f = frame(g, { x0: 0, x1: 1, y0: Math.min(-1.5, ...WW.map((p) => p[1])), y1: Math.max(1.5, ...WW.map((p) => p[1])) }, { xl: 'time t', yl: '' });
      line(g.ctx, WW.map(([t, y]) => [f.X(t), f.Y(y)]), C.b, 1.4); line(g.ctx, QV.map(([t, y]) => [f.X(t), f.Y(y)]), C.c, 3); line(g.ctx, [[f.X(0), f.Y(0)], [f.X(1), f.Y(1)]], C.soft, 1, [5, 4]);
      legend(g.ctx, [[C.b, 'W(t)'], [C.c, 'Σ (ΔW)² up to t'], [C.soft, 'the line t']], 70, 30);
      o.textContent = `Σ(ΔW)² = ${qv.toFixed(4)} → 1 (so "(dW)² = dt")\nΣ|ΔW| = ${tv.toFixed(2)} → ∞ (infinite variation: no ordinary calculus)\nΣ W·ΔW = ${sum1.toFixed(4)} vs W(1)²/2 − 1/2 = ${(w * w / 2 - 0.5).toFixed(4)}  (Itô, not W²/2)`;
    }
    draw();
  };
  W.martingale = (root) => {
    const g = canvas(0, root); const o = output(root); let seed = 21;
    const v = controls(root, [{ key: 'measure', label: 'measure', type: 'select', value: 'P', options: [['P', 'real world P (drift μ)'], ['Q', 'risk-neutral Q (drift r)']] }, { key: 'mu', label: 'μ', min: 0, max: 0.4, step: 0.01, value: 0.15 }, { key: 'r', label: 'r', min: 0, max: 0.1, step: 0.005, value: 0.04 }, { type: 'button', label: 'resample', onClick: () => { seed++; draw(); } }], draw);
    function draw() {
      const { measure, mu, r: rf } = v; const s = 0.3, S0 = 100, T = 3, n = 150, dt = T / n, paths = 400; const r = rng(seed); const drift = measure === 'P' ? mu : rf;
      const avg = new Array(n + 1).fill(0); const shown = [];
      for (let p = 0; p < paths; p++) { let S = S0; const P = [S0]; avg[0] += S0; for (let i = 1; i <= n; i++) { S *= Math.exp((drift - s * s / 2) * dt + s * Math.sqrt(dt) * gauss(r)); const disc = S * Math.exp(-rf * i * dt); avg[i] += disc; P.push(disc); } if (p < 30) shown.push(P); }
      const f = frame(g, { x0: 0, x1: T, y0: 0, y1: 260 }, { xl: 'years', yl: 'discounted price e^{−rt}S(t)' });
      shown.forEach((P) => line(g.ctx, P.map((y, i) => [f.X(i * dt), f.Y(Math.min(y, 260))]), 'rgba(37,99,235,0.25)', 1));
      line(g.ctx, avg.map((a, i) => [f.X(i * dt), f.Y(a / paths)]), C.c, 3); line(g.ctx, [[f.X(0), f.Y(S0)], [f.X(T), f.Y(S0)]], C.ink, 1, [5, 4]);
      legend(g.ctx, [[C.c, `average of ${paths} discounted paths`]], 70, 30);
      o.textContent = `E[e^{−rT}S_T] ≈ ${(avg[n] / paths).toFixed(2)} vs S₀ = 100.  ${measure === 'Q' ? 'Under Q the discounted price is a martingale: flat on average.' : 'Under P it drifts up at μ − r: not a martingale.'}`;
    }
    draw();
  };
  W.crr = (root) => {
    const g = canvas(0, root); const o = output(root);
    const v = controls(root, [{ key: 'n', label: 'tree steps', min: 1, max: 200, step: 1, value: 4 }, { key: 'K', label: 'strike', min: 70, max: 130, step: 1, value: 100 }, { key: 's', label: 'σ', min: 0.05, max: 0.6, step: 0.01, value: 0.2 }], draw);
    function price(n, K, s, S0 = 100, T = 1, r = 0.05) { const dt = T / n, u = Math.exp(s * Math.sqrt(dt)), d = 1 / u, q = (Math.exp(r * dt) - d) / (u - d); let V = []; for (let j = 0; j <= n; j++) V.push(Math.max(S0 * Math.pow(u, j) * Math.pow(d, n - j) - K, 0)); for (let i = n - 1; i >= 0; i--) for (let j = 0; j <= i; j++) V[j] = Math.exp(-r * dt) * (q * V[j + 1] + (1 - q) * V[j]); return { p: V[0], q, u, d }; }
    function draw() {
      const { n, K, s } = v; const exact = bs(100, K, 1, 0.05, s, 'call'); const ps = []; for (let k = 1; k <= 200; k++) ps.push(price(k, K, s).p);
      const lo = Math.min(...ps, exact) * 0.97, hi = Math.max(...ps, exact) * 1.03; const f = frame(g, { x0: 1, x1: 200, y0: lo, y1: hi }, { xl: 'number of steps', yl: 'call price' });
      line(g.ctx, ps.map((p, i) => [f.X(i + 1), f.Y(p)]), C.b, 1.6); line(g.ctx, [[f.X(1), f.Y(exact)], [f.X(200), f.Y(exact)]], C.c, 2, [6, 4]);
      g.ctx.fillStyle = C.a; g.ctx.beginPath(); g.ctx.arc(f.X(n), f.Y(ps[n - 1]), 6, 0, 7); g.ctx.fill();
      legend(g.ctx, [[C.b, 'CRR binomial price'], [C.c, 'Black–Scholes']], g.W - 190, 30);
      const t = price(n, K, s); o.textContent = `n = ${n}: u = ${t.u.toFixed(4)}, d = ${t.d.toFixed(4)}, risk-neutral q = ${t.q.toFixed(4)}, price = ${t.p.toFixed(4)}   Black–Scholes = ${exact.toFixed(4)}`;
    }
    draw();
  };
  W.bscalc = (root) => {
    const g = canvas(0, root); const o = output(root);
    const v = controls(root, [{ key: 'S', label: 'spot S', min: 50, max: 150, step: 1, value: 100 }, { key: 'K', label: 'strike K', min: 50, max: 150, step: 1, value: 100 }, { key: 'T', label: 'years T', min: 0.02, max: 3, step: 0.02, value: 1 },
      { key: 'r', label: 'rate r', min: 0, max: 0.15, step: 0.005, value: 0.05 }, { key: 's', label: 'vol σ', min: 0.05, max: 0.8, step: 0.01, value: 0.2 }, { key: 'type', label: 'type', type: 'select', value: 'call', options: [['call', 'call'], ['put', 'put']] }], draw);
    function draw() {
      const { S, K, T, r, s, type } = v; const f = frame(g, { x0: 50, x1: 150, y0: 0, y1: 60 }, { xl: 'spot S', yl: 'option value' });
      const P = [], V = []; for (let x = 50; x <= 150; x += 0.5) { P.push([f.X(x), f.Y(Math.min(60, Math.max(type === 'call' ? x - K : K - x, 0)))]); V.push([f.X(x), f.Y(Math.min(60, bs(x, K, T, r, s, type)))]); }
      line(g.ctx, P, C.soft, 2, [6, 4]); line(g.ctx, V, C.a, 3); const val = bs(S, K, T, r, s, type);
      g.ctx.fillStyle = C.c; g.ctx.beginPath(); g.ctx.arc(f.X(S), f.Y(Math.min(60, val)), 6, 0, 7); g.ctx.fill();
      legend(g.ctx, [[C.a, 'value today'], [C.soft, 'payoff at expiry']], 70, 30);
      const G = greeks(S, K, T, r, s); const delta = type === 'call' ? G.delta : G.delta - 1;
      o.textContent = `${type} = ${val.toFixed(4)}   d₁ = ${G.d1.toFixed(4)}   d₂ = ${G.d2.toFixed(4)}\nΔ = ${delta.toFixed(4)}   Γ = ${G.gamma.toFixed(5)}   vega (per 1 vol pt) = ${G.vega.toFixed(4)}   θ (call, per day) = ${G.theta.toFixed(4)}`;
    }
    draw();
  };
  W.hedge = (root) => {
    const g = canvas(0, root); const o = output(root); let seed = 9;
    const v = controls(root, [{ key: 'n', label: 'rebalances', min: 1, max: 365, step: 1, value: 12 }, { key: 'sr', label: 'realised σ', min: 0.1, max: 0.4, step: 0.01, value: 0.2 }, { type: 'button', label: 'resimulate', onClick: () => { seed++; draw(); } }], draw);
    function draw() {
      const { n, sr } = v; const S0 = 100, K = 100, T = 0.25, r = 0.02, si = 0.2, M = 2000, dt = T / n; const rr = rng(seed); const pl = [];
      for (let m = 0; m < M; m++) { let S = S0, cash = bs(S0, K, T, r, si, 'call'); let d = greeks(S, K, T, r, si).delta; cash -= d * S;
        for (let i = 1; i <= n; i++) { S *= Math.exp((r - sr * sr / 2) * dt + sr * Math.sqrt(dt) * gauss(rr)); cash *= Math.exp(r * dt); const tl = T - i * dt; if (tl > 1e-9) { const nd = greeks(S, K, tl, r, si).delta; cash -= (nd - d) * S; d = nd; } }
        pl.push(cash + d * S - Math.max(S - K, 0)); }
      const mean = pl.reduce((a, b) => a + b, 0) / M, sd = Math.sqrt(pl.reduce((a, b) => a + (b - mean) ** 2, 0) / M);
      const lo = -6, hi = 6, bins = 60, h = new Array(bins).fill(0); pl.forEach((x) => { const b = Math.floor((x - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) h[b]++; });
      const f = frame(g, { x0: lo, x1: hi, y0: 0, y1: Math.max(...h) * 1.15 }, { xl: 'hedged P&L per option sold', yl: 'count' });
      h.forEach((c, i) => { g.ctx.fillStyle = C.fill; g.ctx.fillRect(f.X(lo + i * (hi - lo) / bins), f.Y(c), f.X(lo + (hi - lo) / bins) - f.X(lo) - 1, f.Y(0) - f.Y(c)); });
      line(g.ctx, [[f.X(0), f.Y(0)], [f.X(0), f.Y(Math.max(...h))]], C.ink, 1, [4, 4]);
      o.textContent = `Sold a 3-month ATM call at σ = 20% and delta-hedged ${n}× over ${M} paths.  Mean P&L ${mean.toFixed(3)}, st.dev ${sd.toFixed(3)}.\nMore rebalancing → narrower P&L. Realised vol above 20% → losses on average (you were short gamma).`;
    }
    draw();
  };
  W.mc = (root) => {
    const g = canvas(0, root); const o = output(root); let seed = 1;
    const v = controls(root, [{ key: 'M', label: 'paths (log₁₀)', min: 1, max: 5, step: 0.1, value: 3, show: (x) => Math.round(10 ** x) }, { type: 'button', label: 'new seed', onClick: () => { seed++; draw(); } }], draw);
    function draw() {
      const M = Math.round(10 ** v.M), S0 = 100, K = 100, T = 1, r = 0.05, s = 0.2; const exact = bs(S0, K, T, r, s, 'call'); const rr = rng(seed);
      let sum = 0, sq = 0; const est = []; for (let i = 1; i <= M; i++) { const ST = S0 * Math.exp((r - s * s / 2) * T + s * Math.sqrt(T) * gauss(rr)); const p = Math.exp(-r * T) * Math.max(ST - K, 0); sum += p; sq += p * p; if (i % Math.max(1, Math.floor(M / 300)) === 0) est.push([i, sum / i]); }
      const mean = sum / M, se = Math.sqrt((sq / M - mean * mean) / M);
      const f = frame(g, { x0: 1, x1: M, y0: exact - 4, y1: exact + 4 }, { xl: 'paths', yl: 'running MC price' });
      line(g.ctx, est.map(([i, e]) => [f.X(i), f.Y(Math.max(exact - 4, Math.min(exact + 4, e)))]), C.b, 1.8); line(g.ctx, [[f.X(1), f.Y(exact)], [f.X(M), f.Y(exact)]], C.c, 2, [6, 4]);
      legend(g.ctx, [[C.b, 'Monte Carlo estimate'], [C.c, 'Black–Scholes']], g.W - 200, 30);
      o.textContent = `MC = ${mean.toFixed(4)} ± ${(1.96 * se).toFixed(4)} (95%)   BS = ${exact.toFixed(4)}   error shrinks like 1/√M`;
    }
    draw();
  };

  // ---------- ML series ----------
  function blobs(seed, kind) {
    const r = rng(seed), pts = [];
    if (kind === 'xor') { for (let i = 0; i < 200; i++) { const x = r() * 2 - 1, y = r() * 2 - 1; pts.push([x, y, (x * y > 0) ? 1 : 0]); } return pts; }
    if (kind === 'circle') { for (let i = 0; i < 240; i++) { const x = r() * 2 - 1, y = r() * 2 - 1; const lab = x * x + y * y < 0.45 ? 1 : 0; pts.push([x + 0.08 * gauss(r), y + 0.08 * gauss(r), lab]); } return pts; }
    for (let i = 0; i < 220; i++) { const c = i % 2; const cx = c ? 0.35 : -0.35, cy = c ? 0.25 : -0.2; pts.push([cx + 0.33 * gauss(r), cy + 0.33 * gauss(r), c]); } return pts;
  }
  function gini(ys) { if (!ys.length) return 0; const p = ys.reduce((a, b) => a + b, 0) / ys.length; return 2 * p * (1 - p); }
  function buildTree(pts, depth, minLeaf = 3, featSub = 0, r) {
    const ys = pts.map((p) => p[2]); const pred = ys.reduce((a, b) => a + b, 0) / Math.max(1, ys.length);
    if (depth === 0 || pts.length < 2 * minLeaf || pred === 0 || pred === 1) return { leaf: true, p: pred, n: pts.length };
    let best = null; const feats = featSub ? [r() < 0.5 ? 0 : 1] : [0, 1];
    feats.forEach((f) => { const s = [...pts].sort((a, b) => a[f] - b[f]); let left1 = 0; const tot1 = ys.reduce((a, b) => a + b, 0);
      for (let i = minLeaf; i <= s.length - minLeaf; i++) { left1 += s[i - 1][2]; if (i < s.length && s[i][f] === s[i - 1][f]) continue; const nl = i, nr = s.length - i; const pl = left1 / nl, pr = (tot1 - left1) / nr;
        const imp = (nl * 2 * pl * (1 - pl) + nr * 2 * pr * (1 - pr)) / s.length; if (!best || imp < best.imp) best = { imp, f, t: i < s.length ? (s[i - 1][f] + s[i][f]) / 2 : s[i - 1][f] }; } });
    if (!best || best.imp >= gini(ys) - 1e-9) return { leaf: true, p: pred, n: pts.length };
    const L = pts.filter((p) => p[best.f] <= best.t), R = pts.filter((p) => p[best.f] > best.t);
    return { f: best.f, t: best.t, gain: gini(ys) - best.imp, l: buildTree(L, depth - 1, minLeaf, featSub, r), r: buildTree(R, depth - 1, minLeaf, featSub, r) };
  }
  const predictTree = (t, x) => t.leaf ? t.p : predictTree(x[t.f] <= t.t ? t.l : t.r, x);
  function countLeaves(t) { return t.leaf ? 1 : countLeaves(t.l) + countLeaves(t.r); }
  function heat(g, f, pred) {
    const { ctx } = g; const step = 6; for (let px = f.L; px < g.W - f.R; px += step) for (let py = f.T; py < g.H - f.B; py += step) {
      const x = -1.3 + (px - f.L) / (g.W - f.L - f.R) * 2.6, y = 1.3 - (py - f.T) / (g.H - f.T - f.B) * 2.6; const p = pred([x, y]);
      ctx.fillStyle = `rgba(${Math.round(37 + (194 - 37) * p)},${Math.round(99 + (65 - 99) * p)},${Math.round(235 + (12 - 235) * p)},0.28)`; ctx.fillRect(px, py, step, step); }
  }
  function dots(g, f, pts) { pts.forEach(([x, y, c]) => { g.ctx.fillStyle = c ? C.c : C.b; g.ctx.beginPath(); g.ctx.arc(f.X(x), f.Y(y), 3.2, 0, 7); g.ctx.fill(); }); }
  function acc(pts, pred) { return pts.filter((p) => (pred(p) >= 0.5 ? 1 : 0) === p[2]).length / pts.length; }
  W.cart = (root) => {
    const g = canvas(0, root, 720, 420); const o = output(root);
    const v = controls(root, [{ key: 'depth', label: 'max depth', min: 0, max: 10, step: 1, value: 2 }, { key: 'data', label: 'data', type: 'select', value: 'circle', options: [['circle', 'circle'], ['blobs', 'two blobs'], ['xor', 'XOR']] }], draw);
    function draw() {
      const tr = blobs(4, v.data), te = blobs(99, v.data); const t = buildTree(tr, v.depth); const f = frame(g, { x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 }, { L: 34 });
      heat(g, f, (x) => predictTree(t, x)); dots(g, f, tr);
      const walk = (n, b) => { if (n.leaf) return; g.ctx.strokeStyle = C.ink; g.ctx.lineWidth = 1.5; g.ctx.beginPath(); if (n.f === 0) { g.ctx.moveTo(f.X(n.t), f.Y(b.y0)); g.ctx.lineTo(f.X(n.t), f.Y(b.y1)); walk(n.l, { ...b, x1: n.t }); walk(n.r, { ...b, x0: n.t }); } else { g.ctx.moveTo(f.X(b.x0), f.Y(n.t)); g.ctx.lineTo(f.X(b.x1), f.Y(n.t)); walk(n.l, { ...b, y1: n.t }); walk(n.r, { ...b, y0: n.t }); } g.ctx.stroke(); };
      const b0 = { x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 };
      const draw2 = (n, b) => { if (n.leaf) return; g.ctx.save(); g.ctx.strokeStyle = C.ink; g.ctx.lineWidth = 1.5; g.ctx.beginPath(); if (n.f === 0) { g.ctx.moveTo(f.X(n.t), f.Y(b.y0)); g.ctx.lineTo(f.X(n.t), f.Y(b.y1)); } else { g.ctx.moveTo(f.X(b.x0), f.Y(n.t)); g.ctx.lineTo(f.X(b.x1), f.Y(n.t)); } g.ctx.stroke(); g.ctx.restore();
        if (n.f === 0) { draw2(n.l, { ...b, x1: n.t }); draw2(n.r, { ...b, x0: n.t }); } else { draw2(n.l, { ...b, y1: n.t }); draw2(n.r, { ...b, y0: n.t }); } };
      draw2(t, b0);
      o.textContent = `leaves: ${countLeaves(t)}   train accuracy ${(acc(tr, (x) => predictTree(t, x)) * 100).toFixed(1)}%   test accuracy ${(acc(te, (x) => predictTree(t, x)) * 100).toFixed(1)}%   (deep trees memorise the noise)`;
    }
    draw();
  };
  W.forest = (root) => {
    const g = canvas(0, root, 720, 420); const o = output(root);
    const v = controls(root, [{ key: 'trees', label: 'trees', min: 1, max: 100, step: 1, value: 1 }, { key: 'depth', label: 'depth', min: 1, max: 12, step: 1, value: 8 }], draw);
    function draw() {
      const tr = blobs(4, 'circle'), te = blobs(99, 'circle'); const r = rng(42); const ts = [];
      for (let k = 0; k < v.trees; k++) { const boot = tr.map(() => tr[Math.floor(r() * tr.length)]); ts.push(buildTree(boot, v.depth, 2, 1, r)); }
      const pred = (x) => ts.reduce((a, t) => a + predictTree(t, x), 0) / ts.length; const f = frame(g, { x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 }, { L: 34 });
      heat(g, f, pred); dots(g, f, tr);
      o.textContent = `${v.trees} bootstrapped tree${v.trees > 1 ? 's' : ''}, random feature per split.  train ${(acc(tr, pred) * 100).toFixed(1)}%   test ${(acc(te, pred) * 100).toFixed(1)}%   (averaging smooths the jagged single-tree boundary)`;
    }
    draw();
  };
  W.boosting = (root) => {
    const g = canvas(0, root); const o = output(root);
    const v = controls(root, [{ key: 'm', label: 'boosting rounds', min: 0, max: 200, step: 1, value: 5 }, { key: 'eta', label: 'learning rate η', min: 0.05, max: 1, step: 0.05, value: 0.3 }], draw);
    const r = rng(8); const X = [], Y = []; for (let i = 0; i < 120; i++) { const x = r() * 6; X.push(x); Y.push(Math.sin(x) + 0.3 * Math.cos(3 * x) + 0.18 * gauss(r)); }
    const XT = [], YT = []; for (let i = 0; i < 300; i++) { const x = r() * 6; XT.push(x); YT.push(Math.sin(x) + 0.3 * Math.cos(3 * x) + 0.18 * gauss(r)); }
    function stump(res) { const idx = X.map((_, i) => i).sort((a, b) => X[a] - X[b]); let best = null; const tot = res.reduce((a, b) => a + b, 0); let ls = 0;
      for (let k = 1; k < idx.length; k++) { ls += res[idx[k - 1]]; const nl = k, nr = idx.length - k; const ml = ls / nl, mr = (tot - ls) / nr; const gain = nl * ml * ml + nr * mr * mr; if (!best || gain > best.gain) best = { gain, t: (X[idx[k - 1]] + X[idx[k]]) / 2, ml, mr }; } return best; }
    function draw() {
      const { m, eta } = v; const base = Y.reduce((a, b) => a + b, 0) / Y.length; const F = X.map(() => base); const stumps = [];
      for (let k = 0; k < m; k++) { const res = Y.map((y, i) => y - F[i]); const s = stump(res); stumps.push(s); X.forEach((x, i) => { F[i] += eta * (x <= s.t ? s.ml : s.mr); }); }
      const pred = (x) => stumps.reduce((a, s) => a + eta * (x <= s.t ? s.ml : s.mr), base);
      const f = frame(g, { x0: 0, x1: 6, y0: -2, y1: 2 }, { xl: 'x', yl: 'y' });
      X.forEach((x, i) => { g.ctx.fillStyle = 'rgba(37,99,235,0.55)'; g.ctx.beginPath(); g.ctx.arc(f.X(x), f.Y(Y[i]), 3, 0, 7); g.ctx.fill(); });
      const P = []; for (let x = 0; x <= 6; x += 0.01) P.push([f.X(x), f.Y(pred(x))]); line(g.ctx, P, C.c, 2.5);
      const mse = (xs, ys) => xs.reduce((a, x, i) => a + (ys[i] - pred(x)) ** 2, 0) / xs.length;
      o.textContent = `F_m(x) = F_{m−1}(x) + η·stump fitted to residuals.  train MSE ${mse(X, Y).toFixed(4)}   test MSE ${mse(XT, YT).toFixed(4)}   (noise floor ≈ 0.032)`;
    }
    draw();
  };
  W.mlp = (root) => {
    const g = canvas(0, root, 720, 420); const o = output(root); let net, timer = null, epoch = 0, data;
    const v = controls(root, [{ key: 'h', label: 'hidden units', min: 1, max: 16, step: 1, value: 4 }, { key: 'lr', label: 'learning rate', min: 0.01, max: 1, step: 0.01, value: 0.3 },
      { key: 'act', label: 'activation', type: 'select', value: 'tanh', options: [['tanh', 'tanh'], ['relu', 'ReLU'], ['linear', 'none (linear)']] }, { key: 'data', label: 'data', type: 'select', value: 'xor', options: [['xor', 'XOR'], ['circle', 'circle'], ['blobs', 'two blobs']] },
      { type: 'button', label: '▶ train / pause', onClick: () => toggle() }, { type: 'button', label: 'reset', onClick: () => reset() }], () => reset());
    const A = { tanh: [Math.tanh, (y) => 1 - y * y], relu: [(x) => Math.max(0, x), (y) => (y > 0 ? 1 : 0)], linear: [(x) => x, () => 1] };
    function reset() { const r = rng(17); const H = v.h; net = { W1: [...Array(H)].map(() => [gauss(r), gauss(r)]), b1: new Array(H).fill(0), W2: [...Array(H)].map(() => gauss(r) * 0.5), b2: 0 }; epoch = 0; data = blobs(5, v.data); render(); }
    function fwd(x) { const [f] = A[v.act]; const h = net.W1.map((w, j) => f(w[0] * x[0] + w[1] * x[1] + net.b1[j])); const z = h.reduce((a, hj, j) => a + hj * net.W2[j], net.b2); return { h, p: 1 / (1 + Math.exp(-z)) }; }
    function step() { const [, df] = A[v.act]; const H = v.h; const gW1 = net.W1.map(() => [0, 0]), gb1 = new Array(H).fill(0), gW2 = new Array(H).fill(0); let gb2 = 0, loss = 0;
      data.forEach((pt) => { const { h, p } = fwd(pt); const y = pt[2]; loss += -(y * Math.log(p + 1e-9) + (1 - y) * Math.log(1 - p + 1e-9)); const dz = p - y; gb2 += dz;
        h.forEach((hj, j) => { gW2[j] += dz * hj; const dh = dz * net.W2[j] * df(hj); gW1[j][0] += dh * pt[0]; gW1[j][1] += dh * pt[1]; gb1[j] += dh; }); });
      const n = data.length, lr = v.lr; net.b2 -= lr * gb2 / n; for (let j = 0; j < H; j++) { net.W2[j] -= lr * gW2[j] / n; net.W1[j][0] -= lr * gW1[j][0] / n; net.W1[j][1] -= lr * gW1[j][1] / n; net.b1[j] -= lr * gb1[j] / n; } epoch++; return loss / n; }
    let lastLoss = NaN;
    function render() { const f = frame(g, { x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 }, { L: 34 }); heat(g, f, (x) => fwd(x).p); dots(g, f, data); o.textContent = `epoch ${epoch}   loss ${isNaN(lastLoss) ? '—' : lastLoss.toFixed(4)}   accuracy ${(acc(data, (x) => fwd(x).p) * 100).toFixed(1)}%`; }
    function toggle() { if (timer) { clearInterval(timer); timer = null; return; } timer = setInterval(() => { for (let k = 0; k < 20; k++) lastLoss = step(); render(); if (epoch > 6000) toggle(); }, 30); }
    reset();
  };
  W.backprop = (root) => {
    const o = el('div', { className: 'w-out' }); o.style.fontSize = '0.92rem';
    const v = controls(root, [{ key: 'x1', label: 'x₁', min: -2, max: 2, step: 0.1, value: 1 }, { key: 'x2', label: 'x₂', min: -2, max: 2, step: 0.1, value: -0.5 }, { key: 'y', label: 'target y', min: 0, max: 1, step: 1, value: 1 }], draw);
    root.appendChild(o);
    function draw() {
      const { x1, x2, y } = v; const w = [[0.5, -0.3], [0.8, 0.2]], b = [0.1, -0.1], u = [1.2, -0.7], c = 0.05; const sig = (z) => 1 / (1 + Math.exp(-z));
      const z = w.map((wj, j) => wj[0] * x1 + wj[1] * x2 + b[j]); const h = z.map(Math.tanh); const s = h[0] * u[0] + h[1] * u[1] + c; const p = sig(s); const L = -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
      const dS = p - y; const du = h.map((hj) => dS * hj); const dh = u.map((uj) => dS * uj); const dz = dh.map((d, j) => d * (1 - h[j] * h[j])); const dw = dz.map((d) => [d * x1, d * x2]);
      const f = (x) => (x >= 0 ? ' ' : '') + x.toFixed(4);
      o.textContent = `FORWARD\n  z = W·x + b      = [${f(z[0])}, ${f(z[1])}]\n  h = tanh(z)      = [${f(h[0])}, ${f(h[1])}]\n  s = u·h + c      = ${f(s)}\n  p = σ(s)         = ${f(p)}\n  L = −[y ln p + (1−y) ln(1−p)] = ${f(L)}\n\nBACKWARD (chain rule, right to left)\n  ∂L/∂s = p − y    = ${f(dS)}\n  ∂L/∂u = (p−y)·h  = [${f(du[0])}, ${f(du[1])}]\n  ∂L/∂h = (p−y)·u  = [${f(dh[0])}, ${f(dh[1])}]\n  ∂L/∂z = ∂L/∂h ⊙ (1 − h²) = [${f(dz[0])}, ${f(dz[1])}]\n  ∂L/∂W = ∂L/∂z · xᵀ = [[${f(dw[0][0])}, ${f(dw[0][1])}], [${f(dw[1][0])}, ${f(dw[1][1])}]]\n  ∂L/∂b = ∂L/∂z    = [${f(dz[0])}, ${f(dz[1])}]`;
    }
    draw();
  };
  W.optim = (root) => {
    const g = canvas(0, root, 720, 420); const o = output(root);
    const v = controls(root, [{ key: 'lr', label: 'learning rate', min: 0.001, max: 0.1, step: 0.001, value: 0.02 }, { key: 'steps', label: 'steps', min: 10, max: 400, step: 10, value: 120 }], draw);
    // Rosenbrock-like narrow valley
    const Lf = (x, y) => 0.5 * (x - 1) ** 2 + 6 * (y - x * x) ** 2; const grad = (x, y) => [(x - 1) - 24 * x * (y - x * x), 12 * (y - x * x)];
    function run(kind, lr, n) { let x = -1.2, y = 1.4, vx = 0, vy = 0, mx = 0, my = 0, sx = 0, sy = 0; const P = [[x, y]];
      for (let t = 1; t <= n; t++) { let [gx, gy] = grad(x, y); const cl = Math.hypot(gx, gy); if (cl > 50) { gx *= 50 / cl; gy *= 50 / cl; }
        if (kind === 'sgd') { x -= lr * gx; y -= lr * gy; } else if (kind === 'mom') { vx = 0.9 * vx + gx; vy = 0.9 * vy + gy; x -= lr * vx; y -= lr * vy; }
        else { mx = 0.9 * mx + 0.1 * gx; my = 0.9 * my + 0.1 * gy; sx = 0.999 * sx + 0.001 * gx * gx; sy = 0.999 * sy + 0.001 * gy * gy; const mh = 1 - 0.9 ** t, sh = 1 - 0.999 ** t; x -= lr * 5 * (mx / mh) / (Math.sqrt(sx / sh) + 1e-8); y -= lr * 5 * (my / mh) / (Math.sqrt(sy / sh) + 1e-8); }
        x = Math.max(-2, Math.min(2, x)); y = Math.max(-1, Math.min(3, y)); P.push([x, y]); } return P; }
    function draw() {
      const f = frame(g, { x0: -2, x1: 2, y0: -1, y1: 3 }, { L: 34 }); const { ctx } = g;
      for (let px = f.L; px < g.W - f.R; px += 5) for (let py = f.T; py < g.H - f.B; py += 5) { const x = -2 + (px - f.L) / (g.W - f.L - f.R) * 4, y = 3 - (py - f.T) / (g.H - f.T - f.B) * 4; const l = Math.log(1 + Lf(x, y)); ctx.fillStyle = `hsla(${150 - Math.min(l, 6) * 22},60%,60%,0.35)`; ctx.fillRect(px, py, 5, 5); }
      const runs = [['sgd', C.b, 'gradient descent'], ['mom', C.d, 'momentum (β = 0.9)'], ['adam', C.c, 'Adam']]; const outs = [];
      runs.forEach(([k, col, name]) => { const P = run(k, v.lr, v.steps); line(ctx, P.map(([x, y]) => [f.X(x), f.Y(y)]), col, 2.2); const [x, y] = P[P.length - 1]; outs.push(`${name}: loss ${Lf(x, y).toFixed(4)}`); });
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(f.X(1), f.Y(1), 5, 0, 7); ctx.fill(); legend(ctx, runs.map(([, c, n]) => [c, n]), 50, 30);
      o.textContent = outs.join('   ') + '   (minimum at (1, 1))';
    }
    draw();
  };

  function init() { document.querySelectorAll('.widget[data-widget]').forEach((w) => { const fn = W[w.dataset.widget]; if (!fn) return; if (w.dataset.title) w.prepend(el('div', { className: 'w-head' }, w.dataset.title)); try { fn(w); } catch (e) { console.error(e); } }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
