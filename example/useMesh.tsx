import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export default function useMesh({ limit }: any) {
  // @ts-ignore
  const { nodes, materials } = useGLTF("/models/mesh.glb");

  const meshes: THREE.Mesh[] = useMemo(
    () =>
      Object.values(nodes)
        .filter((o: any) => o.isMesh)
        .splice(0, limit) as any,
    [limit]
  );

  return meshes;
}
