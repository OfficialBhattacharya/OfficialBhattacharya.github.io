/* Kargil '99: board, controls, computer turns and online play */
(function () {
  'use strict';
  const G = window.Kargil; const { K, P, MAP } = G;
  const $ = (id) => document.getElementById(id);
  const SZ = 34, SQ = Math.sqrt(3);
  const center = (c, r) => [SZ + c * SZ * 1.5, SZ * SQ / 2 + r * SZ * SQ + (c & 1 ? SZ * SQ / 2 : 0)];
  const corners = (c, r) => { const [x, y] = center(c, r); return [0, 1, 2, 3, 4, 5].map((i) => [x + SZ * Math.cos(Math.PI / 3 * i), y + SZ * Math.sin(Math.PI / 3 * i)]); };
  const W = SZ * 1.5 * (G.COLS - 1) + SZ * 2, H = SZ * SQ * (G.ROWS + 0.5) + 2;
  const svg = $('map'); svg.setAttribute('viewBox', `-4 -22 ${W + 8} ${H + 30}`);
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const SIDE_NAME = { IND: 'India', PAK: 'Pakistan' };

  let S = null;            // game state
  let mode = null;         // 'ai-IND' | 'ai-PAK' | 'hotseat' | 'online'
  let me = null;           // side controlled locally (null = both, hotseat)
  let sel = null, attackSel = null, poolSel = null, lastMoved = [];
  let aiBusy = false, net = null;

  const local = () => S && !S.winner && (me === null || S.side === me);

  // ---------------- static board layer ----------------
  const boardLayer = mk('g', {}, svg), overLayer = mk('g', {}, svg), unitLayer = mk('g', {}, svg);
  function drawBoard() {
    boardLayer.innerHTML = '';
    const defs = mk('defs', {}, boardLayer);
    const pat = mk('pattern', { id: 'peak', width: 10, height: 10, patternUnits: 'userSpaceOnUse' }, defs);
    mk('path', { d: 'M0 9 L5 2 L10 9', fill: 'none', stroke: '#7d6a4f', 'stroke-width': 1.1 }, pat);
    for (let c = 0; c < G.COLS; c++) for (let r = 0; r < G.ROWS; r++) {
      const k = K(c, r); const peak = MAP.peaks[k] !== undefined;
      const fill = peak ? '#c4b192' : MAP.edges.PAK.has(k) ? '#d9d6c6' : '#e7dfc6';
      mk('polygon', { points: corners(c, r).map((p) => p.join(',')).join(' '), fill, class: 'hex', 'data-k': k }, boardLayer);
      if (peak) mk('polygon', { points: corners(c, r).map((p) => p.join(',')).join(' '), fill: 'url(#peak)', opacity: 0.55, 'pointer-events': 'none' }, boardLayer);
    }
    // road
    const pts = MAP.roadList.map((k) => center(...P(k)).join(',')).join(' ');
    mk('polyline', { points: pts, fill: 'none', stroke: '#fff3d6', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'pointer-events': 'none' }, boardLayer);
    mk('polyline', { points: pts, fill: 'none', stroke: '#9b5d2a', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'pointer-events': 'none' }, boardLayer);
    // rivers on shared hex edges
    MAP.rivNames.forEach(([a, b]) => { const A = corners(...P(a)), B = corners(...P(b)); const sh = A.filter((p) => B.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.5)); if (sh.length === 2) mk('line', { x1: sh[0][0], y1: sh[0][1], x2: sh[1][0], y2: sh[1][1], stroke: '#3d86c6', 'stroke-width': 4.2, 'stroke-linecap': 'round', 'pointer-events': 'none' }, boardLayer); });
    // labels, towns, forts
    Object.entries(MAP.peaks).forEach(([k, name]) => { if (!name) return; const [x, y] = center(...P(k)); mk('text', { x, y: y - SZ * 0.55, 'text-anchor': 'middle', 'font-size': 7.5, 'font-family': 'Inter', 'font-weight': 700, fill: '#5a4630', 'pointer-events': 'none' }, boardLayer).textContent = name.toUpperCase(); });
    Object.entries(MAP.forts).forEach(([k]) => { const [x, y] = center(...P(k)); mk('path', { d: `M${x - 9} ${y + 16} h18 v-6 l-3 -3 l-3 3 l-3 -3 l-3 3 l-3 -3 l-3 3 z`, fill: '#6b5b45', 'pointer-events': 'none' }, boardLayer); });
    Object.entries(MAP.towns).forEach(([k, [name, side]]) => { const [x, y] = center(...P(k)); const obj = k === MAP.objective;
      if (obj) mk('polygon', { points: starPts(x, y + SZ * 0.6, 7, 3), fill: '#c0392b', 'pointer-events': 'none' }, boardLayer);
      else mk('circle', { cx: x, cy: y + SZ * 0.58, r: 4, fill: side === 'IND' ? '#2e6b3a' : '#3b4a5c', 'pointer-events': 'none' }, boardLayer);
      mk('text', { x, y: y + SZ * 0.95, 'text-anchor': 'middle', 'font-size': obj ? 10 : 8.5, 'font-family': 'Oswald', fill: obj ? '#8f1d14' : '#2b2b26', 'pointer-events': 'none' }, boardLayer).textContent = name.toUpperCase(); });
    // edges
    mk('line', { x1: 0, y1: -6, x2: W, y2: -6, stroke: '#3b4a5c', 'stroke-width': 3, 'stroke-dasharray': '10 6' }, boardLayer);
    mk('text', { x: W / 2, y: -11, 'text-anchor': 'middle', 'font-size': 10, 'font-family': 'Oswald', fill: '#93a29a', 'letter-spacing': 2 }, boardLayer).textContent = 'LINE OF CONTROL · PAKISTANI ENTRY EDGE';
    mk('text', { x: W / 2, y: H + 6, 'text-anchor': 'middle', 'font-size': 10, 'font-family': 'Oswald', fill: '#93a29a', 'letter-spacing': 2 }, boardLayer).textContent = 'INDIAN REAR · SRINAGAR (WEST) · LEH (EAST)';
    mk('text', { x: center(1, 6)[0] - 8, y: center(1, 6)[1] - 22, 'font-size': 8, 'font-family': 'Inter', 'font-weight': 700, fill: '#9b5d2a' }, boardLayer).textContent = 'NH1A';
  }
  function starPts(x, y, R, r) { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R; p.push(`${x + rad * Math.cos(a)},${y + rad * Math.sin(a)}`); } return p.join(' '); }

  // ---------------- dynamic render ----------------
  function render() {
    if (!S) return;
    overLayer.innerHTML = ''; unitLayer.innerHTML = '';
    const ph = G.phase(S); const b = S.battle; const highlights = new Map();
    if (local()) {
      if (sel && (ph === 'move' || ph === 'fast' || ph === 'road')) { const u = byId(sel); G.reachable(S, u).forEach((_, k) => highlights.set(k, 'hl')); }
      if (ph === 'combat' && !b) G.targets(S).forEach((t) => highlights.set(t.hex, 'tg'));
      if (b && b.stage === 'retreat') b.retreatOpts.forEach((k) => highlights.set(k, 'hl'));
      if (ph === 'repl' && poolSel) G.placementHexes(S, S.side).forEach((k) => highlights.set(k, 'place'));
    }
    highlights.forEach((cls, k) => mk('polygon', { points: corners(...P(k)).map((p) => p.join(',')).join(' '), fill: cls === 'tg' ? 'rgba(226,87,76,.18)' : cls === 'place' ? 'rgba(76,195,138,.25)' : 'rgba(240,168,48,.28)', class: 'hex ' + cls, 'data-k': k }, overLayer));
    if (G.storm(S)) mk('rect', { x: -4, y: -22, width: W + 8, height: H + 30, fill: 'rgba(200,225,255,.13)', 'pointer-events': 'none' }, overLayer);
    // objective owner ring
    const [ox, oy] = center(...P(MAP.objective)); mk('circle', { cx: ox, cy: oy, r: SZ * 0.92, fill: 'none', stroke: S.objOwner === 'IND' ? '#f08a24' : '#e8edf2', 'stroke-width': 2.5, 'stroke-dasharray': '4 3', 'pointer-events': 'none' }, overLayer);
    const flips = local() && ph === 'repl' ? new Set(G.flippable(S, S.side).map((u) => u.id)) : new Set();
    const attackers = attackSel ? new Set(attackSel.ids) : new Set();
    G.onMap(S).forEach((u) => {
      const [x, y] = center(...P(u.hex)); const g = mk('g', { class: 'unit', 'data-id': u.id, transform: `translate(${x - 21},${y - 21})` }, unitLayer);
      if (sel === u.id) g.classList.add('sel'); if (attackers.has(u.id)) g.classList.add('att'); if (attackSel && attackSel.target === u.id) g.classList.add('target');
      if (local() && (ph === 'move' || ph === 'fast' || ph === 'road') && u.side === S.side && !G.canMoveUnit(S, u)) g.classList.add('dim');
      const ind = u.side === 'IND';
      mk('rect', { class: 'body', x: 0, y: 0, width: 42, height: 42, rx: 4, fill: ind ? '#2e6b3a' : '#3b4a5c', stroke: '#111', 'stroke-width': 1 }, g);
      mk('rect', { x: 0, y: 0, width: 42, height: 7, rx: 2, fill: ind ? '#f08a24' : '#e8edf2' }, g);
      if (u.step === 1) mk('rect', { x: 0, y: 7, width: 42, height: 35, fill: 'rgba(0,0,0,.28)' }, g);
      mk('text', { x: 21, y: 18, 'text-anchor': 'middle', 'font-size': 6.6, 'font-family': 'Inter', 'font-weight': 700, fill: '#fff' }, g).textContent = u.name.length > 11 ? u.name.slice(0, 11) : u.name;
      if (u.fast) mk('path', { d: 'M4 25 l4 -7 l4 7 z', fill: '#ffd34d' }, g);
      mk('text', { x: 21, y: 36, 'text-anchor': 'middle', 'font-size': 12, 'font-family': 'Oswald', fill: u.step === 1 ? '#ffcf9a' : '#fff' }, g).textContent = `${G.strength(u)}-${u.mv}`;
      if (u.step === 1) mk('text', { x: 38, y: 40, 'text-anchor': 'end', 'font-size': 6.5, 'font-family': 'Inter', fill: '#ffcf9a' }, g).textContent = '½';
      if (flips.has(u.id)) mk('circle', { cx: 38, cy: 12, r: 5, fill: '#4cc38a', stroke: '#111' }, g);
      if (local() && ph === 'combat' && S.attacked[u.id]) g.classList.add('dim');
    });
    renderPanel();
  }
  const byId = (id) => S.units.find((u) => u.id === id);

  // ---------------- side panel ----------------
  function renderPanel() {
    const t = G.TURNS[S.turn - 1]; const ph = G.phase(S);
    $('track').innerHTML = G.TURNS.map((x, i) => `<div class="${i + 1 === S.turn ? 'now' : ''} ${x.storm ? 'storm' : ''}">${i + 1} · ${x.name}</div>`).join('');
    $('turnname').textContent = `Turn ${S.turn}`; const sb = $('sidebadge'); sb.className = 'badge ' + S.side; sb.textContent = SIDE_NAME[S.side];
    $('phasename').textContent = G.PHASE_NAME[ph]; const ob = $('objbadge'); ob.className = 'badge ' + S.objOwner; ob.textContent = SIDE_NAME[S.objOwner];
    $('log').textContent = S.log.slice(-60).join('\n'); $('log').scrollTop = 1e9;
    const acts = $('actions'); acts.innerHTML = '';
    let hint = '';
    if (S.winner) {
      hint = `<b>${SIDE_NAME[S.winner]} wins</b>: last to occupy Kargil at the end of turn 7.`;
      addBtn(acts, 'New game', () => openStart(), 'primary');
    } else if (!local()) {
      hint = aiBusy ? `${SIDE_NAME[S.side]} (computer) is thinking…` : mode === 'online' ? `Waiting for ${SIDE_NAME[S.side]} to play…` : '';
    } else {
      hint = (t.note ? `<i>${t.note}</i><br>` : '') + ({
        repl: `Spend ${S.repl} replacement step${S.repl === 1 ? '' : 's'}: click a <span style="color:#4cc38a">●</span> half-strength unit to restore it, or pick a unit from the pool below and click a green hex.`,
        fast: 'Only light infantry (▲) may move now. Click a unit, then an orange hex.',
        road: 'Indian units that start on NH1A may move up to 4 road hexes. Peaks cost nothing extra on the road, and storms don\'t slow it.',
        combat: S.battle ? 'Resolve the battle on the right.' : 'Click a red-outlined enemy unit to attack it. Your adjacent units are added automatically; click one of yours to leave it out.',
        move: `All units may move (${G.storm(S) ? '1 hex in the storm' : 'infantry 4, light infantry 6; peaks cost 2'}). Entering an enemy zone of control stops a unit.` })[ph];
      const endable = !S.battle; addBtn(acts, ph === 'move' && S.side === 'IND' && S.turn === 7 ? 'End game' : 'End phase', () => act(() => { sel = null; attackSel = null; poolSel = null; lastMoved = []; G.endPhase(S); }), 'primary', !endable);
      if ((ph === 'move' || ph === 'fast' || ph === 'road') && lastMoved.length) addBtn(acts, 'Undo move', () => act(() => { const id = lastMoved.pop(); G.undoMove(S, id); }));
    }
    $('hint').innerHTML = hint;
    renderCombat(); renderRepl();
    $('netstatus').textContent = net ? net.status : '';
  }
  function addBtn(parent, label, fn, cls, disabled) { const b = document.createElement('button'); b.textContent = label; if (cls) b.className = cls; b.disabled = !!disabled; b.onclick = fn; parent.appendChild(b); return b; }
  function renderCombat() {
    const card = $('combatcard'), box = $('combat'); const b = S.battle;
    if (!attackSel && !b) { card.hidden = true; return; } card.hidden = false; box.innerHTML = '';
    if (attackSel && !b) {
      const o = G.odds(S, attackSel.target, attackSel.ids); const t = byId(attackSel.target);
      box.innerHTML = `<div class="odds">Target: ${t.name} (${G.strength(t)})<br>Attack ${o.att}${G.storm(S) ? ' (halved in storm)' : ''} ÷ defence ${o.def} → ${o.ratio}:1${o.shifts.map((x) => `<br>−1 ${x}`).join('')}<br><b>Final column: ${o.label}</b></div>`;
      const bt = document.createElement('div'); bt.className = 'btns'; box.appendChild(bt);
      addBtn(bt, o.col >= 1 ? `Roll the die (${o.label})` : 'Attack anyway (no effect)', () => act(() => { const die = 1 + Math.floor(Math.random() * 6); G.startBattle(S, attackSel.target, attackSel.ids, die); attackSel = null; }), 'danger', !attackSel.ids.length);
      addBtn(bt, 'Cancel', () => { attackSel = null; render(); });
      return;
    }
    const t = byId(b.target);
    box.innerHTML = `<div><span class="die">${b.die}</span><span class="res">${b.res}</span> <span class="odds">at ${b.odds.label}</span></div>`;
    const bt = document.createElement('div'); bt.className = 'btns'; box.appendChild(bt);
    if (!local()) { box.insertAdjacentHTML('beforeend', '<p class="odds">Waiting for the attacker…</p>'); return; }
    if (b.stage === 'retreat') box.insertAdjacentHTML('beforeend', `<p class="odds">Choose where ${t.name} retreats: click an orange hex.</p>`);
    if (b.stage === 'al') { box.insertAdjacentHTML('beforeend', '<p class="odds">Attacker loses one step. Choose the unit:</p>'); b.attackers.map(byId).filter((u) => u.step > 0).forEach((u) => addBtn(bt, `${u.name} (−${u.step === 2 ? u.full - u.half : u.half})`, () => act(() => G.chooseLoss(S, [u.id])))); }
    if (b.stage === 'ex') { const pick = G.autoLoss(S).map(byId); box.insertAdjacentHTML('beforeend', `<p class="odds">Exchange: attackers must lose at least ${b.exNeed} strength.</p>`); addBtn(bt, `Lose: ${pick.map((u) => u.name).join(' + ')}`, () => act(() => G.chooseLoss(S, pick.map((u) => u.id))), 'primary'); }
    if (b.stage === 'advance') { box.insertAdjacentHTML('beforeend', `<p class="odds">The defender's hex is empty. Advance one attacker into ${G.hexName(b.from)}?</p>`); b.advanceIds.map(byId).forEach((u) => addBtn(bt, `Advance ${u.name}`, () => act(() => G.chooseAdvance(S, u.id)))); addBtn(bt, 'Stay', () => act(() => G.chooseAdvance(S, null))); }
  }
  function renderRepl() {
    const card = $('replcard'), box = $('repl'); if (G.phase(S) !== 'repl' || S.winner) { card.hidden = true; return; } card.hidden = false;
    const pl = G.pool(S, S.side); const later = S.units.filter((u) => u.side === S.side && u.step === 0 && S.turn < u.arrives);
    box.innerHTML = `<div class="odds">Steps left: <b>${S.repl}</b></div><div style="margin:6px 0 4px;font-size:.8rem;color:var(--muted)">Pool (rebuilt at half strength):</div>`;
    const wrap = document.createElement('div'); wrap.className = 'pool'; box.appendChild(wrap);
    if (!pl.length) wrap.innerHTML = '<span style="color:var(--muted);font-size:.8rem">empty</span>';
    pl.forEach((u) => { const c = document.createElement('span'); c.className = 'chip' + (poolSel === u.id ? ' sel' : ''); c.textContent = `${u.name} ${u.half}-${u.mv}`; if (local() && S.repl > 0) c.onclick = () => { poolSel = poolSel === u.id ? null : u.id; render(); }; wrap.appendChild(c); });
    if (later.length) box.insertAdjacentHTML('beforeend', `<div style="margin-top:6px;font-size:.78rem;color:var(--muted)">Arriving later: ${later.map((u) => `${u.name} (turn ${u.arrives})`).join(', ')}</div>`);
  }

  // ---------------- clicks ----------------
  svg.addEventListener('click', (e) => {
    if (!S || !local() || aiBusy) return;
    const unitEl = e.target.closest('.unit'); const hexEl = e.target.closest('[data-k]');
    const ph = G.phase(S); const b = S.battle;
    const k = unitEl ? byId(unitEl.dataset.id).hex : hexEl ? hexEl.dataset.k : null; if (!k) return;
    const u = G.unitAt(S, k);
    if (b) { if (b.stage === 'retreat' && b.retreatOpts.includes(k)) act(() => G.chooseRetreat(S, k)); return; }
    if (ph === 'repl') {
      if (poolSel && G.placementHexes(S, S.side).includes(k)) { const id = poolSel; poolSel = null; act(() => G.rebuild(S, id, k)); return; }
      if (u && u.side === S.side && u.step === 1) act(() => G.flip(S, u.id)); return;
    }
    if (ph === 'combat') {
      if (u && u.side !== S.side && G.targets(S).includes(u)) { attackSel = { target: u.id, ids: G.attackersFor(S, u.id).map((a) => a.id) }; render(); return; }
      if (u && u.side === S.side && attackSel) { const can = G.attackersFor(S, attackSel.target).some((a) => a.id === u.id); if (can) { const i = attackSel.ids.indexOf(u.id); if (i >= 0) attackSel.ids.splice(i, 1); else attackSel.ids.push(u.id); render(); } }
      return;
    }
    // movement phases
    if (u && u.side === S.side) { sel = sel === u.id ? null : (G.canMoveUnit(S, u) ? u.id : null); render(); return; }
    if (sel && !u) { const id = sel; if (G.reachable(S, byId(id)).has(k)) { sel = null; act(() => { if (G.move(S, id, k)) lastMoved.push(id); }); } else { sel = null; render(); } }
  });

  // ---------------- flow ----------------
  function act(fn) { fn(); afterAction(); }
  function afterAction() { render(); if (net) net.send(); scheduleAI(); }
  function isAI(side) { return mode === 'ai-IND' ? side === 'PAK' : mode === 'ai-PAK' ? side === 'IND' : false; }
  function scheduleAI() {
    if (aiBusy || !S || S.winner || !isAI(S.side)) return; aiBusy = true; render();
    const stepAI = () => { if (S.winner || !isAI(S.side)) { aiBusy = false; render(); return; } G.aiPlayPhase(S); G.endPhase(S); render(); setTimeout(stepAI, 650); };
    setTimeout(stepAI, 500);
  }

  // ---------------- start / rules ----------------
  function rulesHTML() { return `
    <h4>Goal</h4><p>At the end of turn 7, the side whose unit was <b>last to occupy Kargil</b> (red star) wins. India holds it at the start.</p>
    <h4>Turn sequence</h4><ul>
      <li><b>Pakistan:</b> replacements (1 step; none on turn 1) → light-infantry (▲) movement → combat → movement of all units.</li>
      <li><b>India:</b> replacements (5 steps) → road movement along NH1A (up to 4 hexes, from a road hex) → combat → movement of all units.</li></ul>
    <h4>Movement</h4><ul><li>Infantry move 4, light infantry 6. Valley costs 1, a peak costs 2. One unit per hex at the end of a move; you may pass through friends.</li>
      <li>Every unit has a <b>zone of control</b> over the 6 hexes around it. Entering an enemy ZOC stops you. You can't enter an enemy unit's hex.</li>
      <li><b>Storm (turns 3–4):</b> 1 hex per movement phase and attacks are halved. Road movement isn't affected.</li></ul>
    <h4>Combat</h4><ul><li>Attacking is voluntary. Each unit attacks once and each enemy is attacked once per phase. Add the attackers' strengths, divide by the defender's and round down (max 6:1).</li>
      <li>Shift one column left if the defender is on a peak, in Kargil, or (India only) in a fortified post; and one more if <i>every</i> attacker is across a river. Below 1:1 nothing happens.</li>
      <li>Retreats are exactly 2 hexes, chosen by the attacker, never into enemy ZOC. A unit that can't retreat is eliminated, so surround first. If the defender's hex empties, one attacker may advance into it.</li>
      <li>Units have two steps: full, then half (darker counter, ½), then gone. In an exchange (EX) the attacker must lose at least as much printed strength as the defender lost.</li></ul>
    <h4>Replacements</h4><ul><li>Restore a half-strength unit that can trace a path to its own map edge (free of enemy units and ZOC), or rebuild an eliminated unit at half strength on its own edge or in a friendly town in communication (one per town). India can always rebuild in Kargil while holding it. The 10-4 Bofors group joins India on turn 4.</li></ul>`; }
  $('rulesbody').innerHTML = rulesHTML();
  $('crt').innerHTML = '<tr><th>die</th>' + ['1:1', '2:1', '3:1', '4:1', '5:1', '6:1'].map((x) => `<th>${x}</th>`).join('') + '</tr>' + G.CRT.map((row, i) => `<tr><th>${i + 1}</th>${row.map((r) => `<td>${r}</td>`).join('')}</tr>`).join('');
  function openStart() { $('start').hidden = false; }
  function begin(m) {
    mode = m; me = m === 'ai-IND' ? 'IND' : m === 'ai-PAK' ? 'PAK' : null; S = G.newGame(); sel = attackSel = poolSel = null; lastMoved = [];
    $('start').hidden = true; drawBoard(); render(); scheduleAI();
  }
  document.querySelectorAll('.mode').forEach((b) => b.addEventListener('click', () => { const m = b.dataset.mode; if (m === 'host') hostOnline(); else { if (net) net.close(); net = null; begin(m); } }));
  $('newbtn').onclick = openStart; $('rulesbtn').onclick = openStart;
  $('start').addEventListener('click', (e) => { if (e.target.id === 'start' && S) $('start').hidden = true; });

  // ---------------- online (PeerJS) ----------------
  function makeNet(peer, onOpen) {
    const n = { peer, conn: null, status: 'connecting…', close() { try { peer.destroy(); } catch (e) {} },
      send() { if (n.conn && n.conn.open && S) n.conn.send({ t: 'state', state: S }); } };
    n.attach = (conn) => { n.conn = conn; conn.on('open', () => { n.status = '· online ✓'; onOpen && onOpen(conn); render(); });
      conn.on('data', (msg) => { if (msg.t === 'state' && msg.state) { S = msg.state; sel = attackSel = poolSel = null; lastMoved = []; render(); }
        if (msg.t === 'init') { me = msg.side; mode = 'online'; S = msg.state; $('start').hidden = true; drawBoard(); render(); } });
      conn.on('close', () => { n.status = '· opponent disconnected'; render(); }); };
    return n;
  }
  function code() { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; return Array.from({ length: 5 }, () => a[Math.floor(Math.random() * a.length)]).join(''); }
  function hostOnline() {
    if (typeof Peer === 'undefined') { $('startnet').textContent = 'Online play needs an internet connection.'; return; }
    if (net) net.close(); const c = code(); const peer = new Peer('kargil99-' + c);
    $('startnet').innerHTML = 'Creating room…';
    peer.on('open', () => { $('startnet').innerHTML = `Room code <b style="color:#f0a830;letter-spacing:.2em">${c}</b>: send it to your friend. Waiting for them to join…`; });
    peer.on('error', (e) => { $('startnet').textContent = 'Connection problem: ' + e.type; });
    net = makeNet(peer, (conn) => { mode = 'online'; me = 'IND'; S = G.newGame(); conn.send({ t: 'init', side: 'PAK', state: S }); $('start').hidden = true; drawBoard(); render(); });
    peer.on('connection', (conn) => { if (net.conn) { conn.close(); return; } net.attach(conn); });
  }
  $('joinbtn').onclick = () => {
    const c = $('joincode').value.trim().toUpperCase(); if (c.length !== 5) { $('startnet').textContent = 'Enter the 5-letter code.'; return; }
    if (typeof Peer === 'undefined') { $('startnet').textContent = 'Online play needs an internet connection.'; return; }
    if (net) net.close(); const peer = new Peer(); $('startnet').textContent = 'Joining…';
    net = makeNet(peer, null);
    peer.on('open', () => { const conn = peer.connect('kargil99-' + c, { reliable: true }); net.attach(conn); });
    peer.on('error', (e) => { $('startnet').textContent = e.type === 'peer-unavailable' ? 'No room with that code.' : 'Connection problem: ' + e.type; });
  };

  drawBoard(); openStart();
  window.__kargil = { get state() { return S; }, begin };
})();
