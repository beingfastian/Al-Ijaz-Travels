import { IMAGES, type GeneratedImage, type ImageKey } from '@/data/images.generated';

/**
 * A photograph from the build-time pipeline.
 *
 * Next's <Image> is deliberately not used for photography here. Under
 * `images.unoptimized` it emits a single `src` with no `srcset`, so a phone on 4G
 * downloads the desktop file — the optimizer it normally delegates to does not
 * exist on a static host. This renders the real thing instead: AVIF, then WebP,
 * then a JPEG that every browser can read, at the widths scripts/images.mjs
 * actually produced.
 *
 * `sizes` is required rather than defaulted. The browser cannot know how wide
 * this renders, and a wrong `sizes` quietly picks the wrong file — which is the
 * whole cost this component exists to avoid, so it is worth one prop of thought
 * at each call site.
 */

interface PhotoProps {
  /** A key from the generated manifest — an unprocessed photo will not compile. */
  image: ImageKey;
  /** Never decorative: these carry the trust signal, so they get real alt text. */
  alt: string;
  sizes: string;
  className?: string;
  /**
   * Set on the LCP image only — the hero, or the first card above the fold.
   * Marking everything priority is the same as marking nothing.
   */
  priority?: boolean;
}

export function Photo({ image, alt, sizes, className, priority = false }: PhotoProps) {
  // The manifest is empty until photography lands, so this cannot be indexed
  // directly while ImageKey is still `never`.
  const asset: GeneratedImage | undefined = (IMAGES as Record<string, GeneratedImage>)[image];
  if (!asset) return null;

  return (
    // `contents` keeps <picture> out of the layout, so `className` lands on the
    // element that is actually laid out and object-cover behaves as written.
    <picture className="contents">
      <source type="image/avif" srcSet={asset.avif.join(', ')} sizes={sizes} />
      <source type="image/webp" srcSet={asset.webp.join(', ')} sizes={sizes} />
      <img
        src={asset.fallback}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={className}
      />
    </picture>
  );
}
