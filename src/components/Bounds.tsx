import { usePlane } from "@react-three/cannon";

export function Bounds({ size = 12 }: { size?: number }) {
  // Floor / ceiling
  usePlane(() => ({ position: [0, -size, 0], rotation: [-Math.PI / 2, 0, 0] }));
  usePlane(() => ({ position: [0, size, 0], rotation: [Math.PI / 2, 0, 0] }));

  // Left / right
  usePlane(() => ({ position: [-size, 0, 0], rotation: [0, Math.PI / 2, 0] }));
  usePlane(() => ({ position: [size, 0, 0], rotation: [0, -Math.PI / 2, 0] }));

  // Back / front
  usePlane(() => ({ position: [0, 0, -size], rotation: [0, 0, 0] }));
  usePlane(() => ({ position: [0, 0, size], rotation: [0, Math.PI, 0] }));

  return null;
}
