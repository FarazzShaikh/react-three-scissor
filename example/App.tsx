import { Suspense, useState } from "react";
import { hot } from "react-hot-loader";

import { ScissorCanvas, ScissorWindow } from "../src/index";
import Model from "./Models";
import { softShadows } from "@react-three/drei";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import useMesh from "./useMesh";
import GitHubButton from "react-github-btn";
//@ts-ignore
import { Scrollbars } from "react-custom-scrollbars";
//@ts-ignore
import { AnimatePresence, motion } from "framer-motion/dist/es/index";

softShadows();

const container = {
  hidden: {
    scale: 0,
    transition: {
      staggerChildren: 10,
    },
  },
  show: {
    scale: 1,
    transition: {
      staggerChildren: 10,
    },
  },
};

const item = {
  hidden: { scale: 0 },
  show: { scale: 1 },
};

function Cells({ limit }: any) {
  const meshes = useMesh({ limit });

  return (
    <>
      <ScissorCanvas
        gl={{
          antialias: true,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Model meshes={meshes} />
        </Suspense>
      </ScissorCanvas>

      <AnimatePresence>
        <motion.div
          className="container"
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {meshes.map((m, i) => (
            <motion.div key={i} variants={item}>
              <ScissorWindow className="cell" uuid={`${i}`}>
                <div className="ScissorWindow-container">
                  <p>{m?.parent?.name || `Model ${i + 1}`}</p>
                </div>
              </ScissorWindow>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function App() {
  const [nMesh, setNMeshes] = useState(1);
  const [nMeshFinal, setNMeshesFinal] = useState(1);

  return (
    <Scrollbars
      autoHide //
      autoHideTimeout={1000}
      autoHideDuration={200}
    >
      <p className="title-container">
        react-three-<div className="title">Scissor</div>
      </p>

      <div className="github-btn ">
        <GitHubButton
          href="https://github.com/farazzshaikh/react-three-scissor"
          data-color-scheme="no-preference: light; light: light; dark: dark;"
          data-size="large"
          aria-label="Star farazzshaikh/react-three-scissor on GitHub"
        >
          Star
        </GitHubButton>
      </div>

      <div className="input">
        <span>
          <Slider
            min={1}
            max={100}
            onAfterChange={(v) => setNMeshesFinal(v)}
            onChange={(v) => setNMeshes(v)}
          />
          <div>
            {nMesh} mesh{nMesh > 1 ? "s" : ""}
          </div>
        </span>
      </div>

      <h3>Click + drag on each animal!</h3>
      <Suspense fallback={null}>
        <Cells limit={nMeshFinal} />
      </Suspense>
    </Scrollbars>
  );
}

export default process.env.NODE_ENV === "development" ? hot(module)(App) : App;
