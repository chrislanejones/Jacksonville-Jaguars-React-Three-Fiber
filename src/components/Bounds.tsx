import { CuboidCollider } from "@react-three/rapier";

export function Bounds({ size = 12 }: { size?: number }) {
  const thickness = 0.5;

  return (
    <>
      <CuboidCollider
        args={[size, thickness, size]}
        position={[0, -size - thickness, 0]}
      />
      <CuboidCollider
        args={[size, thickness, size]}
        position={[0, size + thickness, 0]}
      />
      <CuboidCollider
        args={[thickness, size, size]}
        position={[-size - thickness, 0, 0]}
      />
      <CuboidCollider
        args={[thickness, size, size]}
        position={[size + thickness, 0, 0]}
      />
      <CuboidCollider
        args={[size, size, thickness]}
        position={[0, 0, -size - thickness]}
      />
      <CuboidCollider
        args={[size, size, thickness]}
        position={[0, 0, size + thickness]}
      />
    </>
  );
}
