/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useRef } from "react";
import { useGLTF, Center, Plane } from "@react-three/drei";

import * as THREE from "three";
import { ScissorScene, useScissorFrame, useScissorInit } from "../src";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Helpers from "./utils/Helpers";

export default function Model({ meshes }: { meshes: THREE.Mesh[] }) {
  const orbit = useRef<OrbitControls>();
  useScissorFrame(() => {
    if (orbit.current) {
      orbit.current.update();
    }
  }, []);

  useScissorInit(({ camera: genericCamera, element, scene }) => {
    const camera = genericCamera as THREE.PerspectiveCamera;

    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
    orbit.current = new OrbitControls(camera, element);

    const bBox = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    bBox.getSize(size);
    const height = size.y;
    const dist = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
    const pos = scene.position;

    const fac = 1.5;
    camera.position.setScalar(dist).multiplyScalar(fac);
    camera.lookAt(pos);
  }, []);

  return (
    <>
      {meshes.map((m, i) => {
        return (
          <ScissorScene uuid={`${i}`} key={i}>
            <color
              attach="background"
              args={[new THREE.Color('#f9f5f2')]}
            />
            <group scale={0.1} rotation-x={THREE.MathUtils.degToRad(90)}>
              <Center>
                <mesh castShadow geometry={m.geometry}>
                  <meshBasicMaterial vertexColors />
                </mesh>
              </Center>
            </group>

            <ambientLight intensity={0.2} />
            <directionalLight
              castShadow
              receiveShadow
              position={[0, 10, 0]}
              intensity={0.5}
              shadow-mapSize-height={512}
              shadow-mapSize-width={512}
            />

            <Plane
              receiveShadow
              rotation-x={THREE.MathUtils.degToRad(-90)}
              scale={20}
            >
              <shadowMaterial color={"#fef5ed"} />
            </Plane>

            <Helpers />
          </ScissorScene>
        );
      })}
    </>
  );
}

useGLTF.preload("/models/mesh.glb");
