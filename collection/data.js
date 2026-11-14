/* =====================================================================
   THE COLLECTOR'S CABINET: COLLECTION DATA
   ---------------------------------------------------------------------
   Three separate sections: COINS, NOTES and STAMPS. Add one object per
   item to the right array. Images go in the matching sub-folder:

       images/coins/coin-001-front.jpg    images/coins/coin-001-back.jpg
       images/notes/note-001-front.jpg    images/notes/note-001-back.jpg
       images/stamps/stamp-001-front.jpg  images/stamps/stamp-001-back.jpg

   IDs are zero-padded and sequential within each section.
   Required: id, country, denomination, year. Every other field is
   optional and is hidden when empty. If you leave out front/back, the
   paths above are used automatically.

   "era" drives the Era filter: "Pre-1900", "1900–1945", "1946–1979",
   "1980–1999" or "2000–Present". If you leave it out, it's worked out
   from "year".
   ===================================================================== */

/* ---------------------------- COINS ---------------------------------
   Coin-specific fields: catalog (Krause "KM#"), composition, weight,
   diameter, mint, mintMark, edge.                                      */
const COINS = [
  {
    id: "coin-000",
    sample: true,                         // ← sample; delete when your first coins arrive
    country: "Republic of India",
    authority: "Government of India",
    denomination: "1 Rupee",
    faceValue: 1,
    year: "1975",
    catalog: "KM# 78.1",
    composition: "Copper-nickel",
    weight: "8.0 g",
    diameter: "28 mm",
    mint: "Bombay",
    mintMark: "◆ (diamond)",
    edge: "Security edge",
    condition: "XF",
    obverseNotes: "The Lion Capital of Ashoka above 'भारत INDIA', between two sprigs.",
    reverseNotes: "The denomination '1' and 'RUPEE / रुपया', flanked by ears of wheat, with the date below.",
    remarks: "Sample entry, so a placeholder is shown until images are added."
  }
];

/* ---------------------------- NOTES ---------------------------------
   Note-specific fields: pick (Pick catalogue number), series, serial,
   signatures (array), dimensions.                                      */
const NOTES = [
  {
    id: "note-000",
    sample: true,                         // ← sample; delete when your first notes arrive
    country: "Republic of India",
    authority: "Reserve Bank of India",
    denomination: "10 Rupees",
    faceValue: 10,
    year: "2018",
    pick: "P-109",
    series: "Mahatma Gandhi New Series",
    serial: "0AB 123456",
    signatures: ["Urjit R. Patel (Governor)"],
    dimensions: "123 × 63 mm",
    condition: "UNC",
    obverseNotes: "Portrait of Mahatma Gandhi, with the Ashoka Pillar emblem at right. The watermark shows Gandhi and the denomination numeral.",
    reverseNotes: "The Sun Temple at Konark, Odisha. The base colour is chocolate brown.",
    remarks: "Sample entry, so a placeholder is shown until images are added."
  }
];

/* ---------------------------- STAMPS --------------------------------
   Stamp-specific fields: catalog (SG / Scott number), theme, perforation,
   watermark, printing, gum ("Mint never hinged", "Used", "CTO"…),
   dimensions.                                                          */
const STAMPS = [
  {
    id: "stamp-000",
    sample: true,                         // ← sample; delete when your first stamps arrive
    country: "Republic of India",
    authority: "India Post",
    denomination: "3 Annas 6 Pies",
    faceValue: 0.22,
    year: "1948",
    catalog: "SG 306",
    theme: "Mahatma Gandhi mourning issue",
    perforation: "11½",
    watermark: "None",
    printing: "Photogravure, Courvoisier (Switzerland)",
    gum: "Used",
    condition: "Fine",
    obverseNotes: "Portrait of Gandhi, issued on 15 August 1948, the first anniversary of Independence.",
    reverseNotes: "",
    remarks: "Sample entry, so a placeholder is shown until images are added."
  }
];

if (typeof window !== "undefined") {
  window.COLLECTION = { coins: COINS, notes: NOTES, stamps: STAMPS };
}
