/*
 * Instagram posts shown on each country page (Photo Gallery section), via Instagram's
 * official embed. To add one, paste its link into the right country's list:
 *     vietnam: ['https://www.instagram.com/p/DSzuPEwjCIW/', 'https://www.instagram.com/p/XXXX/'],
 * Any post link works (with or without ?img_index=...); reels work too.
 */
window.TRAVEL_INSTAGRAM = {
    profile: 'horizonsmirks',
    posts: {
        india:    [],
        oman:     [],
        russia:   [],
        vietnam:  ['https://www.instagram.com/p/DSzuPEwjCIW/'],
        thailand: [],
        srilanka: ['https://www.instagram.com/p/DfZ_qZjAJWW/'],
        kenya:    [],
        tanzania: ['https://www.instagram.com/p/DVGIscZjKlE/']
    }
};

(function renderInstagram() {
    const cfg = window.TRAVEL_INSTAGRAM;
    const root = document.getElementById('history-root');
    const country = root && root.dataset.country;
    const list = (cfg && country && cfg.posts[country]) || [];
    if (!list.length) return;

    // Normalise to a clean permalink: https://www.instagram.com/p/ID/ (or /reel/ID/)
    const clean = u => {
        const m = String(u).match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
        return m ? `https://www.instagram.com/${m[1]}/${m[2]}/` : null;
    };
    const links = list.map(clean).filter(Boolean);
    if (!links.length) return;

    const block = document.createElement('div');
    block.className = 'ig-block';
    block.innerHTML = `
        <div class="ig-head">
            <i class="fab fa-instagram"></i>
            <span>From my Instagram</span>
            <a href="https://www.instagram.com/${cfg.profile}/" target="_blank" rel="noopener">@${cfg.profile}</a>
        </div>
        <div class="ig-grid">${links.map(l => `
            <blockquote class="instagram-media" data-instgrm-permalink="${l}?utm_source=ig_embed" data-instgrm-version="14">
                <a href="${l}" target="_blank" rel="noopener">View this post on Instagram</a>
            </blockquote>`).join('')}
        </div>`;

    // Goes inside the Photo Gallery section, after the photo grid
    const gallery = document.querySelector('.gallery-section') || root;
    gallery.appendChild(block);
    const empty = document.getElementById('gallery-empty');
    if (empty) empty.textContent = 'More photos coming soon.';

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    s.onload = () => window.instgrm && window.instgrm.Embeds.process();
    document.body.appendChild(s);
})();
