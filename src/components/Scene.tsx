// src/components/Scene.tsx
import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import { Bounds } from "./Bounds";
import { Pointer } from "./Pointer";
import { Clump } from "./Clump";

export function Scene() {
  const skyline = useTexture("/JacksonvilleSkyline.jpg");
  const scene = useThree((s) => s.scene);
  const [sphereCount, setSphereCount] = useState(40);

  // Check if mobile on mount to adjust performance load
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setSphereCount(isMobile ? 20 : 40);
  }, []);

  // Skyline is used ONLY for glass reflections/refraction (NOT the background)
  useEffect(() => {
    skyline.colorSpace = THREE.SRGBColorSpace;
    skyline.mapping = THREE.EquirectangularReflectionMapping;

    const prevEnv = scene.environment;
    const prevBg = scene.background;

    scene.environment = skyline;
    scene.background = null; // keep CSS background visible

    return () => {
      scene.environment = prevEnv ?? null;
      scene.background = prevBg ?? null;
    };
  }, [skyline, scene]);

  return (
    <>
      <ambientLight intensity={1.25} />
      <spotLight
        intensity={1.25}
        angle={0.25}
        penumbra={1}
        position={[30, 30, 30]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Physics
        gravity={[0, -6, 0]}
        iterations={20}
        allowSleep
        broadphase="SAP"
        defaultContactMaterial={{ friction: 0.2, restitution: 0.6 }}
      >
        <Bounds size={12} />
        <Pointer />
        {/* Pass the dynamic count to Clump based on device width */}
        <Clump count={sphereCount} />
      </Physics>

      <EffectComposer enableNormalPass={false} multisampling={0}>
        <N8AO
          halfRes
          aoRadius={1.6}
          intensity={0.7}
          aoSamples={6}
          denoiseSamples={4}
        />
        <SMAA />
      </EffectComposer>
    </>
  );
}
