import create from "zustand";
import produce from "immer";
import * as THREE from "three";
import { iScissorWindow, tScissorCallback } from "./ScissorTypes";

interface iScissorRootState {
  windows: {
    [key: string]: iScissorWindow;
  };
  frameSubscribers: {
    [key: string]: tScissorCallback;
  };
  initSubscribers: {
    [key: string]: tScissorCallback;
  };
  addWindow: (window: HTMLElement, id?: string | undefined) => string;
  removeWindow: (id: string) => any;
  addScene: (
    scene: THREE.Scene,
    id: string,
    camera?: THREE.Camera | undefined
  ) => any;
  removeScene: (id: string) => any;
  sethasInit: (hasInit: boolean, id: string) => any;
  getIds: () => string[];
  addSubscriber: (cb: tScissorCallback, uuid: string[]) => any;
  removeSubscriber: (uuid: string[]) => any;
  addInitSubscriber: (cb: tScissorCallback, uuid: string[]) => any;
  removeInitSubscriber: (uuid: string[]) => any;
}

export default create<iScissorRootState>((set: any, get: any) => ({
  windows: {},
  addWindow: (window: HTMLElement, id?: string) => {
    const uuid = id ?? THREE.MathUtils.generateUUID();
    set(
      produce((state: iScissorRootState) => {
        state.windows[uuid] = {
          element: window,
        };
      })
    );

    return uuid;
  },
  removeWindow: (id: string) =>
    set(
      produce((state: iScissorRootState) => {
        delete state.windows[id];
      })
    ),

  addScene: (scene: THREE.Scene, id: string, camera?: THREE.Camera) =>
    set(
      produce((state: iScissorRootState) => {
        if (state.windows[id]) {
          const elem = state.windows[id].element;
          const rect = elem.getBoundingClientRect();
          state.windows[id].scene = scene;
          state.windows[id].camera =
            camera ??
            new THREE.PerspectiveCamera(
              75,
              rect.width / rect.height,
              0.1,
              1000
            );
          state.windows[id].hasInit = false;
        }
      })
    ),

  removeScene: (id: string) => get().removeWindow(id),

  sethasInit: (hasInit: boolean, id: string) =>
    set(
      produce((state: iScissorRootState) => {
        state.windows[id].hasInit = hasInit;
      })
    ),

  getIds: () => Object.keys((get() as iScissorRootState).windows),

  frameSubscribers: {},
  addSubscriber: (cb: tScissorCallback, uuid: string[]) =>
    set(
      produce((state: iScissorRootState) => {
        if (uuid.length > 0) {
          uuid.forEach((id) => (state.frameSubscribers[id] = cb));
        } else {
          Object.keys(state.windows).forEach(
            (k) => (state.frameSubscribers[k] = cb)
          );
        }
      })
    ),
  removeSubscriber: (uuid: string[]) =>
    set(
      produce((state: iScissorRootState) => {
        if (uuid.length > 0) {
          uuid.forEach((id) => delete state.frameSubscribers[id]);
        } else {
          state.frameSubscribers = {};
        }
      })
    ),

  initSubscribers: {},
  addInitSubscriber: (cb: tScissorCallback, uuid: string[]) =>
    set(
      produce((state: iScissorRootState) => {
        if (uuid.length > 0) {
          uuid.forEach((id) => (state.initSubscribers[id] = cb));
        } else {
          Object.keys(state.windows).forEach(
            (k) => (state.initSubscribers[k] = cb)
          );
        }
      })
    ),
  removeInitSubscriber: (uuid: string[]) =>
    set(
      produce((state: iScissorRootState) => {
        if (uuid.length > 0) {
          uuid.forEach((id) => delete state.initSubscribers[id]);
        } else {
          state.initSubscribers = {};
        }
      })
    ),
}));
