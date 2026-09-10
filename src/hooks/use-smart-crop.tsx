import { useEffect, useState } from "react";

/**
 * Estimates a focal point for cropping so faces stay inside the frame.
 * Uses the native FaceDetector API when available, otherwise falls back to a
 * lightweight skin-tone density scan on a downscaled copy of the image.
 * Returns a CSS `object-position` value.
 */
export function useSmartCrop(src?: string | null, fallback = "center 30%") {
  const [position, setPosition] = useState(fallback);

  useEffect(() => {
    if (!src) {
      setPosition(fallback);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const apply = (xPct: number, yPct: number) => {
      if (cancelled) return;
      const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
      setPosition(`${clamp(xPct)}% ${clamp(yPct)}%`);
    };

    img.onload = async () => {
      // 1) Native face detection when the browser supports it.
      try {
        const FD = (window as unknown as { FaceDetector?: new (o?: unknown) => { detect: (i: unknown) => Promise<Array<{ boundingBox: DOMRectReadOnly }>> } }).FaceDetector;
        if (FD) {
          const faces = await new FD({ fastMode: true }).detect(img);
          if (faces?.length) {
            const cx =
              faces.reduce((s, f) => s + f.boundingBox.x + f.boundingBox.width / 2, 0) / faces.length;
            const cy =
              faces.reduce((s, f) => s + f.boundingBox.y + f.boundingBox.height / 2, 0) / faces.length;
            apply((cx / img.naturalWidth) * 100, (cy / img.naturalHeight) * 100);
            return;
          }
        }
      } catch {
        /* fall through to heuristic */
      }

      // 2) Skin-tone density heuristic.
      try {
        const w = 96;
        const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        let sumX = 0;
        let sumY = 0;
        let count = 0;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const isSkin =
              r > 95 &&
              g > 40 &&
              b > 20 &&
              max - min > 15 &&
              Math.abs(r - g) > 15 &&
              r > g &&
              g > b;
            if (isSkin) {
              sumX += x;
              sumY += y;
              count++;
            }
          }
        }

        if (count > w * h * 0.004) {
          apply((sumX / count / w) * 100, (sumY / count / h) * 100);
        }
      } catch {
        /* keep fallback (tainted canvas, etc.) */
      }
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, fallback]);

  return position;
}
