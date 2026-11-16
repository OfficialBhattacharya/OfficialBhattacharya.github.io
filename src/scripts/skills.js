/** Skills: filter rows by where the skill was used (JPMorgan, Morgan Stanley, ...). */
(function initSkills() {
    const root = document.querySelector('#skills .sk');
    if (!root) return;
    const chips = root.querySelectorAll('.sk-chip');
    const rows = root.querySelectorAll('.sk-row');
    const cards = root.querySelectorAll('.sk-card');
    const empty = document.getElementById('skEmpty');

    function apply(src) {
        chips.forEach(c => c.classList.toggle('active', c.dataset.src === src));
        rows.forEach(r => { r.hidden = src !== 'all' && !r.dataset.src.split(' ').includes(src); });
        let any = false;
        cards.forEach(card => {
            const list = card.querySelectorAll('.sk-row');
            const visible = [...list].some(r => !r.hidden);
            // The toolkit card has no rows: show it only for "All"
            const hide = list.length ? !visible : src !== 'all';
            card.classList.toggle('sk-dim', hide);
            if (!hide) any = true;
        });
        empty.hidden = any;
    }
    chips.forEach(c => c.addEventListener('click', () => apply(c.dataset.src)));
})();
