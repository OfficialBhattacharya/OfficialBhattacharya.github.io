/* =====================================================================
   THE COLLECTOR'S CABINET: app.js
   Renders Coins, Notes and Stamps from data.js (window.COLLECTION).
   No build step.
   ===================================================================== */
(function () {
    'use strict';

    const COLLECTION = window.COLLECTION || {};
    const KINDS = {
        coins: {
            label: 'Coins', one: 'coin', many: 'coins', folder: 'coins', faces: ['Obverse', 'Reverse'],
            tags: (n) => [n.catalog, n.composition],
            specs: (n) => [['Country', n.country], ['Issuer', n.authority], ['Date', n.year, 1], ['Era', eraOf(n)],
                ['Catalogue', n.catalog, 1], ['Composition', n.composition], ['Weight', n.weight, 1], ['Diameter', n.diameter, 1],
                ['Mint', n.mint], ['Mint mark', n.mintMark], ['Edge', n.edge], ['Grade', n.condition], ['Acquired', n.acquired]],
        },
        notes: {
            label: 'Notes', one: 'note', many: 'notes', folder: 'notes', faces: ['Obverse', 'Reverse'],
            tags: (n) => [n.pick, n.serial],
            specs: (n) => [['Country', n.country], ['Issuer', n.authority], ['Date', n.year, 1], ['Era', eraOf(n)],
                ['Catalogue', n.pick, 1], ['Series', n.series], ['Serial', n.serial, 1], ['Signatures', n.signatures],
                ['Size', n.dimensions, 1], ['Grade', n.condition], ['Acquired', n.acquired]],
        },
        stamps: {
            label: 'Stamps', one: 'stamp', many: 'stamps', folder: 'stamps', faces: ['Front', 'Back'],
            tags: (n) => [n.catalog, n.gum],
            specs: (n) => [['Country', n.country], ['Issuer', n.authority], ['Date', n.year, 1], ['Era', eraOf(n)],
                ['Catalogue', n.catalog, 1], ['Theme', n.theme], ['Perforation', n.perforation, 1], ['Watermark', n.watermark],
                ['Printing', n.printing], ['Gum', n.gum], ['Size', n.dimensions, 1], ['Grade', n.condition], ['Acquired', n.acquired]],
        },
    };
    Object.keys(KINDS).forEach((k) => { if (!Array.isArray(COLLECTION[k])) COLLECTION[k] = []; });
    let kind = 'notes';
    let ITEMS = COLLECTION[kind];
    const K = () => KINDS[kind];
    const imgPath = (n, side) => (side === 'front' ? n.front : n.back) || `images/${K().folder}/${n.id}-${side}.jpg`;
    const faceName = (side) => K().faces[side === 'front' ? 0 : 1];
    const hasAnime = typeof window.anime === 'function';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = hasAnime && !reduceMotion;
    const SPRING = 'spring(1, 90, 13, 0)';

    // Run an anime.js animation, but force it to its end state if frames
    // never arrive (background tab, throttled webview) so nothing stays invisible.
    function play(params) {
        let fired = false;
        const userComplete = params.complete;
        const finish = () => { if (!fired) { fired = true; if (userComplete) userComplete(); } };
        const a = anime(Object.assign({}, params, { complete: finish }));
        setTimeout(() => { if (!a.completed) { a.pause(); a.seek(a.duration); finish(); } }, (a.duration || 1000) + 800);
        return a;
    }

    const ERAS = ['Pre-1900', '1900–1945', '1946–1979', '1980–1999', '2000–Present'];

    const $ = (sel, root = document) => root.querySelector(sel);
    const els = {
        gallery: $('#gallery'),
        empty: $('#emptyState'),
        count: $('#resultCount'),
        country: $('#filterCountry'),
        era: $('#filterEra'),
        denom: $('#filterDenom'),
        search: $('#filterSearch'),
        reset: $('#resetFilters'),
        modal: $('#modal'),
        panel: $('.modal-panel'),
        stage: $('#viewerStage'),
        img: $('#viewerImg'),
        loupe: $('#loupe'),
        zoomLevel: $('#zoomLevel'),
        loupeToggle: $('#loupeToggle'),
    };

    /* ---------- Helpers ---------- */
    const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function firstYear(note) {
        const m = String(note.year ?? '').match(/\d{4}/);
        return m ? parseInt(m[0], 10) : null;
    }

    function eraOf(note) {
        if (note.era) return note.era;
        const y = firstYear(note);
        if (y == null) return 'Unknown';
        if (y < 1900) return ERAS[0];
        if (y <= 1945) return ERAS[1];
        if (y <= 1979) return ERAS[2];
        if (y <= 1999) return ERAS[3];
        return ERAS[4];
    }

    function faceValue(note) {
        if (typeof note.faceValue === 'number') return note.faceValue;
        const m = String(note.denomination ?? '').replace(/,/g, '').match(/[\d.]+/);
        return m ? parseFloat(m[0]) : 0;
    }

    function placeholderHTML(note, side) {
        return `<div class="placeholder"><div><strong>${esc(note.denomination)}</strong>${esc(note.country)}<br><small>${faceName(side)}: add image</small></div></div>`;
    }

    // Swap a broken <img> for an engraved-style placeholder
    function guardImage(img, note, side) {
        img.addEventListener('error', () => {
            const wrap = document.createElement('div');
            wrap.innerHTML = placeholderHTML(note, side);
            img.replaceWith(wrap.firstElementChild);
        }, { once: true });
    }

    /* ---------- Ledger stats ---------- */
    function renderStats() {
        const real = ITEMS.filter((n) => !n.sample);
        const pool = real.length ? real : ITEMS;
        $('#statNotes').textContent = real.length;
        $('#statLabel').textContent = K().label;
        $('#statCountries').textContent = new Set(real.map((n) => n.country)).size;
        const years = pool.map(firstYear).filter((y) => y != null);
        $('#statSpan').textContent = real.length && years.length
            ? (Math.min(...years) === Math.max(...years) ? `${years[0]}` : `${Math.min(...years)}–${Math.max(...years)}`)
            : '—';
    }

    /* ---------- Filters ---------- */
    function fillSelect(select, values) {
        values.forEach((v) => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v;
            select.appendChild(o);
        });
    }

    function buildFilters() {
        [els.country, els.era, els.denom].forEach((sel) => { sel.length = 1; sel.value = ''; });
        els.search.value = '';
        const countries = [...new Set(ITEMS.map((n) => n.country))].sort((a, b) => a.localeCompare(b));
        const eras = ERAS.filter((e) => ITEMS.some((n) => eraOf(n) === e));
        if (ITEMS.some((n) => eraOf(n) === 'Unknown')) eras.push('Unknown');
        const denoms = [...new Map(ITEMS.map((n) => [n.denomination, faceValue(n)])).entries()]
            .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
            .map(([d]) => d);
        fillSelect(els.country, countries);
        fillSelect(els.era, eras);
        fillSelect(els.denom, denoms);
    }

    function currentFilter() {
        const q = els.search.value.trim().toLowerCase();
        return ITEMS.filter((n) => {
            if (els.country.value && n.country !== els.country.value) return false;
            if (els.era.value && eraOf(n) !== els.era.value) return false;
            if (els.denom.value && n.denomination !== els.denom.value) return false;
            if (q) {
                const hay = Object.values(n).flat().join(' ').toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }

    /* ---------- Gallery ---------- */
    function cardHTML(n) {
        const [t1, t2] = K().tags(n);
        const tags = [
            t1 && `<span class="tag pick">${esc(t1)}</span>`,
            n.condition && `<span class="tag">${esc(n.condition)}</span>`,
            t2 && `<span class="tag serial">${esc(t2)}</span>`,
            n.sample && `<span class="tag sample">Sample</span>`,
        ].filter(Boolean).join('');
        const [F, B] = K().faces;
        return `
        <article class="note-card" data-id="${esc(n.id)}">
            <div class="plate" role="button" tabindex="0" aria-label="Flip ${esc(n.denomination)}, ${esc(n.country)}" aria-pressed="false">
                <button class="inspect-btn" type="button" aria-label="Inspect ${esc(n.denomination)}"><i class="fas fa-magnifying-glass-plus"></i></button>
                <div class="plate-inner">
                    <div class="face front">
                        <img src="${esc(imgPath(n, 'front'))}" alt="${F} of ${esc(n.denomination)}, ${esc(n.country)}" loading="lazy">
                        <span class="face-label">${F}</span>
                    </div>
                    <div class="face back">
                        <img src="${esc(imgPath(n, 'back'))}" alt="${B} of ${esc(n.denomination)}, ${esc(n.country)}" loading="lazy">
                        <span class="face-label">${B}</span>
                    </div>
                </div>
            </div>
            <div class="caption">
                <div class="caption-top">
                    <h3>${esc(n.denomination)}</h3>
                    <span class="year">${esc(n.year)}</span>
                </div>
                <p class="country">${esc(n.country)}${n.authority ? ` · ${esc(n.authority)}` : ''}</p>
                <div class="meta">${tags}</div>
            </div>
        </article>`;
    }

    function render(list) {
        els.gallery.innerHTML = list.map(cardHTML).join('');
        els.empty.hidden = list.length > 0;
        els.count.textContent = `${list.length} of ${ITEMS.length} ${ITEMS.length === 1 ? K().one : K().many}`;

        els.gallery.querySelectorAll('.note-card').forEach((card) => {
            const note = ITEMS.find((n) => n.id === card.dataset.id);
            card.querySelectorAll('.face img').forEach((img) => guardImage(img, note, img.closest('.face').classList.contains('front') ? 'front' : 'back'));
        });

        const cards = els.gallery.querySelectorAll('.note-card');
        if (animate) {
            play({
                targets: cards,
                opacity: [0, 1],
                translateY: [28, 0],
                scale: [0.97, 1],
                delay: anime.stagger(70, { grid: gridShape(cards), from: 'first' }),
                duration: 700,
                easing: 'easeOutCubic',
            });
        } else {
            cards.forEach((c) => { c.style.opacity = 1; });
        }
    }

    function gridShape(cards) {
        if (!cards.length) return [1, 1];
        const top = cards[0].offsetTop;
        let cols = 0;
        for (const c of cards) { if (c.offsetTop === top) cols++; else break; }
        cols = Math.max(cols, 1);
        return [cols, Math.ceil(cards.length / cols)];
    }

    let filterToken = 0;
    function applyFilters() {
        const list = currentFilter();
        const token = ++filterToken;
        const existing = els.gallery.querySelectorAll('.note-card');
        if (animate && existing.length) {
            play({
                targets: existing,
                opacity: 0,
                translateY: -10,
                duration: 180,
                easing: 'easeInQuad',
                complete: () => { if (token === filterToken) render(list); },
            });
        } else {
            render(list);
        }
    }

    /* ---------- Card flip ---------- */
    function flip(plate) {
        const inner = $('.plate-inner', plate);
        const flipped = plate.getAttribute('aria-pressed') !== 'true';
        plate.setAttribute('aria-pressed', String(flipped));
        if (animate) {
            anime.remove(inner);
            anime({ targets: inner, rotateY: flipped ? 180 : 0, easing: SPRING });
        } else {
            inner.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
        }
    }

    els.gallery.addEventListener('click', (e) => {
        const inspect = e.target.closest('.inspect-btn');
        if (inspect) {
            e.stopPropagation();
            const card = inspect.closest('.note-card');
            const plate = $('.plate', card);
            openModal(card.dataset.id, plate.getAttribute('aria-pressed') === 'true' ? 'back' : 'front', inspect);
            return;
        }
        const plate = e.target.closest('.plate');
        if (plate) flip(plate);
    });

    els.gallery.addEventListener('keydown', (e) => {
        const plate = e.target.closest('.plate');
        if (!plate || e.target !== plate) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(plate); }
        if (e.key.toLowerCase() === 'i') {
            e.preventDefault();
            openModal(plate.closest('.note-card').dataset.id, plate.getAttribute('aria-pressed') === 'true' ? 'back' : 'front', plate);
        }
    });

    /* ---------- Inspection modal ---------- */
    const view = { note: null, side: 'front', scale: 1, x: 0, y: 0, loupe: false, returnFocus: null };
    const MIN_Z = 1, MAX_Z = 6;

    function specRow(label, value, mono) {
        if (!value || (Array.isArray(value) && !value.length)) return '';
        const v = Array.isArray(value) ? value.map(esc).join('<br>') : esc(value);
        return `<dt>${label}</dt><dd${mono ? ' class="mono"' : ''}>${v}</dd>`;
    }

    function fillDossier(n) {
        $('#modalCatalog').textContent = [n.pick || n.catalog, n.series || n.theme].filter(Boolean).join(' · ') || n.id;
        $('#modalTitle').textContent = `${n.denomination}, ${n.year}`;
        $('#modalSpec').innerHTML = K().specs(n).map(([l, v, m]) => specRow(l, v, m)).join('');
        $('#modalNotes').innerHTML = [
            n.obverseNotes && `<h4>${K().faces[0]}</h4><p>${esc(n.obverseNotes)}</p>`,
            n.reverseNotes && `<h4>${K().faces[1]}</h4><p>${esc(n.reverseNotes)}</p>`,
            n.remarks && `<h4>Remarks</h4><p>${esc(n.remarks)}</p>`,
        ].filter(Boolean).join('');
    }

    function applyTransform(animated) {
        els.zoomLevel.textContent = `${view.scale.toFixed(1)}×`;
        const img = $('#viewerImg');
        if (!img) return;
        if (animated && animate) {
            anime.remove(img);
            anime({ targets: img, scale: view.scale, translateX: view.x, translateY: view.y, duration: 450, easing: 'easeOutQuart' });
        } else if (hasAnime) {
            anime.set(img, { scale: view.scale, translateX: view.x, translateY: view.y });
        } else {
            img.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
        }
    }

    function clampPan() {
        const r = els.stage.getBoundingClientRect();
        const maxX = (r.width * (view.scale - 1)) / 2;
        const maxY = (r.height * (view.scale - 1)) / 2;
        view.x = Math.max(-maxX, Math.min(maxX, view.x));
        view.y = Math.max(-maxY, Math.min(maxY, view.y));
    }

    function setZoom(s, animated = true) {
        view.scale = Math.max(MIN_Z, Math.min(MAX_Z, s));
        if (view.scale === 1) { view.x = 0; view.y = 0; }
        clampPan();
        applyTransform(animated);
    }

    function showSide(side) {
        view.side = side;
        document.querySelectorAll('.side-toggle button').forEach((b) => b.classList.toggle('active', b.dataset.side === side));
        const n = view.note;
        const src = imgPath(n, side);

        // rebuild image node so a previous placeholder never sticks
        els.stage.querySelectorAll('img, .placeholder').forEach((el) => el.remove());
        const img = document.createElement('img');
        img.id = 'viewerImg';
        img.alt = `${faceName(side)} of ${n.denomination}, ${n.country}`;
        img.draggable = false;
        img.addEventListener('error', () => {
            const w = document.createElement('div');
            w.innerHTML = placeholderHTML(n, side);
            img.replaceWith(w.firstElementChild);
        }, { once: true });
        img.src = src;
        els.stage.insertBefore(img, els.loupe);
        els.loupe.style.backgroundImage = `url("${src.replace(/"/g, '\\"')}")`;

        view.scale = 1; view.x = 0; view.y = 0;
        applyTransform(false);
        if (animate) anime({ targets: img, opacity: [0, 1], rotateY: [side === 'back' ? -25 : 25, 0], duration: 600, easing: 'easeOutCubic' });
    }

    function openModal(id, side, trigger) {
        const n = ITEMS.find((x) => x.id === id);
        if (!n) return;
        view.note = n;
        view.returnFocus = trigger || document.activeElement;
        fillDossier(n);
        els.modal.dataset.kind = kind;
        document.querySelectorAll('.side-toggle button').forEach((b, i) => { b.textContent = K().faces[i]; });
        els.modal.hidden = false;
        document.body.style.overflow = 'hidden';
        showSide(side);
        $('.modal-close', els.modal).focus();
        if (animate) {
            anime({ targets: '.modal-backdrop', opacity: [0, 1], duration: 300, easing: 'linear' });
            play({ targets: els.panel, opacity: [0, 1], scale: [0.94, 1], translateY: [24, 0], easing: 'spring(1, 100, 15, 0)' });
            play({ targets: '#dossier > *', opacity: [0, 1], translateX: [16, 0], delay: anime.stagger(60, { start: 150 }), duration: 500, easing: 'easeOutCubic' });
        }
    }

    function closeModal() {
        if (els.modal.hidden) return;
        const done = () => {
            els.modal.hidden = true;
            document.body.style.overflow = '';
            setLoupe(false);
            if (view.returnFocus && view.returnFocus.focus) view.returnFocus.focus();
        };
        if (animate) {
            anime({ targets: '.modal-backdrop', opacity: 0, duration: 200, easing: 'linear' });
            play({ targets: els.panel, opacity: 0, scale: 0.96, duration: 200, easing: 'easeInQuad', complete: done });
        } else done();
    }

    function setLoupe(on) {
        view.loupe = on;
        els.loupeToggle.setAttribute('aria-pressed', String(on));
        els.stage.classList.toggle('loupe-on', on);
    }

    els.modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
    document.querySelectorAll('.side-toggle button').forEach((b) => b.addEventListener('click', () => showSide(b.dataset.side)));
    $('#zoomIn').addEventListener('click', () => setZoom(view.scale + 0.75));
    $('#zoomOut').addEventListener('click', () => setZoom(view.scale - 0.75));
    els.loupeToggle.addEventListener('click', () => setLoupe(!view.loupe));

    document.addEventListener('keydown', (e) => {
        if (els.modal.hidden) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === '+' || e.key === '=') setZoom(view.scale + 0.75);
        else if (e.key === '-') setZoom(view.scale - 0.75);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') showSide(view.side === 'front' ? 'back' : 'front');
        else if (e.key === 'Tab') {
            // simple focus trap
            const f = [...els.panel.querySelectorAll('button')].filter((b) => b.offsetParent);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // Wheel zoom toward cursor
    els.stage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const r = els.stage.getBoundingClientRect();
        const cx = e.clientX - r.left - r.width / 2;
        const cy = e.clientY - r.top - r.height / 2;
        const prev = view.scale;
        const next = Math.max(MIN_Z, Math.min(MAX_Z, prev * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        view.x = cx - ((cx - view.x) * next) / prev;
        view.y = cy - ((cy - view.y) * next) / prev;
        setZoom(next, false);
    }, { passive: false });

    // Double-click / double-tap toggles 2.5× zoom at point
    els.stage.addEventListener('dblclick', (e) => {
        if (view.scale > 1) { setZoom(1); return; }
        const r = els.stage.getBoundingClientRect();
        const cx = e.clientX - r.left - r.width / 2;
        const cy = e.clientY - r.top - r.height / 2;
        view.x = -cx * 1.5; view.y = -cy * 1.5;
        setZoom(2.5);
    });

    // Drag to pan (mouse + touch via pointer events), pinch to zoom
    const pointers = new Map();
    let drag = null, pinch = null;
    els.stage.addEventListener('pointerdown', (e) => {
        els.stage.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.scale };
            drag = null;
        } else {
            drag = { x: e.clientX, y: e.clientY, ox: view.x, oy: view.y };
            els.stage.classList.add('dragging');
        }
    });
    els.stage.addEventListener('pointermove', (e) => {
        if (view.loupe) moveLoupe(e);
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch && pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            setZoom(pinch.s * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d), false);
        } else if (drag && view.scale > 1) {
            view.x = drag.ox + (e.clientX - drag.x);
            view.y = drag.oy + (e.clientY - drag.y);
            clampPan();
            applyTransform(false);
        }
    });
    const endPointer = (e) => {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) pinch = null;
        if (!pointers.size) { drag = null; els.stage.classList.remove('dragging'); }
    };
    els.stage.addEventListener('pointerup', endPointer);
    els.stage.addEventListener('pointercancel', endPointer);
    els.stage.addEventListener('pointerleave', () => { if (view.loupe) els.loupe.style.opacity = 0; });
    els.stage.addEventListener('pointerenter', () => { els.loupe.style.opacity = 1; });

    function moveLoupe(e) {
        const img = $('#viewerImg');
        if (!img) return;
        const ir = img.getBoundingClientRect();
        const sr = els.stage.getBoundingClientRect();
        const px = e.clientX - ir.left, py = e.clientY - ir.top;
        const Z = 3;
        const size = 180;
        els.loupe.style.left = `${e.clientX - sr.left - size / 2}px`;
        els.loupe.style.top = `${e.clientY - sr.top - size / 2}px`;
        els.loupe.style.backgroundSize = `${ir.width * Z}px ${ir.height * Z}px`;
        els.loupe.style.backgroundPosition = `${-(px * Z - size / 2)}px ${-(py * Z - size / 2)}px`;
        els.loupe.style.visibility = (px < 0 || py < 0 || px > ir.width || py > ir.height) ? 'hidden' : 'visible';
    }

    /* ---------- Wire up filters ---------- */
    [els.country, els.era, els.denom].forEach((s) => s.addEventListener('change', applyFilters));
    let searchTimer;
    els.search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(applyFilters, 200); });
    els.reset.addEventListener('click', () => {
        els.country.value = els.era.value = els.denom.value = els.search.value = '';
        applyFilters();
    });

    /* ---------- Sections (Coins / Notes / Stamps) ---------- */
    const byCatalogue = (a, b) => (a.sample === b.sample ? 0 : a.sample ? 1 : -1) || a.country.localeCompare(b.country) || (firstYear(a) || 0) - (firstYear(b) || 0);
    Object.values(COLLECTION).forEach((arr) => arr.sort(byCatalogue));

    function switchKind(next, first) {
        if (!KINDS[next]) next = 'notes';
        kind = next;
        ITEMS = COLLECTION[kind];
        document.body.dataset.kind = kind;
        document.querySelectorAll('.kind-tab').forEach((t) => {
            const on = t.dataset.kind === kind;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', String(on));
        });
        els.search.placeholder = { coins: 'KM no., metal, mint…', notes: 'Serial, Pick no., signature…', stamps: 'SG no., theme, perforation…' }[kind];
        renderStats();
        buildFilters();
        if (first || !animate) { render(ITEMS); return; }
        applyFilters();
    }

    document.querySelectorAll('.kind-tab').forEach((t) => {
        const n = COLLECTION[t.dataset.kind].filter((x) => !x.sample).length;
        const c = t.querySelector('.kind-count');
        if (c) c.textContent = n;
        t.addEventListener('click', () => {
            if (t.dataset.kind === kind) return;
            history.replaceState(null, '', `#${t.dataset.kind}`);
            switchKind(t.dataset.kind);
        });
    });
    window.addEventListener('hashchange', () => switchKind(location.hash.slice(1)));

    /* ---------- Boot ---------- */
    if (animate) {
        play({ targets: '.cabinet-header > *', opacity: [0, 1], translateY: [14, 0], delay: anime.stagger(80), duration: 700, easing: 'easeOutCubic' });
    }
    switchKind(location.hash.slice(1) || 'notes', true);
})();
