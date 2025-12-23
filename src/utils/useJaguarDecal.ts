import * as THREE from "three";
import { useEffect, useState } from "react";

export function useJaguarDecal() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let disposed = false;
    const img = new Image();
    img.src = "/jacksonville-jaguars-logo-transparent.png";

    img.onload = () => {
      if (disposed) return;

      const canvasSize = 2048;
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      const scale = 0.5;
      const aspect = img.width / img.height;

      let drawW, drawH;
      if (aspect > 1) {
        drawW = canvasSize * scale;
        drawH = drawW / aspect;
      } else {
        drawH = canvasSize * scale;
        drawW = drawH * aspect;
      }

      const x = (canvasSize - drawW) / 2;
      const y = (canvasSize - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;

      // FIX SKEW via Texture Repeat
      tex.repeat.set(1.15, 1);
      tex.offset.set((1 - tex.repeat.x) / 2, (1 - tex.repeat.y) / 2);

      setTexture((prev) => {
        prev?.dispose?.();
        return tex;
      });
    };

    return () => {
      disposed = true;
      setTexture((prev) => {
        prev?.dispose?.();
        return null;
      });
    };
  }, []);

  return texture;
}
