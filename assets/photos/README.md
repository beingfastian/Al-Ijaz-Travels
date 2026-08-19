# Source photography

Drop licensed originals here at full resolution. Nothing in this directory is
served — `npm run images` reads it and writes resized, re-encoded copies into
`public/img/`, which is what ships.

## Naming

The filename becomes both a URL and a TypeScript key, so it must be lowercase
letters, digits and hyphens only:

```
haram-night.jpg          ✓  →  key 'haram-night'
Haram at Night (2).JPG   ✗  →  the pipeline refuses it, with the reason
```

## Using one

```bash
npm run images     # encodes AVIF + WebP at 400/800/1200/1600, plus a JPEG fallback
```

Then reference it by key:

```ts
images: [{ key: 'haram-night', alt: 'The Masjid al-Haram courtyard at night' }],
```

`key` is typed against the generated manifest, so naming a photo that has not been
processed fails `npm run typecheck` rather than shipping an `<img>` that 404s.

## Notes

- **Originals stay out of `public/`.** A 6 MB source in `public/` is downloadable
  by anyone who guesses the URL, and counts against nothing but your bandwidth.
- **EXIF is stripped** on the way through. Client and photographer files routinely
  carry GPS coordinates and camera serial numbers; none of that belongs on a
  public URL.
- **Nothing is upscaled.** A 900 px source produces 400 and 800, not a soft 1600.
- **Re-encoding is incremental** — only sources newer than their outputs are
  processed, so re-running is cheap.
- **Alt text is not optional.** These images carry the trust signal that the whole
  site is built on; they are never decorative.
