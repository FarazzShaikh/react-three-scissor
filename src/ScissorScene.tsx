import React, { forwardRef, useEffect, useRef } from "react";
import store from "./store";

interface iScissorGroupProps {
  uuid: string;
}

function useCombinedRefs<T>(...refs: any[]) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;
      ref.current = targetRef.current;
    });
  }, [refs]);

  return targetRef;
}

const ScissorScene = forwardRef<
  THREE.Scene,
  React.PropsWithChildren<iScissorGroupProps>
>(({ uuid, children, ...rest }, ref) => {
  const addScene = store((s) => s.addScene);
  const removeScene = store((s) => s.removeScene);
  const localRef = useRef<THREE.Scene>();
  const combinedRef = useCombinedRefs<THREE.Scene>(ref, localRef);

  useEffect(() => {
    if (localRef.current) {
      addScene(localRef.current, uuid);
      return () => removeScene(uuid);
    }
  }, [localRef]);

  return (
    <scene {...rest} ref={combinedRef}>
      {children}
    </scene>
  );
});

export default ScissorScene;
