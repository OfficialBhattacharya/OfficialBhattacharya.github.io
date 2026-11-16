/* Renders the "History" section on a country page and opens each story in a reader.
   Needs history-images.js and history-stories.js loaded first, and
   <div id="history-root" data-country="india"></div> somewhere in the page. */
(function () {
  const root = document.getElementById('history-root');
  const data = window.TRAVEL_HISTORY && root && window.TRAVEL_HISTORY[root.dataset.country];
  const IMG = window.TRAVEL_IMAGES || {};
  if (!data) return;

  const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const norm = s => s.toLowerCase().replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Section with story cards
  const cards = data.stories.map((s, i) => {
    const first = IMG[s.images[0]];
    return `
      <button type="button" class="hx-card" data-i="${i}" id="hx-card-${slug(s.place)}">
        <span class="hx-thumb">${first ? `<img src="${esc(first.src)}" alt="" loading="lazy">` : ''}<span class="hx-count">${s.images.length} photo${s.images.length > 1 ? 's' : ''}</span></span>
        <span class="hx-card-body">
          <span class="hx-place">${esc(s.place)}</span>
          <span class="hx-title">${esc(s.title)}</span>
          <span class="hx-era">${esc(s.era)}</span>
        </span>
      </button>`;
  }).join('');

  root.innerHTML = `
    <section class="hx-section" aria-labelledby="hx-heading">
      <div class="hx-head">
        <h2 class="section-title" id="hx-heading">History</h2>
        <p class="hx-intro">${esc(data.intro)}</p>
      </div>
      <div class="hx-grid">${cards}</div>
      <p class="hx-note">All photographs are historic images from Wikimedia Commons; each one links to its source, author and licence.</p>
    </section>`;

  // Reader dialog
  const dlg = document.createElement('div');
  dlg.className = 'hx-reader';
  dlg.setAttribute('role', 'dialog');
  dlg.setAttribute('aria-modal', 'true');
  dlg.hidden = true;
  dlg.innerHTML = `<div class="hx-backdrop" data-close></div><article class="hx-panel" tabindex="-1"></article>`;
  document.body.appendChild(dlg);
  const panel = dlg.querySelector('.hx-panel');
  let lastFocus = null;

  function figure(key) {
    const im = IMG[key];
    if (!im) return '';
    return `
      <figure class="hx-fig">
        <a href="${esc(im.page)}" target="_blank" rel="noopener"><img src="${esc(im.src)}" alt="${esc(im.caption)}" loading="lazy"></a>
        <figcaption>
          <span class="hx-cap">${esc(im.caption)}</span>
          <span class="hx-credit">${esc(im.artist)} · ${esc(im.lic)} · <a href="${esc(im.page)}" target="_blank" rel="noopener">Wikimedia Commons</a></span>
        </figcaption>
      </figure>`;
  }

  function open(i) {
    const s = data.stories[i];
    if (!s) return;
    lastFocus = document.activeElement;
    const prev = data.stories[i - 1], next = data.stories[i + 1];
    panel.innerHTML = `
      <button type="button" class="hx-close" data-close aria-label="Close">&times;</button>
      <header class="hx-panel-head">
        <span class="hx-place">${esc(s.place)} · ${esc(s.era)}</span>
        <h3>${esc(s.title)}</h3>
      </header>
      <div class="hx-text">${s.body.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="hx-figs hx-figs-${Math.min(s.images.length, 3)}">${s.images.map(figure).join('')}</div>
      <nav class="hx-pager">
        ${prev ? `<button type="button" data-go="${i - 1}">‹ ${esc(prev.place)}</button>` : '<span></span>'}
        ${next ? `<button type="button" data-go="${i + 1}">${esc(next.place)} ›</button>` : '<span></span>'}
      </nav>`;
    dlg.setAttribute('aria-label', s.title);
    dlg.hidden = false;
    document.body.classList.add('hx-lock');
    panel.scrollTop = 0;
    panel.focus();
    history.replaceState(null, '', '#history-' + slug(s.place));
  }

  function close() {
    dlg.hidden = true;
    document.body.classList.remove('hx-lock');
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return close();
    const go = e.target.closest('[data-go]');
    if (go) open(+go.dataset.go);
  });
  document.addEventListener('keydown', e => { if (!dlg.hidden && e.key === 'Escape') close(); });
  root.addEventListener('click', e => {
    const c = e.target.closest('.hx-card');
    if (c) open(+c.dataset.i);
  });

  // Make the page's existing region / highlight cards open the matching story
  const index = data.stories.map(s => norm(s.place));
  document.querySelectorAll('.region-card, .highlight-card').forEach(card => {
    const h = card.querySelector('h3');
    if (!h) return;
    const name = norm(h.textContent);
    const i = index.findIndex(p => name === p || name.startsWith(p + ' ') || p.startsWith(name + ' '));
    if (i < 0) return;
    card.classList.add('hx-linked');
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    const badge = document.createElement('span');
    badge.className = 'hx-badge';
    badge.textContent = 'Read its history ›';
    card.appendChild(badge);
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });

  // Deep link: #history-<place>
  const m = location.hash.match(/^#history-(.+)$/);
  if (m) {
    const i = data.stories.findIndex(s => slug(s.place) === m[1]);
    if (i >= 0) open(i);
  }
})();
