// src/components/Pointer.tsx
import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody, BallCollider } from "@react-three/rapier";

export function Pointer() {
  const viewport = useThree((s) => s.viewport);
  const rigidRef = useRef<RapierRigidBody>(null);
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!rigidRef.current) return;

    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;

    smoothed.current.x = THREE.MathUtils.lerp(smoothed.current.x, x, 0.2);
    smoothed.current.y = THREE.MathUtils.lerp(smoothed.current.y, y, 0.2);

    rigidRef.current.setNextKinematicTranslation({
      x: smoothed.current.x,
      y: smoothed.current.y,
      z: 0,
    });
  });

  return (
    <RigidBody
      ref={rigidRef}
      type="kinematicPosition"
      colliders={false}
      position={[0, 0, 0]}
    >
      {/* Physics collider stays large to push balls */}
      <BallCollider args={[3]} />

      {/* Visual is smaller */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#006778"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </RigidBody>
  );
}
