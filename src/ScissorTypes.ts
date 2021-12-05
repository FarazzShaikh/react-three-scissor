export interface iScissorWindow {
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  element: HTMLElement;

  hasInit?: boolean;
}

export type tScissorCallback = (
  state: Omit<Required<iScissorWindow>, "hasInit">
) => void;
