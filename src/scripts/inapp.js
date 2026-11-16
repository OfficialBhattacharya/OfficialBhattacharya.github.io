/**
 * In-app pages. Blog posts, country pages, games and other inner pages of the site
 * open inside the phone (full screen, back-arrow header) instead of a new browser tab.
 * External sites and PDFs still open normally.
 */
(function initInApp() {
    const root = new URL('./', location.href);

    function isInternalPage(href) {
        try {
            const u = new URL(href, location.href);
            if (u.origin !== location.origin) return false;
            if (!/\.html?$/i.test(u.pathname)) return false;
            return u.pathname !== new URL('index.html', root).pathname; // the site's own home page
        } catch (e) { return false; }
    }
    function isSiteHome(href) {
        try {
            const u = new URL(href, location.href);
            return u.origin === location.origin &&
                (u.pathname === root.pathname || u.pathname === new URL('index.html', root).pathname);
        } catch (e) { return false; }
    }

    const view = document.createElement('div');
    view.className = 'inapp';
    view.hidden = true;
    view.setAttribute('role', 'dialog');
    view.setAttribute('aria-modal', 'true');
    view.innerHTML = `
        <div class="app-bar inapp-bar">
            <button type="button" class="app-back" aria-label="Back"><i class="fas fa-chevron-left"></i></button>
            <div class="app-bar-title"><span class="inapp-title">Loading…</span></div>
            <a class="inapp-out" target="_blank" rel="noopener" aria-label="Open in a browser tab" title="Open in a browser tab"><i class="fas fa-external-link-alt"></i></a>
        </div>
        <div class="inapp-frame-wrap"></div>`;
    document.body.appendChild(view);
    const wrap = view.querySelector('.inapp-frame-wrap');
    let frame = null;
    const titleEl = view.querySelector('.inapp-title');
    const outLink = view.querySelector('.inapp-out');

    function show(href) {
        const url = new URL(href, location.href).href;
        titleEl.textContent = 'Loading…';
        outLink.href = url;
        // A fresh frame each time, loaded with location.replace() so the page never adds
        // its own browser-history entries (Back should close the page, not step inside it)
        if (frame) frame.remove();
        frame = document.createElement('iframe');
        frame.className = 'inapp-frame';
        frame.title = 'Page';
        wrap.appendChild(frame);
        frame.addEventListener('load', onFrameLoad);
        frame.contentWindow.location.replace(url);
        view.hidden = false;
        requestAnimationFrame(() => view.classList.add('open'));
        document.body.classList.add('inapp-active');
        history.pushState(Object.assign({}, history.state, { inapp: url }), '', location.href);
    }
    function hide() {
        view.classList.remove('open');
        document.body.classList.remove('inapp-active');
        setTimeout(() => { if (!view.classList.contains('open')) { view.hidden = true; if (frame) { frame.remove(); frame = null; } } }, 250);
    }
    const isOpen = () => view.classList.contains('open');
    function back() {
        if (history.state && history.state.inapp) history.back();
        else hide();
    }

    view.querySelector('.app-back').addEventListener('click', back);
    window.addEventListener('popstate', () => {
        if (isOpen() && !(history.state && history.state.inapp)) hide();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { e.stopImmediatePropagation(); back(); } }, true);

    // Home / Grid / Others in the bottom bar close the page first
    document.querySelectorAll('.phone-nav-btn').forEach(b => b.addEventListener('click', () => {
        if (!isOpen()) return;
        hide();
        if (history.state && history.state.inapp) {
            const s = Object.assign({}, history.state); delete s.inapp;
            history.replaceState(s, '', location.href);
        }
    }, true));

    // Inner pages opened with window.open(...) or a plain link
    const nativeOpen = window.open.bind(window);
    window.open = function (url, target, features) {
        if (url && isInternalPage(url)) { show(url); return null; }
        return nativeOpen(url, target, features);
    };
    document.addEventListener('click', e => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        const a = e.target.closest('a[href]');
        if (!a || a.closest('.inapp-bar')) return;
        const href = a.getAttribute('href');
        if (href.startsWith('#') || !isInternalPage(href)) return;
        e.preventDefault();
        show(href);
    });

    // Inside the page: keep links in the phone, and "Back to Portfolio" just closes it
    function onFrameLoad() {
        let doc;
        try { doc = frame.contentDocument; } catch (e) { return; }
        if (!doc || doc.URL === 'about:blank') return;
        // The phone header already has a back arrow, so hide the page's own "Back to …" links
        doc.querySelectorAll('a[href]').forEach(a => {
            const abs = new URL(a.getAttribute('href'), frame.contentWindow.location.href).href;
            if (isSiteHome(abs) || /back to/i.test(a.textContent)) a.style.display = 'none';
        });
        titleEl.textContent = (doc.title || 'Page').replace(/\s*[-|–]\s*Diganta Bhattacharya.*$/i, '');
        outLink.href = frame.contentWindow.location.href;
        const w = frame.contentWindow;
        const innerOpen = w.open.bind(w);
        w.open = function (url, target, features) {
            const abs = new URL(url, w.location.href).href;
            if (isInternalPage(abs)) { w.location.replace(abs); return null; }
            return innerOpen(abs, target, features);
        };
        doc.addEventListener('click', ev => {
            const a = ev.target.closest('a[href]');
            if (!a) return;
            const abs = new URL(a.getAttribute('href'), w.location.href).href;
            if (isSiteHome(abs)) { ev.preventDefault(); back(); }
            else if (isInternalPage(abs) && !abs.startsWith(w.location.href.split('#')[0] + '#')) { ev.preventDefault(); w.location.replace(abs); }
        }, true);
    }
})();
