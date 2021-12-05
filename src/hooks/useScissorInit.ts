import { useEffect } from "react";
import store from "../store";

import { tScissorCallback } from "../ScissorTypes";

export default function useScissorInit(cb: tScissorCallback, uuid: string[]) {
  const addInitSubscriber = store((s) => s.addInitSubscriber);
  const removeInitSubscriber = store((s) => s.removeInitSubscriber);

  useEffect(() => {
    addInitSubscriber(cb, uuid);
    return () => removeInitSubscriber(uuid);
  }, []);
}
