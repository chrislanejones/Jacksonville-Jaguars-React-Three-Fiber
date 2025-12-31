import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import { Bounds } from "./Bounds";
import { Pointer } from "./Pointer";
import { Clump } from "./Clump";

export function Scene() {
  const skyline = useTexture("/JacksonvilleSkyline.jpg");
  const scene = useThree((s) => s.scene);
  const [sphereCount, setSphereCount] = useState(40);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSphereCount(mobile ? 15 : 40);
  }, []);

  useEffect(() => {
    skyline.colorSpace = THREE.SRGBColorSpace;
    skyline.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = skyline;
    scene.background = null;
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
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
      />

      <Physics gravity={[0, -6, 0]}>
        <Bounds size={12} />
        <Pointer />
        <Clump count={sphereCount} isMobile={isMobile} />
      </Physics>

      {!isMobile && (
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
      )}
    </>
  );
}
