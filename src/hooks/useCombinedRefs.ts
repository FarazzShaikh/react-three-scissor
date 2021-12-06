import React from "react";

export default function useCombinedRefs<T>(...refs: any[]) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;
      ref.current = targetRef.current;
    });
  }, [refs]);

  return targetRef;
}
