import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useJaguarDecal } from "../utils/useJaguarDecal";

const rfs = THREE.MathUtils.randFloatSpread;
const glassGeometry = new THREE.SphereGeometry(1, 32, 32);
const decalGeometry = new THREE.SphereGeometry(1.015, 32, 32);

export function Clump({ count = 40 }: { count?: number }) {
  const glassRef = useRef<THREE.InstancedMesh>(null);
  const decalRef = useRef<THREE.InstancedMesh>(null);
  const decalTex = useJaguarDecal();

  const tempMat = useMemo(() => new THREE.Matrix4(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const forceVec = useMemo(() => new THREE.Vector3(), []);

  // Physics driver (hidden)
  const [physRef, api] = useSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1.5,
    angularDamping: 0.65,
    linearDamping: 0.85,
    position: [rfs(8), rfs(8), rfs(8)],
  }));

  useFrame(() => {
    const phys = physRef.current;
    const glass = glassRef.current;
    const decal = decalRef.current;
    if (!phys || !glass || !decal) return;

    const k = 12;
    const softening = 0.25;

    for (let i = 0; i < count; i++) {
      phys.getMatrixAt(i, tempMat);

      // position of this instance (approx)
      tempVec.setFromMatrixPosition(tempMat);

      // Smooth spring pull toward origin
      const dist = tempVec.length();
      forceVec.copy(tempVec).multiplyScalar(-k);
      forceVec.multiplyScalar(1 / (1 + dist * softening));

      api
        .at(i)
        .applyForce(forceVec.toArray() as [number, number, number], [0, 0, 0]);

      // Sync visible layers to physics
      glass.setMatrixAt(i, tempMat);
      decal.setMatrixAt(i, tempMat);
    }

    glass.instanceMatrix.needsUpdate = true;
    decal.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Physics driver (invisible) */}
      <instancedMesh
        ref={physRef}
        args={[glassGeometry, undefined, count]}
        visible={false}
      />

      {/* GLASS BALL */}
      <instancedMesh
        ref={glassRef}
        castShadow
        receiveShadow
        args={[glassGeometry, undefined, count]}
      >
        <meshPhysicalMaterial
          transmission={1}
          roughness={0.06}
          thickness={1.2}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.6}
          attenuationColor="#006778"
          attenuationDistance={3}
        />
      </instancedMesh>

      {/* LOGO DECAL */}
      {decalTex && (
        <instancedMesh ref={decalRef} args={[decalGeometry, undefined, count]}>
          <meshStandardMaterial
            map={decalTex}
            transparent
            alphaTest={0.5}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
            roughness={0.6}
            metalness={0}
          />
        </instancedMesh>
      )}
    </group>
  );
}
