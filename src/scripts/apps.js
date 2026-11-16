/**
 * App view. Home (wallpaper), the grid and About scroll as one page; every other
 * section is an "app" that opens full screen from its tile and closes back to the grid.
 */
(function initApps() {
    const panels = Array.from(document.querySelectorAll('section.app-panel'));
    if (!panels.length) return;
    const byId = Object.fromEntries(panels.map(p => [p.id, p]));
    const navLinks = document.querySelectorAll('.phone-nav-btn');
    let current = null;
    let opener = null;

    // Icon and accent for each app's top bar, taken from its grid tile when there is one
    const meta = {
        experience: ['fa-briefcase', 'Experience'], projects: ['fa-code-branch', 'Projects'], skills: ['fa-microchip', 'Skills'],
        blog: ['fa-pen-nib', 'Blog'], games: ['fa-gamepad', 'Games'], art: ['fa-palette', 'Art'], travel: ['fa-globe-asia', 'Travel'],
        collection: ['fa-coins', 'Collection'], kaggle: ['fab fa-kaggle', 'Kaggle'], analytics: ['fa-chart-line', 'Analytics'],
        music: ['fa-music', 'Music'], activities: ['fa-person-swimming', 'Activities'], others: ['fa-th', 'All apps']
    };

    panels.forEach(p => {
        const [icon, title] = meta[p.id] || ['fa-square', p.id];
        const tile = document.querySelector(`.hub-tile[href="#${p.id}"]`);
        const accent = tile && tile.style.getPropertyValue('--tile-accent');
        if (accent) p.style.setProperty('--app-accent', accent.trim());
        const bar = document.createElement('div');
        bar.className = 'app-bar';
        bar.innerHTML = `
            <button type="button" class="app-back" aria-label="Back"><i class="fas fa-chevron-left"></i></button>
            <div class="app-bar-title"><i class="${icon.startsWith('fab') ? icon : 'fas ' + icon}"></i>${title}</div>
            <span class="app-bar-spacer" aria-hidden="true"></span>`;
        p.prepend(bar);
        p.setAttribute('role', 'dialog');
        p.setAttribute('aria-label', title);
        p.setAttribute('aria-hidden', 'true');
        bar.querySelector('.app-back').addEventListener('click', () => goBack());
    });

    document.body.classList.add('apps-on');

    // Every app lives under "Others", so that button stays lit while any app is open
    function setNav(id) {
        const key = byId[id] ? 'others' : id === 'about' ? 'hub' : id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + key));
    }

    function open(id, { push = true, from = null } = {}) {
        const p = byId[id];
        if (!p) return;
        const switching = !!current;
        const prevId = current && current.id;
        if (current && current !== p) hide(current);

        // Zoom out of the tile (or the dock link) that launched it
        const src = from || document.querySelector(`.hub-tile[href="#${id}"]`);
        if (src) {
            const r = src.getBoundingClientRect();
            if (r.width) p.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
        }
        opener = from || opener;
        p.scrollTop = 0;
        p.setAttribute('aria-hidden', 'false');
        p.classList.add('app-open');
        document.body.classList.add('app-active');
        current = p;
        setNav(id);
        // Only one app entry in history, so Back / Home always lands on the grid
        // Drawer -> app pushes (Back returns to the drawer); app -> app replaces
        const replace = switching && prevId !== 'others';
        if (push) history[replace ? 'replaceState' : 'pushState']({ app: id }, '', '#' + id);
        setTimeout(() => { p.scrollTop = 0; const b = p.querySelector('.app-back'); b && b.focus({ preventScroll: true }); }, 50);
    }

    function hide(p) {
        p.classList.remove('app-open');
        p.setAttribute('aria-hidden', 'true');
    }

    function close({ fromPop = false, viaLink = false } = {}) {
        if (!current) return;
        hide(current);
        current = null;
        document.body.classList.remove('app-active');
        setNav('hub');
        if (!fromPop) {
            // history.back() would restore the old scroll position, so a dock link just rewrites the entry
            if (history.state && history.state.app && !viaLink) history.back();
            else history.replaceState(null, '', location.pathname + location.search);
        }
        if (!viaLink && opener && opener.focus) opener.focus({ preventScroll: true });
        opener = null;
    }

    // Any in-page link to an app opens it instead of scrolling (capture phase, before the dock's own handler)
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href').slice(1);
        if (byId[id]) {
            e.preventDefault();
            e.stopImmediatePropagation();
            open(id, { from: a });
        } else if (current) {
            // A dock link to Home / Grid / About: close the app, then scroll there once the page is unlocked
            e.preventDefault();
            e.stopImmediatePropagation();
            close({ viaLink: true });
            const target = document.getElementById(id);
            setNav(id);
            if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
        }
    }, true);

    // Phone-style Back: one step back in history (app -> drawer -> grid)
    function goBack() {
        if (history.state && history.state.app) history.back();
        else close();
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) goBack(); });

    // Status bar clock
    const sbTime = document.getElementById('sbTime');
    if (sbTime) {
        const tick = () => { sbTime.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, ''); };
        tick();
        setInterval(tick, 20000);
    }

    // App drawer search
    const search = document.getElementById('drawerSearch');
    if (search) {
        search.addEventListener('input', () => {
            const q = search.value.trim().toLowerCase();
            let shown = 0;
            document.querySelectorAll('.drawer-app').forEach(a => {
                const hit = !q || a.dataset.name.includes(q);
                a.hidden = !hit;
                if (hit) shown++;
            });
            document.getElementById('drawerEmpty').hidden = shown > 0;
        });
    }

    window.addEventListener('popstate', () => {
        const id = location.hash.slice(1);
        if (byId[id]) { if (current !== byId[id]) open(id, { push: false }); }
        else close({ fromPop: true });
    });

    // Deep link: /#games opens Games straight away
    const start = location.hash.slice(1);
    if (byId[start]) {
        history.replaceState({ app: start }, '', '#' + start);
        const p = byId[start];
        p.style.transition = 'none';
        open(start, { push: false });
        requestAnimationFrame(() => requestAnimationFrame(() => { p.style.transition = ''; }));
    }
})();
