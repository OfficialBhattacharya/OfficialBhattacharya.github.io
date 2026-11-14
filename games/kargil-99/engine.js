/* Kargil '99: rules engine and computer opponent.
   Pure functions over a plain-JSON state so the same code runs in the browser, in online play and in tests. */
(function (root) {
  'use strict';
  const COLS = 14, ROWS = 10;
  const K = (c, r) => c + ',' + r;
  const P = (k) => k.split(',').map(Number);
  const inMap = (c, r) => c >= 0 && c < COLS && r >= 0 && r < ROWS;

  function neighbours(c, r) {
    const d = c & 1 ? [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1]] : [[1, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [0, -1]];
    return d.map(([dc, dr]) => [c + dc, r + dr]).filter(([a, b]) => inMap(a, b));
  }
  function cube(c, r) { const x = c, z = r - (c - (c & 1)) / 2; return [x, -x - z, z]; }
  function dist(a, b) { const [x1, y1, z1] = cube(...a), [x2, y2, z2] = cube(...b); return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2)); }

  // ---------------- map ----------------
  const MAP = (() => {
    const peaks = { '1,4': 'Mushkoh Ridge', '2,4': 'Mushkoh Ridge', '3,4': 'Point 4875', '4,4': 'Tiger Hill', '5,5': 'Tololing', '6,4': 'Point 5140',
      '7,4': 'Kaksar', '8,4': 'Kaksar', '10,3': 'Jubar', '11,2': 'Khalubar', '12,3': 'Batalik Ridge', '13,2': 'Chorbat La',
      '2,2': '', '5,2': '', '7,2': '', '9,2': '', '0,3': '', '12,5': '', '3,8': '', '6,8': '', '9,8': '', '10,9': '', '1,1': '', '13,6': '' };
    const towns = { '0,8': ['Sonamarg', 'IND'], '4,6': ['Dras', 'IND'], '8,6': ['Kargil', 'IND'], '11,4': ['Batalik', 'IND'], '13,7': ['Khalsi', 'IND'], '3,0': ['Gultari', 'PAK'], '10,0': ['Olthingthang', 'PAK'] };
    const forts = { '1,7': 'Zoji La post', '4,7': 'Dras brigade', '9,7': 'Kargil brigade', '11,5': 'Batalik post' };
    const road = [[0, 8], [1, 7], [2, 7], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6], [12, 7], [13, 7]].map(([c, r]) => K(c, r));
    const rivers = new Set(); const rivNames = [];
    const between = (A, B, name) => { const sB = new Set(B.map(([c, r]) => K(c, r))); A.forEach(([c, r]) => neighbours(c, r).forEach(([a, b]) => { if (sB.has(K(a, b))) { rivers.add(K(c, r) + '|' + K(a, b)); rivers.add(K(a, b) + '|' + K(c, r)); rivNames.push([K(c, r), K(a, b), name]); } })); };
    const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
    between(range(1, 8).map((c) => [c, 2]), range(1, 8).map((c) => [c, 3]), 'Shingo');
    between(range(2, 7).map((c) => [c, 5]), range(2, 7).map((c) => [c, 6]), 'Dras');
    between(range(2, 5).map((r) => [8, r]), range(2, 5).map((r) => [9, r]), 'Suru');
    between(range(10, 13).map((c) => [c, 4]), range(10, 13).map((c) => [c, 5]), 'Indus');
    const edges = { PAK: new Set(range(0, COLS - 1).map((c) => K(c, 0))),
      IND: new Set([...range(0, COLS - 1).map((c) => K(c, ROWS - 1)), ...range(6, 9).map((r) => K(0, r)), ...range(5, 9).map((r) => K(COLS - 1, r))]) };
    return { peaks, towns, forts, road: new Set(road), roadList: road, rivers, rivNames, edges, objective: '8,6' };
  })();

  const TURNS = [
    { name: 'May I', note: 'Intrusion discovered. No Pakistani replacements.' },
    { name: 'May II', note: 'Indian reinforcements roll up NH1A.' },
    { name: 'Jun I', storm: true, note: 'Storm: 1 hex per move phase, attacks at ½. Road movement unaffected.' },
    { name: 'Jun II', storm: true, note: 'Storm continues. Bofors group joins the Indian pool.' },
    { name: 'Jul I', note: 'Weather clears.' },
    { name: 'Jul II', note: '' },
    { name: 'Jul III', note: 'Last turn: last side to occupy Kargil wins.' },
  ];
  const PHASES = { PAK: ['repl', 'fast', 'combat', 'move'], IND: ['repl', 'road', 'combat', 'move'] };
  const PHASE_NAME = { repl: 'Replacements', fast: 'Light-infantry movement', road: 'NH1A road movement', combat: 'Combat', move: 'Movement' };
  const CRT = [ // rows: die 1..6, cols: 1:1..6:1
    ['DR', 'DR', 'DR', 'DR', 'DR', 'DRL'], ['EX', 'DR', 'DR', 'DR', 'DRL', 'DE'], ['EX', 'EX', 'DR', 'EX', 'DRL', 'DE'],
    ['NE', 'EX', 'EX', 'DRL', 'DE', 'DE'], ['NE', 'NE', 'EX', 'DRL', 'DE', 'DE'], ['AL', 'NE', 'DRL', 'DE', 'DE', 'DE']];
  const HALF = { 12: 6, 10: 5, 9: 4, 8: 4, 7: 4, 6: 3, 5: 2, 4: 2 };

  function newGame() {
    const U = [];
    const ind = (id, name, c, r, full = 8, step = 1, avail = 1) => U.push({ id, side: 'IND', name, full, half: HALF[full], mv: 4, fast: false, step: c == null ? 0 : step, hex: c == null ? null : K(c, r), arrives: avail });
    const pak = (id, name, c, r, full, fast) => U.push({ id, side: 'PAK', name, full, half: HALF[full], mv: fast ? 6 : 4, fast, step: 2, hex: K(c, r), arrives: 1 });
    ind('i1', '1/11 GR', 1, 7); ind('i2', '8 SIKH', 2, 6); ind('i3', '18 GREN', 4, 6); ind('i4', '2 RAJ RIF', 5, 6); ind('i5', '13 JAK RIF', 7, 5);
    ind('i6', '12 JAK LI', 8, 6); ind('i7', '17 JAT', 9, 5); ind('i8', 'LADAKH SCOUTS', 11, 4); ind('i9', '1 BIHAR', 12, 5);
    ind('i10', '2 NAGA', null); ind('i11', '18 GARH', null); ind('i12', '16 GREN', null); ind('i13', 'BOFORS GP', null, null, 10, 0, 4);
    pak('p1', 'NLI 5', 4, 1, 12, true); pak('p2', 'NLI 6', 6, 1, 10, true); pak('p3', 'NLI 12', 10, 1, 10, true); pak('p4', 'NLI 4', 8, 1, 9, true); pak('p5', 'SSG', 2, 1, 8, true);
    pak('p6', 'NLI 3', 5, 0, 8, false); pak('p7', 'INF GP A', 1, 0, 7, false); pak('p8', 'INF GP B', 7, 0, 7, false); pak('p9', 'INF GP C', 9, 0, 6, false);
    pak('p10', 'INF GP D', 11, 0, 6, false); pak('p11', 'INF GP E', 12, 1, 5, false); pak('p12', 'MTN ARTY', 6, 0, 4, false);
    const s = { v: 1, turn: 1, side: 'PAK', ph: 0, units: U, objOwner: 'IND', townOwner: {}, moved: {}, prevHex: {}, attacked: {}, defended: {}, battle: null, pending: null,
      repl: 0, replTowns: {}, log: [], winner: null, seq: 0 };
    Object.entries(MAP.towns).forEach(([k, [, side]]) => (s.townOwner[k] = side));
    startPhase(s); return s;
  }

  // ---------------- helpers ----------------
  const enemy = (side) => (side === 'PAK' ? 'IND' : 'PAK');
  const phase = (s) => PHASES[s.side][s.ph];
  const storm = (s) => !!TURNS[s.turn - 1].storm;
  const unitAt = (s, k) => s.units.find((u) => u.hex === k && u.step > 0);
  const strength = (u) => (u.step === 2 ? u.full : u.step === 1 ? u.half : 0);
  const onMap = (s, side) => s.units.filter((u) => u.step > 0 && u.hex && (!side || u.side === side));
  function zocSet(s, side) { const z = new Set(); onMap(s, enemy(side)).forEach((u) => neighbours(...P(u.hex)).forEach(([c, r]) => z.add(K(c, r)))); return z; }
  const terrain = (k) => (MAP.peaks[k] !== undefined ? 'peak' : 'clear');
  function log(s, msg) { s.log.push(`T${s.turn} ${s.side}: ${msg}`); if (s.log.length > 200) s.log.shift(); }
  function occupy(s, u) { if (u.hex === MAP.objective) s.objOwner = u.side; if (MAP.towns[u.hex]) s.townOwner[u.hex] = u.side; }

  // ---------------- movement ----------------
  function reachable(s, u) {
    const ph = phase(s); const out = new Map(); if (!u.hex || u.step <= 0 || s.moved[u.id]) return out;
    const zoc = zocSet(s, u.side); const start = u.hex;
    if (ph === 'road') {
      if (!MAP.road.has(start)) return out;
      const seen = new Map([[start, 0]]); const q = [start];
      while (q.length) { const k = q.shift(); const d = seen.get(k); if (d >= 4 || (k !== start && zoc.has(k))) continue;
        neighbours(...P(k)).forEach(([c, r]) => { const n = K(c, r); if (!MAP.road.has(n) || seen.has(n)) return; const o = unitAt(s, n); if (o && o.side !== u.side) return; seen.set(n, d + 1); q.push(n); }); }
      seen.forEach((d, k) => { if (k !== start && !unitAt(s, k)) out.set(k, d); }); return out;
    }
    const mv = storm(s) ? 1 : u.mv; const best = new Map([[start, 0]]); const pq = [[0, start]];
    while (pq.length) { pq.sort((a, b) => a[0] - b[0]); const [d, k] = pq.shift(); if (d > best.get(k)) continue; if (k !== start && zoc.has(k)) continue;
      neighbours(...P(k)).forEach(([c, r]) => { const n = K(c, r); const o = unitAt(s, n); if (o && o.side !== u.side) return;
        const cost = storm(s) ? 1 : terrain(n) === 'peak' ? 2 : 1; const nd = d + cost; if (nd > mv) return; if (!best.has(n) || nd < best.get(n)) { best.set(n, nd); pq.push([nd, n]); } }); }
    best.forEach((d, k) => { if (k !== start && !unitAt(s, k)) out.set(k, d); }); return out;
  }
  function canMoveUnit(s, u) {
    const ph = phase(s); if (u.side !== s.side || u.step <= 0 || !u.hex || s.moved[u.id]) return false;
    if (ph === 'fast') return u.fast; if (ph === 'road') return MAP.road.has(u.hex); return ph === 'move';
  }
  function move(s, id, to) {
    const u = s.units.find((x) => x.id === id); if (!u || !canMoveUnit(s, u)) return false; if (!reachable(s, u).has(to)) return false;
    s.prevHex[id] = u.hex; u.hex = to; s.moved[id] = true; occupy(s, u); log(s, `${u.name} moves to ${hexName(to)}`); s.seq++; return true;
  }
  function undoMove(s, id) { const u = s.units.find((x) => x.id === id); if (!u || !s.prevHex[id]) return false; const back = s.prevHex[id]; if (unitAt(s, back)) return false; u.hex = back; delete s.prevHex[id]; delete s.moved[id]; occupy(s, u); s.seq++; return true; }

  // ---------------- combat ----------------
  function attackersFor(s, targetId) { const t = s.units.find((x) => x.id === targetId); if (!t) return []; const adj = new Set(neighbours(...P(t.hex)).map(([c, r]) => K(c, r)));
    return onMap(s, s.side).filter((u) => adj.has(u.hex) && !s.attacked[u.id]); }
  function targets(s) { if (phase(s) !== 'combat') return []; return onMap(s, enemy(s.side)).filter((t) => !s.defended[t.id] && attackersFor(s, t.id).length); }
  function odds(s, targetId, attIds) {
    const t = s.units.find((x) => x.id === targetId); const atts = attIds.map((id) => s.units.find((x) => x.id === id));
    let att = atts.reduce((a, u) => a + strength(u), 0); if (storm(s)) att = att / 2; const def = strength(t);
    let ratio = Math.min(6, Math.floor(att / def)); const shifts = [];
    if (terrain(t.hex) === 'peak') shifts.push('defender on a peak'); else if (t.hex === MAP.objective) shifts.push('defender in Kargil'); else if (MAP.forts[t.hex] && t.side === 'IND') shifts.push('Indian fortified post');
    if (atts.length && atts.every((u) => MAP.rivers.has(u.hex + '|' + t.hex))) shifts.push('all attackers across a river');
    const col = ratio - Math.min(2, shifts.length);
    return { att, def, ratio, shifts, col, label: col >= 1 ? `${col}:1` : 'below 1:1' };
  }
  function lossOf(u) { return u.step === 2 ? u.full - u.half : u.half; }
  function stepLoss(s, u) { const lost = lossOf(u); u.step -= 1; if (u.step <= 0) { u.step = 0; u.hex = null; } return lost; }
  function retreatOptions(s, t) {
    const z = zocSet(s, t.side); const start = t.hex; const res = new Set();
    const ok = (k) => !z.has(k) && !(unitAt(s, k) && unitAt(s, k).side !== t.side);
    neighbours(...P(start)).forEach(([c1, r1]) => { const a = K(c1, r1); if (!ok(a)) return;
      neighbours(c1, r1).forEach(([c2, r2]) => { const b = K(c2, r2); if (b === start || dist(P(b), P(start)) !== 2 || !ok(b)) return;
        const o = unitAt(s, b); if (!o || o.id === t.id) res.add(b); else neighbours(c2, r2).forEach(([c3, r3]) => { const c = K(c3, r3); if (dist(P(c), P(start)) === 3 && ok(c) && !unitAt(s, c)) res.add(c); }); }); });
    return [...res];
  }
  function startBattle(s, targetId, attIds, die) {
    if (phase(s) !== 'combat' || s.battle || s.pending) return null; const t = s.units.find((x) => x.id === targetId); if (!t || s.defended[targetId]) return null;
    const valid = new Set(attackersFor(s, targetId).map((u) => u.id)); if (!attIds.length || !attIds.every((id) => valid.has(id))) return null;
    const o = odds(s, targetId, attIds); const res = o.col >= 1 ? CRT[die - 1][o.col - 1] : 'NE';
    attIds.forEach((id) => (s.attacked[id] = true)); s.defended[targetId] = true;
    const atk = attIds.map((id) => s.units.find((x) => x.id === id));
    log(s, `${atk.map((u) => u.name).join(' + ')} attack ${t.name} at ${o.label}${o.shifts.length ? ' (' + o.shifts.join(', ') + ')' : ''}. Die ${die}: ${res}`);
    const b = { target: targetId, attackers: attIds, die, res, odds: o, from: t.hex, stage: 'done' }; s.battle = b; s.seq++;
    let mustRetreat = false;
    if (res === 'DE') { while (t.step > 0) stepLoss(s, t); log(s, `${t.name} eliminated`); }
    else if (res === 'DRL') { stepLoss(s, t); if (t.step > 0) mustRetreat = true; else log(s, `${t.name} eliminated`); }
    else if (res === 'DR') mustRetreat = true;
    else if (res === 'AL') { b.stage = 'al'; }
    else if (res === 'EX') { const lost = stepLoss(s, t); b.exNeed = lost; b.stage = 'ex'; if (t.step > 0) b.thenRetreat = true; else log(s, `${t.name} eliminated`); }
    if (mustRetreat) b.stage = 'retreat';
    if (b.stage === 'retreat') prepRetreat(s, b);
    if (b.stage === 'done') prepAdvance(s, b);
    return b;
  }
  function prepRetreat(s, b) { const t = s.units.find((x) => x.id === b.target); const opts = retreatOptions(s, t); if (!opts.length) { while (t.step > 0) stepLoss(s, t); log(s, `${t.name} cannot retreat and is eliminated`); b.stage = 'done'; prepAdvance(s, b); } else { b.stage = 'retreat'; b.retreatOpts = opts; } }
  function prepAdvance(s, b) { const t = s.units.find((x) => x.id === b.target); const vacated = !unitAt(s, b.from); const cand = b.attackers.filter((id) => { const u = s.units.find((x) => x.id === id); return u.step > 0 && u.hex; });
    if (vacated && cand.length) { b.stage = 'advance'; b.advanceIds = cand; } else finishBattle(s); }
  function finishBattle(s) { s.battle = null; s.seq++; }
  function chooseRetreat(s, hex) { const b = s.battle; if (!b || b.stage !== 'retreat' || !b.retreatOpts.includes(hex)) return false; const t = s.units.find((x) => x.id === b.target); t.hex = hex; occupy(s, t); log(s, `${t.name} retreats to ${hexName(hex)}`); s.seq++; prepAdvance(s, b); return true; }
  function chooseAdvance(s, id) { const b = s.battle; if (!b || b.stage !== 'advance') return false; if (id) { if (!b.advanceIds.includes(id) || unitAt(s, b.from)) return false; const u = s.units.find((x) => x.id === id); u.hex = b.from; occupy(s, u); log(s, `${u.name} advances into ${hexName(b.from)}`); } finishBattle(s); return true; }
  function chooseLoss(s, ids) { // ids: attacker unit ids each losing one step (AL: exactly one; EX: total >= need)
    const b = s.battle; if (!b || (b.stage !== 'al' && b.stage !== 'ex')) return false; const units = ids.map((id) => s.units.find((x) => x.id === id));
    if (!ids.length || !ids.every((id) => b.attackers.includes(id))) return false; if (b.stage === 'al' && ids.length !== 1) return false;
    if (b.stage === 'ex') { const tot = units.reduce((a, u) => a + lossOf(u), 0); if (tot < b.exNeed && ids.length < b.attackers.filter((id) => s.units.find((x) => x.id === id).step > 0).length) return false; }
    units.forEach((u) => { stepLoss(s, u); log(s, `${u.name} loses a step${u.step === 0 ? ' and is eliminated' : ''}`); });
    if (b.stage === 'ex' && b.thenRetreat) { prepRetreat(s, b); } else { b.stage = 'done'; prepAdvance(s, b); } s.seq++; return true;
  }
  function autoLoss(s) { // cheapest choice that satisfies the rule
    const b = s.battle; const atts = b.attackers.map((id) => s.units.find((x) => x.id === id)).filter((u) => u.step > 0);
    if (b.stage === 'al') { atts.sort((a, c) => lossOf(a) - lossOf(c)); return [atts[0].id]; }
    let best = null; const n = atts.length;
    for (let m = 1; m < 1 << n; m++) { const pick = atts.filter((_, i) => m & (1 << i)); const tot = pick.reduce((a, u) => a + lossOf(u), 0); if (tot >= b.exNeed && (!best || tot < best.tot || (tot === best.tot && pick.length < best.pick.length))) best = { tot, pick }; }
    return (best ? best.pick : atts).map((u) => u.id);
  }

  // ---------------- replacements ----------------
  function inComm(s, side, k) { // path to own edge avoiding enemy units and enemy ZOC
    const z = zocSet(s, side); const seen = new Set([k]); const q = [k];
    while (q.length) { const h = q.shift(); if (MAP.edges[side].has(h)) return true;
      neighbours(...P(h)).forEach(([c, r]) => { const n = K(c, r); if (seen.has(n)) return; const o = unitAt(s, n); if (o && o.side !== side) return; if (z.has(n)) return; seen.add(n); q.push(n); }); }
    return false;
  }
  function placementHexes(s, side) {
    const z = zocSet(s, side); const out = [];
    MAP.edges[side].forEach((k) => { if (!unitAt(s, k) && !z.has(k)) out.push(k); });
    Object.keys(MAP.towns).forEach((k) => { if (s.townOwner[k] !== side || unitAt(s, k) || s.replTowns[k]) return; if (side === 'IND' && k === MAP.objective) { out.push(k); return; } if (!z.has(k) && inComm(s, side, k)) out.push(k); });
    return [...new Set(out)];
  }
  function pool(s, side) { return s.units.filter((u) => u.side === side && u.step === 0 && s.turn >= u.arrives); }
  function flippable(s, side) { return onMap(s, side).filter((u) => u.step === 1 && inComm(s, side, u.hex)); }
  function rebuild(s, id, hex) { if (phase(s) !== 'repl' || s.repl <= 0) return false; const u = s.units.find((x) => x.id === id); if (!u || u.side !== s.side || u.step !== 0 || s.turn < u.arrives) return false;
    if (!placementHexes(s, s.side).includes(hex)) return false; u.step = 1; u.hex = hex; if (MAP.towns[hex]) s.replTowns[hex] = true; occupy(s, u); s.repl--; log(s, `${u.name} rebuilt at ${hexName(hex)}`); s.seq++; return true; }
  function flip(s, id) { if (phase(s) !== 'repl' || s.repl <= 0) return false; const u = s.units.find((x) => x.id === id); if (!u || !flippable(s, s.side).includes(u)) return false; u.step = 2; s.repl--; log(s, `${u.name} restored to full strength`); s.seq++; return true; }

  // ---------------- phases ----------------
  function startPhase(s) {
    s.moved = {}; s.prevHex = {}; s.attacked = {}; s.defended = {}; s.battle = null; s.replTowns = {};
    const ph = phase(s);
    if (ph === 'repl') { s.repl = s.side === 'PAK' ? (s.turn === 1 ? 0 : 1) : 5; if (s.turn === 4 && s.side === 'IND') log(s, 'BOFORS GP (10-4) joins the Indian pool'); }
    else s.repl = 0;
  }
  function endPhase(s) {
    if (s.battle || s.winner) return false;
    s.ph++;
    if (s.ph >= 4) { s.ph = 0; if (s.side === 'PAK') s.side = 'IND'; else { s.side = 'PAK'; s.turn++; if (s.turn > 7) { s.turn = 7; s.winner = s.objOwner; log(s, `Game over: ${s.winner === 'IND' ? 'India' : 'Pakistan'} holds Kargil`); s.seq++; return true; } } }
    startPhase(s); s.seq++; return true;
  }
  function hexName(k) { return MAP.towns[k] ? MAP.towns[k][0] : MAP.peaks[k] ? MAP.peaks[k] : MAP.forts[k] ? MAP.forts[k] : `hex ${k}`; }

  // ---------------- computer opponent ----------------
  const OBJ = P(MAP.objective);
  function threat(s, side, k) { return neighbours(...P(k)).reduce((a, [c, r]) => { const o = unitAt(s, K(c, r)); return a + (o && o.side !== side ? strength(o) : 0); }, 0); }
  function defValue(k, side) { return (terrain(k) === 'peak' ? 3 : 0) + (k === MAP.objective ? 3 : 0) + (MAP.forts[k] && side === 'IND' ? 3 : 0); }
  function scoreHex(s, u, k) {
    const d = dist(P(k), OBJ); const th = threat(s, u.side, k); const def = defValue(k, u.side);
    if (u.side === 'PAK') { const adjEnemy = th > 0; return -d * 4 + def * 1.2 + (adjEnemy ? 2 : 0) - (th > strength(u) * 2 ? th * 0.3 : 0) + (MAP.towns[k] && s.townOwner[k] === 'IND' ? 2 : 0); }
    // India: hold Kargil, block the shortest approaches, stand on good ground near the enemy
    const enemies = onMap(s, 'PAK'); const nearestE = enemies.length ? Math.min(...enemies.map((e) => dist(P(e.hex), P(k)))) : 9;
    const enemyToObj = enemies.length ? Math.min(...enemies.map((e) => dist(P(e.hex), OBJ))) : 9;
    let v = def * 1.5 - Math.abs(nearestE - 1) * 1.5 - Math.max(0, d - enemyToObj) * 2;
    if (k === MAP.objective) v += 12; if (MAP.road.has(k)) v += 0.5; v -= th > strength(u) * 3 ? 3 : 0; return v;
  }
  function aiMovePhase(s) {
    const side = s.side; const units = onMap(s, side).filter((u) => canMoveUnit(s, u)).sort((a, b) => dist(P(a.hex), OBJ) - dist(P(b.hex), OBJ));
    for (const u of units) { if (!canMoveUnit(s, u)) continue;
      if (side === 'IND' && u.hex === MAP.objective) continue; // the Kargil garrison stays
      const opts = reachable(s, u); let best = u.hex, bv = scoreHex(s, u, u.hex) + 0.5; opts.forEach((_, k) => { const v = scoreHex(s, u, k); if (v > bv) { bv = v; best = k; } });
      if (best !== u.hex) move(s, u.id, best); }
    if (side === 'IND' && !unitAt(s, MAP.objective)) { // make sure someone holds Kargil
      const cands = onMap(s, 'IND').filter((u) => canMoveUnit(s, u) && reachable(s, u).has(MAP.objective)); if (cands.length) move(s, cands[0].id, MAP.objective); }
  }
  const EV = (() => { const v = [0, 0, 0, 0, 0, 0]; for (let c = 0; c < 6; c++) for (let d = 0; d < 6; d++) { const r = CRT[d][c]; v[c] += ({ NE: 0, DR: 0.7, DRL: 1.4, DE: 2.2, EX: 0.3, AL: -0.8 })[r] / 6; } return v; })();
  function aiCombatPhase(s, rnd) {
    for (let guard = 0; guard < 30; guard++) {
      const ts = targets(s); if (!ts.length) return; let best = null;
      ts.forEach((t) => { const atts = attackersFor(s, t.id); const ids = atts.map((u) => u.id); const o = odds(s, t.id, ids); if (o.col < 1) return;
        const trapped = retreatOptions(s, t).length === 0; let v = EV[Math.min(6, o.col) - 1] + (trapped ? 1.5 : 0) + (t.hex === MAP.objective ? 1.5 : 0) + (s.side === 'IND' && dist(P(t.hex), OBJ) <= 2 ? 1 : 0);
        // use the fewest attackers that reach the same column
        let use = ids; const sorted = [...atts].sort((a, b) => strength(b) - strength(a)); for (let n = 1; n <= sorted.length; n++) { const sub = sorted.slice(0, n).map((u) => u.id); if (odds(s, t.id, sub).col >= o.col) { use = sub; break; } }
        const need = s.side === 'PAK' ? 0.55 : 0.75; if (v >= need && (!best || v > best.v)) best = { v, t: t.id, ids: use }; });
      if (!best) return;
      startBattle(s, best.t, best.ids, 1 + Math.floor(rnd() * 6)); aiResolve(s);
    }
  }
  function aiResolve(s) {
    for (let g = 0; g < 10 && s.battle; g++) { const b = s.battle;
      if (b.stage === 'al' || b.stage === 'ex') chooseLoss(s, autoLoss(s));
      else if (b.stage === 'retreat') { const t = s.units.find((x) => x.id === b.target); const opts = [...b.retreatOpts].sort((a, c) => (t.side === 'IND' ? dist(P(c), OBJ) - dist(P(a), OBJ) : dist(P(a), OBJ) - dist(P(c), OBJ)) || (defValue(a, t.side) - defValue(c, t.side))); chooseRetreat(s, opts[0]); }
      else if (b.stage === 'advance') { const target = b.from; const worth = s.side === 'PAK' ? true : (target === MAP.objective || defValue(target, 'IND') > 0 || dist(P(target), OBJ) <= 2); const ids = [...b.advanceIds].sort((a, c) => strength(s.units.find((x) => x.id === c)) - strength(s.units.find((x) => x.id === a))); chooseAdvance(s, worth ? ids[0] : null); }
      else finishBattle(s); }
  }
  function aiReplace(s) {
    const side = s.side;
    for (let g = 0; g < 10 && s.repl > 0; g++) {
      const fl = flippable(s, side).sort((a, b) => dist(P(a.hex), OBJ) - dist(P(b.hex), OBJ)); const pl = pool(s, side); const hexes = placementHexes(s, side).sort((a, b) => dist(P(a), OBJ) - dist(P(b), OBJ));
      const front = fl.find((u) => threat(s, side, u.hex) > 0 || dist(P(u.hex), OBJ) <= 2);
      if (front) { flip(s, front.id); continue; }
      if (pl.length && hexes.length) { pl.sort((a, b) => b.full - a.full); rebuild(s, pl[0].id, hexes[0]); continue; }
      if (fl.length) { flip(s, fl[0].id); continue; } break;
    }
  }
  function aiPlayPhase(s, rnd = Math.random) {
    if (s.winner) return; const ph = phase(s);
    if (ph === 'repl') aiReplace(s); else if (ph === 'combat') aiCombatPhase(s, rnd); else aiMovePhase(s);
    if (s.battle) aiResolve(s);
  }

  const api = { COLS, ROWS, MAP, TURNS, PHASES, PHASE_NAME, CRT, K, P, neighbours, dist, newGame, phase, storm, unitAt, strength, onMap, zocSet, terrain, reachable, canMoveUnit, move, undoMove,
    attackersFor, targets, odds, startBattle, chooseRetreat, chooseAdvance, chooseLoss, autoLoss, retreatOptions, inComm, placementHexes, pool, flippable, rebuild, flip, endPhase, hexName, aiPlayPhase, enemy };
  if (typeof module !== 'undefined') module.exports = api; else root.Kargil = api;
})(typeof window !== 'undefined' ? window : globalThis);
