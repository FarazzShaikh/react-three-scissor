import { useEffect } from "react";
import store from "../store";

import { tScissorCallback } from "../ScissorTypes";

export default function useScissorFrame(cb: tScissorCallback, uuid: string[]) {
  const windows = store((s) => s.windows);

  const addSubscriber = store((s) => s.addSubscriber);
  const removeSubscriber = store((s) => s.removeSubscriber);

  useEffect(() => {
    addSubscriber(cb, uuid);
    return () => removeSubscriber(uuid);
  }, [windows]);
}
