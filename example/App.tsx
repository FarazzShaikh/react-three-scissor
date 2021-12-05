import { useFrame } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { hot } from "react-hot-loader";
import Helpers from "./utils/Helpers";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  ScissorCanvas,
  ScissorScene,
  ScissorStore,
  ScissorWindow,
  useScissorFrame,
  useScissorInit,
} from "../src/index";

const arr = new Array(6).fill(0);

const Cube = ({ i, uuid }: any) => {
  const mesh = useRef<THREE.Mesh>();
  const orbit = useRef<OrbitControls>();

  useFrame((state, dt) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime);
      mesh.current.rotation.y = -Math.sin(state.clock.elapsedTime);
    }
  });

  useScissorFrame(
    (state) => {
      if (orbit.current) {
        orbit.current.update();
      }
    },
    [uuid]
  );

  useScissorInit(
    ({ camera, element }) => {
      camera.position.set(2, 2, 2);
      camera.lookAt(0, 0, 0);
      orbit.current = new OrbitControls(camera, element);
    },
    [uuid]
  );

  return (
    <group>
      <mesh ref={mesh}>
        <dodecahedronGeometry />
        <meshPhongMaterial
          color={0x156289}
          //@ts-ignore
          emissive={0x072534}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
      <pointLight args={[0xffffff, 1, 0]} position={[0, 200, 0]} />
      <pointLight args={[0xffffff, 1, 0]} position={[100, 200, 100]} />
      <pointLight args={[0xffffff, 1, 0]} position={[-100, -200, -100]} />
    </group>
  );
};

function App() {
  const refArray = useRef<HTMLElement[]>([]);
  const { getIds } = ScissorStore();

  return (
    <div className="container">
      <ScissorCanvas
        gl={{
          antialias: true,
        }}
      >
        <Suspense fallback={null}>
          {getIds().map((id, i) => (
            <ScissorScene uuid={id} key={i}>
              <group>
                <Cube i={i} uuid={id} />
                <Helpers />
              </group>
            </ScissorScene>
          ))}
        </Suspense>
      </ScissorCanvas>

      {arr.map((_, i) => (
        <ScissorWindow className="cell" uuid={`${i}`} key={i} />
      ))}
    </div>
  );
}

export default process.env.NODE_ENV === "development" ? hot(module)(App) : App;
