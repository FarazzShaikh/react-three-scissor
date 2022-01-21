import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

const ghPagesBaseURl =
  process.env.NODE_ENV === "development"
    ? "/"
    : "https://farazzshaikh.github.io/react-three-scissor/";

export default function useMesh({ limit }: { limit: number }) {
  // @ts-ignore
  const { nodes } = useGLTF(`${ghPagesBaseURl}models/mesh.glb`);

  const meshes: THREE.Mesh[] = useMemo(
    () =>
      Object.values(nodes)
        .filter((o: any) => o.isMesh)
        .splice(0, limit) as any,
    [limit, nodes]
  );

  return meshes;
}

useGLTF.preload(`${ghPagesBaseURl}models/mesh.glb`);
