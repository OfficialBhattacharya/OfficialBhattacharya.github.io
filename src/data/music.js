/*
 * MUSIC: the only file you need to edit for the Music app.
 *
 * 1. Background: put your image in src/assets/music/ and set `background` to its path,
 *    e.g. 'src/assets/music/background.jpg'. Leave it '' to keep the warm placeholder.
 * 2. Playlists: paste each Spotify link into `spotify`. Any share link works:
 *      https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM?si=...
 *      https://open.spotify.com/album/...   /track/...   or spotify:playlist:...
 *    `cover` is optional (a path or image URL); without it a coloured tile is shown.
 *    Add or remove playlists freely; each one becomes a chip and a row on the shelf.
 * 3. Notes: short lines that rotate in the card (trivia, why you love a song, anything).
 */
window.MUSIC = {
    title: 'গান',
    subtitle: 'gaan · the songs I keep coming back to',
    background: '',

    noteLabel: 'Listening notes',
    notes: [
        'গান (gaan) is simply the Bengali word for song.',
        'Add a line here about a song you love and why.',
        'Notes rotate every few seconds; tap the arrow to skip.'
    ],

    playlists: [
        { name: 'Retro',      blurb: 'Old Bengali and Hindi classics',  spotify: '', cover: '' },
        { name: 'Indie',      blurb: 'New voices from the Indian indie scene', spotify: '', cover: '' },
        { name: 'Late night', blurb: 'Slow songs for after midnight',    spotify: '', cover: '' }
    ]
};
