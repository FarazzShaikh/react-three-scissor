import React, { forwardRef, useEffect, useRef } from "react";
import store from "./store";
import useCombinedRefs from "./hooks/useCombinedRefs";

interface iScissorWindowProps {
  uuid?: string;
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
    } else {
      return;
    }
  }, [localRef]);

  return (
    <div {...rest} ref={combinedRef}>
      {children}
    </div>
  );
});

export default ScissorWindow;
