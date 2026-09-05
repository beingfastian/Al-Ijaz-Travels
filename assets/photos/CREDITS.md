# Photography credits and licensing

Every image in this directory is from **Pexels**, under the
[Pexels License](https://www.pexels.com/license/) — free for commercial use, no
attribution required, modification permitted.

Attribution is recorded here anyway. Not because the licence demands it, but
because "where did this come from" is a question that gets asked eighteen months
later when nobody remembers, and the honest answer needs to exist somewhere.

**Sourced 20 August 2026**, except `flight-approach` (6 September 2026).

| Key | Subject | Pexels ID | Source |
|---|---|---|---|
| `haram-night` | Masjid al-Haram at night, Kaaba illuminated, viewed through the arcade | 31339194 | [pexels.com/photo/31339194](https://www.pexels.com/photo/night-view-of-kaaba-in-masjid-al-haram-makkah-31339194/) |
| `kaaba-day` | Kaaba with pilgrims, daytime | 14440333 | [pexels.com/photo/14440333](https://www.pexels.com/photo/landscape-photography-of-the-masjid-al-haram-14440333/) |
| `haram-courtyard` | Masjid al-Haram from an upper level, golden domes in foreground | 11667465 | [pexels.com/photo/11667465](https://www.pexels.com/photo/crowd-on-courtyard-with-kabah-11667465/) |
| `pilgrims-ihram` | Pilgrims in ihram beside the Kaaba | 13294978 | [pexels.com/photo/13294978](https://www.pexels.com/photo/people-at-the-kaaba-13294978/) |
| `kiswah-detail` | The Kiswah — gold calligraphy on black silk, close detail | 27347926 | [pexels.com/photo/27347926](https://www.pexels.com/photo/the-kaaba-is-a-black-cube-with-gold-writing-27347926/) |
| `nabawi-green-dome` | The Green Dome and minaret, Masjid an-Nabawi | 34642005 | [pexels.com/photo/34642005](https://www.pexels.com/photo/green-dome-and-minaret-of-prophet-s-mosque-in-medina-34642005/) |
| `nabawi-twilight` | Masjid an-Nabawi at twilight | 34246953 | [pexels.com/photo/34246953](https://www.pexels.com/photo/twilight-view-of-al-masjid-an-nabawi-in-medina-34246953/) |
| `makkah-skyline-night` | Makkah at night, Haram and the clock tower | 3742589 | [pexels.com/photo/3742589](https://www.pexels.com/photo/crowd-in-mecca-at-night-3742589/) |
| `flight-approach` | An airliner on final approach against a flat grey sky, no livery visible | 358319 | [pexels.com/photo/358319](https://www.pexels.com/photo/white-airplane-358319/) |
| `tawaf-crowd` | Tawaf, dense crowd circling the Kaaba | 4118058 | [pexels.com/photo/4118058](https://www.pexels.com/photo/crowd-of-people-gathering-around-kaaba-site-4118058/) |

## Two things that were deliberate

**Competitor imagery was not an option.** The photography on Al Habib's site is
copyrighted, and "it is on the internet" is not a licence. Everything here is from
a source whose terms permit commercial use in writing.

**Every image was viewed before it was accepted.** A filename saying `kaaba-day`
is not evidence the file shows the Kaaba. Each was rendered and checked against
its claimed subject before being kept — on a site about the two holiest sites in
Islam, shipping a mislabelled or inappropriate image is a worse failure than
shipping none.

## Still wanted

- **The 42 hotels** in `data/hotels.ts` — exteriors and lobbies, one per property.
  Generic stock hotel rooms would be a lie by implication, since the card names a
  specific property. The site is already wired for these: drop
  `<hotel id>.jpg` in this directory and run `npm run images`, and no code changes.
  **See [HOTEL-PHOTOS.md](HOTEL-PHOTOS.md)** for the per-property sourcing routes
  and why the hotels' own website photography is not usable without permission.
- **UK departure** — an airport image for the city landing pages.
- **Client-supplied photography** of actual groups, if it exists. Real pilgrims
  the agency has travelled with beats any stock image on this page for trust,
  and it is the one thing a competitor cannot copy.

## If you replace these

Drop the new file in this directory, delete the old one, and run `npm run images`.
Update this table in the same commit — a credits file that has drifted from the
directory is worse than none, because it is believed.
