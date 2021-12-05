import create, { StoreApi } from "zustand";
import produce from "immer";
import { MathUtils, PerspectiveCamera, Scene } from "three";

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
  addWindow: (
    window: HTMLElement,
    id?: string,
    camera?: THREE.Camera
  ) => string;
  removeWindow: (id: string) => void;
  addGroup: (group: THREE.Group, id: string) => void;
}

export default create((set: any, get: any) => ({
  windows: {},
  addWindow: (window: HTMLElement, id?: string) => {
    const uuid = id ?? MathUtils.generateUUID();
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
          state.windows[id].scene = scene;
          state.windows[id].camera = camera ?? new PerspectiveCamera();
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
          Object.keys(state.frameSubscribers).forEach(
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
          Object.keys(state.initSubscribers).forEach(
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
