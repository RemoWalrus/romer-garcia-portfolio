import { useEffect, useState } from "react";

/**
 * Estimates a focal point for cropping so faces stay inside the frame.
 * Uses the native FaceDetector API when available, otherwise a YCbCr skin-tone
 * scan on a downscaled copy of the image, biased toward the TOP of the skin
 * mass (heads sit above bodies).
 * Returns a CSS `object-position` value. Results are cached per image URL.
 */

const cache = new Map<string, string>();

const isSkin = (r: number, g: number, b: number) => {
  // YCbCr skin range + simple RGB sanity checks.
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return (
    y > 40 &&
    cb >= 77 &&
    cb <= 135 &&
    cr >= 133 &&
    cr <= 180 &&
    r > 55 &&
    r > b &&
    Math.max(r, g, b) - Math.min(r, g, b) > 10
  );
};

export function useSmartCrop(src?: string | null, fallback = "center 25%") {
  const [position, setPosition] = useState(() => (src && cache.get(src)) || fallback);

  useEffect(() => {
    if (!src) {
      setPosition(fallback);
      return;
    }

    const cached = cache.get(src);
    if (cached) {
      setPosition(cached);
      return;
    }

    setPosition(fallback);

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const apply = (xPct: number, yPct: number) => {
      const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
      const value = `${clamp(xPct)}% ${clamp(yPct)}%`;
      cache.set(src, value);
      if (!cancelled) setPosition(value);
    };

    img.onload = async () => {
      // 1) Native face detection when the browser supports it.
      try {
        const FD = (
          window as unknown as {
            FaceDetector?: new (o?: unknown) => {
              detect: (i: unknown) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
            };
          }
        ).FaceDetector;
        if (FD) {
          const faces = await new FD({ fastMode: true }).detect(img);
          if (faces?.length) {
            const cx =
              faces.reduce((s, f) => s + f.boundingBox.x + f.boundingBox.width / 2, 0) /
              faces.length;
            const cy =
              faces.reduce((s, f) => s + f.boundingBox.y + f.boundingBox.height / 2, 0) /
              faces.length;
            apply((cx / img.naturalWidth) * 100, (cy / img.naturalHeight) * 100);
            return;
          }
        }
      } catch {
        /* fall through to heuristic */
      }

      // 2) Skin-tone scan, weighted toward the head.
      try {
        const w = 128;
        const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        const rows = new Float32Array(h);
        const cols = new Float32Array(w);
        let total = 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            if (data[i + 3] < 32) continue;
            if (isSkin(data[i], data[i + 1], data[i + 2])) {
              rows[y] += 1;
              cols[x] += 1;
              total += 1;
            }
          }
        }

        if (total < w * h * 0.003) return; // not enough skin — keep fallback

        // Vertical: find the topmost meaningful skin row, then sit just below it
        // (roughly the middle of a head) instead of the body centroid.
        const rowThreshold = Math.max(1, (total / h) * 0.35);
        let topRow = -1;
        let bottomRow = -1;
        for (let y = 0; y < h; y++) {
          if (rows[y] >= rowThreshold) {
            if (topRow === -1) topRow = y;
            bottomRow = y;
          }
        }
        if (topRow === -1) return;

        const span = Math.max(1, bottomRow - topRow);
        // Head height ~ 1/7 of a full figure; aim a bit below the top edge.
        const focusY = topRow + Math.min(span * 0.5, span / 7 + 1);

        // Horizontal: centroid of skin columns inside the detected band.
        let sumX = 0;
        let countX = 0;
        for (let y = topRow; y <= Math.min(h - 1, topRow + Math.ceil(span / 4)); y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            if (isSkin(data[i], data[i + 1], data[i + 2])) {
              sumX += x;
              countX += 1;
            }
          }
        }
        let focusX = w / 2;
        if (countX > 0) focusX = sumX / countX;
        else {
          let cSum = 0;
          let cCount = 0;
          for (let x = 0; x < w; x++) {
            cSum += cols[x] * x;
            cCount += cols[x];
          }
          if (cCount > 0) focusX = cSum / cCount;
        }

        apply((focusX / w) * 100, (focusY / h) * 100);
      } catch {
        /* keep fallback (tainted canvas, etc.) */
      }
    };

    img.onerror = () => {
      /* keep fallback */
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, fallback]);

  return position;
}
