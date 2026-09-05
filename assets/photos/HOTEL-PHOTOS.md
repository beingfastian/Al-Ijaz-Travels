# Hotel photography — how to get it, and what not to do

The site is wired to show a photograph of every one of the 42 properties in
`data/hotels.ts`. None are present yet, and every surface renders correctly
without them. This file is how they get here legally.

## Why we do not just download the hotels' own photos

It is the obvious move and it is the one that creates the liability.

A hotel's photography is owned by the hotel or its chain. Being published on
`marriott.com` is not a licence to republish it on ours — if anything, an official
image has clearer ownership and a more motivated owner than an anonymous one.
Accor, Marriott, Hilton and IHG all run takedown and brand-compliance functions,
and a UK travel agency reselling their properties is the easiest possible party
for them to find.

There is a second problem that matters just as much here. We cannot verify from a
search result that a file actually depicts the property it is captioned with. A
card that reads **Raffles Makkah Palace** above a photograph of a different tower
is precisely the authenticity failure this site is positioned against — and it is
worse than showing no photograph, because it is a specific claim rather than a
gap. `CREDITS.md` already records the same rule for the Haram photography: *every
image was viewed before it was accepted.*

So: no scraping, no reverse image search, no "it was on their website".

## The three routes that do grant a licence

**1. Bed-bank / wholesaler content APIs — best coverage, one agreement.**
If the agency books through a wholesaler, the imagery usually comes with the
contract. Hotelbeds' Content API serves hotel images in seven sizes from
`https://photos.hotelbeds.com/giata/`, and the same applies to Expedia Rapid,
WebBeds and Dida. Note that the [image documentation is purely
technical](https://developer.hotelbeds.com/documentation/hotels/content-api/use-images/)
— it grants nothing on its own. **The licence lives in the distribution contract,
so read that, and confirm in writing that static caching on our own domain is
permitted.** Some agreements require hotlinking from their CDN rather than
re-hosting, which would mean bypassing our image pipeline for those files.

**2. Chain trade/press libraries — good coverage for the 20 branded properties.**

| Chain | Properties | Where |
|---|---|---|
| Accor | 7 | [travelpros.accor.com media centre](https://travelpros.accor.com/gb/toolbox/media-center.shtml) (travel trade), [press.accor.com](https://press.accor.com/en) |
| Marriott | 3 | Marriott's asset library and the Content Guidelines that govern use of Marriott marks and imagery by travel companies — request via the partner/market contact |
| Hilton | 3 | [stories.hilton.com/media-library](https://stories.hilton.com/media-library) — brand assets incl. DoubleTree; `hiltonpr@hilton.com` |
| IHG | 2 | [IHG Brand Central](https://www.ihgbrandcentral.com/) (visual identity, photography), [IHG newsroom](https://www.ihgplc.com/en/news-and-media) |
| Louvre / Golden Tulip | 3 | Louvre Hotels Group press office |
| Millennium, Oberoi | 2 | Corporate press offices |

Read the terms on each. Trade libraries typically permit use *in the promotion of
that property*, which is exactly our use — but several require the image be used
unmodified and some require a credit line. `PackageImage.credit` exists for that
and renders under the photo automatically.

**3. Ask the properties directly — the only route for the other 22.**
The independent and regional-group hotels have no media portal. A short email to
the sales or reservations contact asking for a press/partner image pack for use on
our website is normal practice and usually answered, because it is free marketing
for them. Get the permission in writing, however brief, and record it in
`CREDITS.md`.

## Which route each property needs

Filenames must match the hotel id exactly — that is what makes the photo appear.

### Makkah

| Filename to use | Property | Owner / route |
|---|---|---|
| `raffles-makkah-palace.jpg` | Raffles Makkah Palace | Accor |
| `jabal-omar-marriott.jpg` | Jabal Omar Marriott Hotel, Makkah | Marriott |
| `swissotel-makkah.jpg` | Swissôtel Makkah | Accor |
| `fairmont-clock-royal-tower.jpg` | Fairmont Makkah Clock Royal Tower | Accor |
| `pullman-zamzam-makkah.jpg` | Pullman Zamzam Makkah | Accor |
| `hilton-suites-makkah.jpg` | Hilton Suites Makkah | Hilton |
| `sheraton-makkah-jabal-al-kaaba.jpg` | Sheraton Makkah Jabal Al Kaaba | Marriott |
| `doubletree-jabal-omar.jpg` | DoubleTree by Hilton Jabal Omar Makkah | Hilton |
| `emaar-grand-hotel-mecca.jpg` | Emaar Grand Hotel Mecca | Direct — confirm operator |
| `voco-makkah.jpg` | Voco Makkah | IHG |
| `al-kiswah-towers.jpg` | Al Kiswah Towers | Direct |
| `makarem-ajyad-makkah.jpg` | Makarem Ajyad Makkah Hotel | Makarem Hotels |
| `m-millennium-makkah.jpg` | M Millennium Makkah | Millennium Hotels & Resorts |
| `emaar-elite-makkah.jpg` | Emaar Elite Makkah Hotel | Direct — confirm operator |
| `le-meridien-towers-makkah.jpg` | Le Méridien Towers Makkah | Marriott |
| `al-sofwah-royale-orchid.jpg` | Al Sofwah Royale Orchid | Direct |
| `emaar-al-manar.jpg` | Emaar Al Manar Hotel | Direct — confirm operator |
| `snood-ajyad.jpg` | Snood Ajyad Hotel | Direct |
| `rehab-al-bait.jpg` | Rehab Al Bait Hotel | Direct |
| `dar-al-eiman-ajyad.jpg` | Dar Al Eiman Ajyad | Dar Al Eiman Group |
| `ruwad-al-bait.jpg` | Ruwad Al Bait Hotel | Direct |

### Madinah

| Filename to use | Property | Owner / route |
|---|---|---|
| `anwar-al-madinah-movenpick.jpg` | Anwar Al Madinah Mövenpick | Accor |
| `pullman-zamzam-madinah.jpg` | Pullman Zamzam Madinah | Accor |
| `crowne-plaza-madinah.jpg` | Crowne Plaza Madinah by IHG | IHG |
| `emaar-royal-hotel-medina.jpg` | Emaar Royal Hotel Medina | Direct — confirm operator |
| `oberoi-madinah.jpg` | Oberoi, Madina | Oberoi / EIH |
| `madinah-hilton.jpg` | Madinah Hilton | Hilton |
| `dar-al-taqwa.jpg` | Dar Al Taqwa Hotel | Direct |
| `novotel-madinah.jpg` | Novotel Madinah | Accor |
| `dar-al-eiman-grand.jpg` | Dar Al Eiman Grand | Dar Al Eiman Group |
| `salihiya-golden.jpg` | Salihiya Golden Hotel | Direct |
| `taiba-front.jpg` | Taiba Front Hotel | Direct |
| `al-madinah-harmony.jpg` | Al Madinah Harmony Hotel | Direct |
| `leader-al-muna-kareem.jpg` | Leader Al Muna Kareem | Direct |
| `golden-tulip-al-mkal.jpg` | Golden Tulip Al Mkal | Louvre / Golden Tulip |
| `new-madinah-hotel.jpg` | New Madinah Hotel | Direct |
| `al-eiman-ohud.jpg` | Al Eiman Ohud | Al Eiman Hotels |
| `ishraq-al-madinah.jpg` | Ishraq Al Madinah Hotel | Direct |
| `diyar-al-salam.jpg` | Diyar Al Salam Hotel | Direct |
| `golden-tulip-al-zahabi.jpg` | Golden Tulip Al Zahabi | Louvre / Golden Tulip |
| `al-ansar-golden-tulip.jpg` | Al Ansar Golden Tulip | Louvre / Golden Tulip |
| `elaf-grand-al-majeedi.jpg` | Elaf Grand Al Majeedi | Elaf Group |

Brand affiliations above are from the property names and should be confirmed
against the current contract — several Makkah and Madinah hotels have changed
operator, and the four "Emaar"-named properties are Saudi hotel groups rather than
Emaar Properties of Dubai, so check who actually holds the imagery.

## The importer

`scripts/hotel-photos.mjs` automates route 1. Three commands, deliberately
separated:

```bash
npm run photos:audit     # coverage: what we have, what is missing, per band
npm run photos:match     # propose supplier codes into supplier-map.json
npm run photos:fetch -- --rights-confirmed
```

Credentials come from the environment, never the repo. Set whichever you have and
the provider is chosen for you — there is nothing else to configure:

```bash
# Hotelbeds / HBX
HOTELBEDS_API_KEY=...  HOTELBEDS_SECRET=...  HOTELBEDS_ENV=production

# or Expedia Rapid
EXPEDIA_API_KEY=...  EXPEDIA_SHARED_SECRET=...
```

With credentials for both, pass `--provider=hotelbeds` or `--provider=expedia`.
With none, `--provider=mock` runs the whole pipeline offline against fixture data —
useful for checking the review gate behaves before wiring up a live account.

WebBeds and Dida expose equivalent content endpoints. An adapter is two methods,
`listProperties()` and `bestImage(code)`, so adding one is small.

**Both live adapters want one smoke run before a bulk match.** The auth schemes are
from published documentation and the image-URL shapes are verified, but the
property-listing call is the part that varies with how a contract scopes content —
Hotelbeds resolves Makkah/Madinah destination codes by name, and Rapid filters the
Saudi content set on city. Run `match` once and check the property count looks
sane before trusting 42 rows of output.

**Why matching and fetching are separate commands.** Our names and a wholesaler's
names do not agree, and the near-misses are dangerous rather than harmless:

| Ours | Supplier's | Score | Outcome |
|---|---|---|---|
| Oberoi, Madina | The Oberoi Madina | 1.00 | auto |
| Anwar Al Madinah Mövenpick | Movenpick Hotel Anwar Al Madinah | 1.00 | auto |
| M Millennium Makkah | Millennium Makkah Al Naseem | 0.40 | review |
| Dar Al Eiman Grand | Dar Al Eiman Ajyad | 0.60 | review |
| Golden Tulip Al Mkal | Golden Tulip Al Zahabi | 0.60 | review |

The last three are different hotels — Millennium Al Naseem is several kilometres
out, and the other two are sibling properties in the same group. A one-pass script
would have published all three under the wrong name. So `match` writes proposals
with scores and confirms nothing; `fetch` downloads only rows a human has set
`"confirmed": true` on. There is no flag to bypass that, and `--rights-confirmed`
is a separate assertion that someone has read the licensing terms in the contract.

`fetch` prefers general-view and exterior images over room close-ups, warns on
portrait sources (the slots are 16:10 and centre-crop), and prints the
verification checklist rather than assuming the job is done.

## Adding one

```bash
cp ~/pack/raffles-exterior.jpg assets/photos/raffles-makkah-palace.jpg
npm run images        # AVIF + WebP at 400/800/1200/1600, plus a JPEG fallback
npm run build
```

Nothing else. The photo is matched to the hotel by filename, so no page or data
file needs editing. Then, in the same commit:

1. **Look at it.** Confirm it is the right building. This is not optional.
2. **Add a row to `CREDITS.md`** naming the source and the permission relied on.
3. **Landscape crops only** — the slots are 16:10 and centre-cropped, so a
   portrait source loses its subject. Exteriors and lobbies work; tall tower shots
   do not.
4. **Set `photoAlt`** in `data/hotels.ts` if the image is not a general view. The
   automatic fallback is `"<name>, <city>"`, which is accurate for an exterior and
   thin for a room interior.
5. **Add a `credit`** where the licence requires attribution.

## Where they appear

| Surface | What shows |
|---|---|
| `/packages/<tier>/` | Lead pairing — two large 16:10 cards |
| `/packages/<tier>/<slug>/` | Hotel cards on every package detail page |
| `/hotels/` | 44 px thumbnails in the band rows, once a whole band is photographed |

The thumbnail column on `/hotels/` is all-or-nothing per star band on purpose: a
column where two of seven rows have an image reads as broken rather than partial.
Photograph a band completely and its thumbnails appear.
