// src/components/Clump.tsx
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  RapierRigidBody,
} from "@react-three/rapier";
import { useJaguarDecal } from "../utils/useJaguarDecal";

const rfs = THREE.MathUtils.randFloatSpread;

interface ClumpProps {
  count?: number;
  isMobile?: boolean;
}

export function Clump({ count = 40, isMobile = false }: ClumpProps) {
  // This is the correct ref type for InstancedRigidBodies
  const rigidBodies = useRef<(RapierRigidBody | null)[]>([]);
  const glassRef = useRef<THREE.InstancedMesh>(null);
  const decalRef = useRef<THREE.InstancedMesh>(null);
  const decalTex = useJaguarDecal(isMobile);

  const tempMat = useMemo(() => new THREE.Matrix4(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const forceVec = useMemo(() => new THREE.Vector3(), []);

  const instances = useMemo<InstancedRigidBodyProps[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      key: `sphere-${i}`,
      position: [rfs(8), rfs(8), rfs(8)] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    }));
  }, [count]);

  useFrame(() => {
    const glass = glassRef.current;
    const decal = decalRef.current;
    const bodies = rigidBodies.current;
    if (!glass || !decal || !bodies.length) return;

    const k = 12;
    const softening = 0.25;

    for (let i = 0; i < count; i++) {
      const body = bodies[i];
      if (!body) continue;

      const pos = body.translation();
      tempVec.set(pos.x, pos.y, pos.z);

      // Spring force toward origin
      const dist = tempVec.length();
      forceVec.copy(tempVec).multiplyScalar(-k);
      forceVec.multiplyScalar(1 / (1 + dist * softening));

      // Apply as impulse (scaled by approximate frame time)
      body.applyImpulse(
        { x: forceVec.x * 0.016, y: forceVec.y * 0.016, z: forceVec.z * 0.016 },
        true
      );

      const rot = body.rotation();
      tempMat.compose(
        tempVec,
        new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w),
        new THREE.Vector3(1, 1, 1)
      );

      glass.setMatrixAt(i, tempMat);
      decal.setMatrixAt(i, tempMat);
    }

    glass.instanceMatrix.needsUpdate = true;
    decal.instanceMatrix.needsUpdate = true;
  });

  const glassMaterial = isMobile ? (
    <meshStandardMaterial
      color="#006778"
      transparent
      opacity={0.85}
      roughness={0.1}
      metalness={0.1}
    />
  ) : (
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
  );

  return (
    <group>
      {/* Physics bodies - use colliders="ball" to auto-generate sphere colliders */}
      <InstancedRigidBodies
        ref={rigidBodies}
        instances={instances}
        colliders="ball"
        linearDamping={0.85}
        angularDamping={0.65}
      >
        <instancedMesh args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial visible={false} />
        </instancedMesh>
      </InstancedRigidBodies>

      {/* Visual glass spheres */}
      <instancedMesh
        ref={glassRef}
        castShadow
        receiveShadow
        args={[undefined, undefined, count]}
      >
        <sphereGeometry args={[1, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        {glassMaterial}
      </instancedMesh>

      {/* Logo decal layer */}
      {decalTex && (
        <instancedMesh ref={decalRef} args={[undefined, undefined, count]}>
          <sphereGeometry
            args={[1.015, isMobile ? 16 : 32, isMobile ? 16 : 32]}
          />
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
