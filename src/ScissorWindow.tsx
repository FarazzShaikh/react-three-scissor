import React, { forwardRef, useEffect, useRef } from "react";
import store from "./store";

interface iScissorWindowProps {
  uuid?: string;
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

const ScissorWindow = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<iScissorWindowProps & React.HTMLProps<HTMLDivElement>>
>(({ uuid, children, ...rest }, ref) => {
  const addWindow = store((s) => s.addWindow);
  const removeWindow = store((s) => s.removeWindow);
  const localRef = useRef();
  const combinedRef = useCombinedRefs<HTMLDivElement>(ref, localRef);

  useEffect(() => {
    if (localRef.current) {
      const _uuid = addWindow(localRef.current, uuid);
      return () => removeWindow(_uuid);
    }
  }, [localRef]);

  return (
    <div {...rest} ref={combinedRef}>
      {children}
    </div>
  );
});

export default ScissorWindow;
