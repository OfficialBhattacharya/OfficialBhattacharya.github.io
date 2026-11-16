/**
 * Activities app. Renders window.ACTIVITIES (src/data/activities.js): a summary strip,
 * one card per activity with its places, and Instagram embeds that load only once
 * the app is opened.
 */
(function initActivities() {
    const list = window.ACTIVITIES;
    const panel = document.getElementById('activities');
    if (!list || !panel) return;
    const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const clean = u => {
        const m = String(u).match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
        return m ? `https://www.instagram.com/${m[1]}/${m[2]}/` : null;
    };

    const places = new Set(), countries = new Set();
    list.forEach(a => a.places.forEach(p => { places.add(p.name); countries.add(p.flag); }));

    const root = panel.querySelector('.act');
    root.innerHTML = `
        <div class="act-stats">
            <div><b>${list.length}</b><span>activities</span></div>
            <div><b>${places.size}</b><span>places</span></div>
            <div><b>${countries.size}</b><span>countries</span></div>
        </div>
        <div class="act-list">${list.map((a, i) => `
            <article class="act-card" style="--c: ${esc(a.colour || '0, 255, 157')}">
                <header class="act-head">
                    <span class="act-icon"><i class="fas ${esc(a.icon)}"></i></span>
                    <div>
                        <h3>${esc(a.name)}</h3>
                        <p>${esc(a.blurb)}</p>
                    </div>
                    <span class="act-count">${a.places.length} place${a.places.length > 1 ? 's' : ''}</span>
                </header>
                <div class="act-places">${a.places.map(p => p.page
                    ? `<a class="act-place" href="${esc(p.page)}"><span>${p.flag || ''}</span>${esc(p.name)}<i class="fas fa-chevron-right"></i></a>`
                    : `<span class="act-place"><span>${p.flag || ''}</span>${esc(p.name)}</span>`).join('')}
                </div>
                ${(a.instagram || []).map(clean).filter(Boolean).length ? `
                <div class="act-ig" data-i="${i}">${(a.instagram || []).map(clean).filter(Boolean).map(l => `
                    <blockquote class="instagram-media" data-instgrm-permalink="${l}?utm_source=ig_embed" data-instgrm-version="14">
                        <a href="${l}" target="_blank" rel="noopener">View on Instagram</a>
                    </blockquote>`).join('')}
                </div>` : ''}
            </article>`).join('')}
        </div>`;

    // Instagram embeds load the first time the app is opened
    let loaded = false;
    new MutationObserver(() => {
        if (loaded || !panel.classList.contains('app-open') || !panel.querySelector('.instagram-media')) return;
        loaded = true;
        if (window.instgrm) { window.instgrm.Embeds.process(); return; }
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.instagram.com/embed.js';
        s.onload = () => window.instgrm && window.instgrm.Embeds.process();
        document.body.appendChild(s);
    }).observe(panel, { attributes: true, attributeFilter: ['class'] });
})();
