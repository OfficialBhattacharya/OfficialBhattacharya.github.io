/**
 * Music app. Reads window.MUSIC (src/data/music.js) and renders the mood chips,
 * rotating notes, a Spotify player for the chosen playlist and the playlist shelf.
 * The Spotify embed only loads once the Music app is actually opened.
 */
(function initMusic() {
    const cfg = window.MUSIC;
    const panel = document.getElementById('music');
    if (!cfg || !panel) return;

    const $ = id => document.getElementById(id);
    const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const lists = cfg.playlists || [];
    let current = 0;
    let opened = false;

    // "https://open.spotify.com/playlist/ID?si=..." or "spotify:playlist:ID" -> embed URL
    function embedUrl(link) {
        if (!link) return null;
        const m = String(link).match(/(?:open\.spotify\.com\/(?:intl-[a-z]+\/)?|spotify:)(playlist|album|track|artist|show|episode)[/:]([A-Za-z0-9]+)/);
        return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : null;
    }

    const coverStyle = p => p.cover ? ` style="background-image:url('${esc(p.cover)}')"` : '';
    const coverIcon = p => p.cover ? '' : '<i class="fas fa-compact-disc"></i>';

    // Static text and background
    $('musicTitle').textContent = cfg.title || 'Music';
    $('musicSubtitle').textContent = cfg.subtitle || '';
    if (cfg.background) panel.style.setProperty('--music-bg', `url('${cfg.background}')`);
    ['musicNote', 'musicPlayer'].forEach(id => $(id).classList.add('glass'));

    // Clock
    const tick = () => { $('musicClock').textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
    tick();
    setInterval(tick, 30000);

    // Notes
    const notes = cfg.notes || [];
    let n = 0;
    $('musicNoteLabel').textContent = cfg.noteLabel || 'Notes';
    function showNote(i) {
        if (!notes.length) { $('musicNote').hidden = true; return; }
        n = (i + notes.length) % notes.length;
        const p = $('musicNoteText');
        p.style.opacity = 0;
        setTimeout(() => { p.textContent = notes[n]; p.style.opacity = 1; }, 180);
    }
    showNote(0);
    $('musicNoteNext').addEventListener('click', () => showNote(n + 1));
    setInterval(() => { if (panel.classList.contains('app-open')) showNote(n + 1); }, 9000);

    // Chips and shelf
    $('musicMoods').innerHTML = lists.map((p, i) =>
        `<button type="button" class="music-mood" role="tab" data-i="${i}">${esc(p.name)}</button>`).join('');
    $('musicShelf').innerHTML = lists.map((p, i) => `
        <button type="button" class="music-shelf-item glass" data-i="${i}">
            <span class="music-cover"${coverStyle(p)}>${coverIcon(p)}</span>
            <span><b>${esc(p.name)}</b><small>${esc(p.blurb)}</small></span>
            <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
        </button>`).join('');
    panel.addEventListener('click', e => {
        const b = e.target.closest('[data-i]');
        if (b && (b.classList.contains('music-mood') || b.classList.contains('music-shelf-item'))) select(+b.dataset.i);
    });

    function renderPlayer() {
        const p = lists[current];
        if (!p) { $('musicPlayer').innerHTML = '<p class="music-placeholder">No playlists yet.</p>'; return; }
        const src = embedUrl(p.spotify);
        const head = `
            <div class="music-player-head">
                <span class="music-cover"${coverStyle(p)}>${coverIcon(p)}</span>
                <span><b>${esc(p.name)}</b><small>${esc(p.blurb)}</small></span>
            </div>`;
        const body = src
            ? (opened
                ? `<iframe class="music-embed" title="${esc(p.name)} on Spotify" src="${src}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
                : '<div class="music-embed"></div>')
            : `<div class="music-placeholder">
                   <div class="music-fake-track"><span></span></div>
                   <div class="music-fake-time"><span>0:00</span><span>0:00</span></div>
                   <div class="music-controls" aria-hidden="true"><i class="fas fa-random"></i><i class="fas fa-step-backward"></i><span class="play"><i class="fas fa-play"></i></span><i class="fas fa-step-forward"></i><i class="fas fa-list"></i></div>
                   <p>Spotify link coming soon. Add it in <code>src/data/music.js</code></p>
               </div>`;
        $('musicPlayer').innerHTML = head + body;
    }

    function select(i) {
        current = i;
        document.querySelectorAll('.music-mood').forEach(b => b.setAttribute('aria-selected', String(+b.dataset.i === i)));
        document.querySelectorAll('.music-shelf-item').forEach(b => b.setAttribute('aria-current', String(+b.dataset.i === i)));
        renderPlayer();
    }

    // Load Spotify only when the app is first opened
    new MutationObserver(() => {
        if (!opened && panel.classList.contains('app-open')) { opened = true; renderPlayer(); }
    }).observe(panel, { attributes: true, attributeFilter: ['class'] });

    select(0);
})();
