import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";

export function Pointer() {
  const viewport = useThree((s) => s.viewport);

  // Kinematic "hand" sphere
  // We make it invisible (visible=false) if you want a "force field" effect,
  // or keep it visible if you want to see the "ghost hand".
  // Let's keep it invisible but capable of collisions.
  const [, api] = useSphere<THREE.Mesh>(() => ({
    type: "Kinematic",
    args: [3], // Slightly smaller radius for better precision
    position: [0, 0, 0],
  }));

  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // R3F automatically handles mouse/touch normalization (-1 to +1)
    // inside state.pointer (previously state.mouse)
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;

    // "Lerp" (Linear Interpolation) smooths the movement so it doesn't jitter
    smoothed.current.x = THREE.MathUtils.lerp(smoothed.current.x, x, 0.2);
    smoothed.current.y = THREE.MathUtils.lerp(smoothed.current.y, y, 0.2);

    api.position.set(smoothed.current.x, smoothed.current.y, 0);
  });

  return (
    // Optional: Visual representation of the cursor (a faint teal glow)
    <mesh visible={true} scale={[1, 1, 1]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color="#006778"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </mesh>
  );
}
