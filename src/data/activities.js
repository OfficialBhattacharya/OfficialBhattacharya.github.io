/*
 * ACTIVITIES: edit this file to add or change adventures.
 *  - places: where you did it. `page` (optional) links to that country's travel page.
 *  - instagram: optional post or reel links, shown with Instagram's official embed.
 *  - colour: "r, g, b" for the card's accent.
 */
window.ACTIVITIES = [
    {
        name: 'Scuba diving',
        icon: 'fa-fish',
        colour: '0, 190, 255',
        blurb: 'Dives in four places, from the Gulf of Oman to the Indian Ocean.',
        places: [
            { name: 'Oman',      flag: '🇴🇲', page: 'src/assets/travel/Oman/Oman.html' },
            { name: 'Zanzibar',  flag: '🇹🇿', page: 'src/assets/travel/Tanzania/Tanzania.html' },
            { name: 'Andaman',   flag: '🇮🇳', page: 'src/assets/travel/India/India.html' },
            { name: 'Sri Lanka', flag: '🇱🇰', page: 'src/assets/travel/SriLanka/SriLanka.html' }
        ],
        instagram: ['https://www.instagram.com/p/DVGIscZjKlE/']
    },
    {
        name: 'Paragliding',
        icon: 'fa-parachute-box',
        colour: '255, 140, 60',
        blurb: 'In the air over Vietnam.',
        places: [
            { name: 'Vietnam', flag: '🇻🇳', page: 'src/assets/travel/Vietnam/Vietnam.html' }
        ],
        instagram: ['https://www.instagram.com/reel/DR1b0IHk4EO/']
    },
    {
        name: 'Abseiling',
        icon: 'fa-mountain',
        colour: '190, 120, 255',
        blurb: 'Going down the ropes in Mumbai.',
        places: [
            { name: 'Mumbai', flag: '🇮🇳', page: 'src/assets/travel/India/India.html' }
        ],
        instagram: []
    },
    {
        name: 'Surfing',
        icon: 'fa-water',
        colour: '0, 230, 170',
        blurb: 'Catching waves in Mumbai.',
        places: [
            { name: 'Mumbai', flag: '🇮🇳', page: 'src/assets/travel/India/India.html' }
        ],
        instagram: ['https://www.instagram.com/p/DT5MNSRDK93/']
    }
];
