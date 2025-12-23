import React from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";

export function App() {
  return (
    <Canvas
      shadows
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      // ✅ Clamping DPR is crucial for mobile performance.
      // [1, 1.5] means: "Use native res, but never go higher than 1.5x pixel density"
      // This keeps iPhones from trying to render 4k glass physics.
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 20], fov: 35, near: 0.1, far: 80 }}
    >
      <Scene />
    </Canvas>
  );
}
