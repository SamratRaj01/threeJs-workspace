import * as THREE from "three";
import type { KeyState } from "../../engine/keys";

// Action -> keys. Rebind here; mechanics only know action names.
export const defaultBindings = {
  forward: ["KeyW", "ArrowUp"],
  backward: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  jump: ["Space"],
  dash: ["ShiftLeft", "ShiftRight"],
} satisfies Record<string, string[]>;

export type Action = keyof typeof defaultBindings;
export type Bindings = Record<Action, readonly string[]>;

// What mechanics read. Passed in rather than imported so a mechanic can be driven by anything.
export type CapsuleInput = {
  isDown(action: Action): boolean;
  // x: right (+) / left (-), y: forward (+) / backward (-). Opposite keys cancel out.
  moveAxis(): THREE.Vector2;
};

export const createCapsuleInput = (
  keys: KeyState,
  bindings: Bindings = defaultBindings
): CapsuleInput => {
  const axis = new THREE.Vector2();
  const isDown = (action: Action) => keys.anyDown(bindings[action]);
  return {
    isDown,
    moveAxis: () =>
      axis.set(
        Number(isDown("right")) - Number(isDown("left")),
        Number(isDown("forward")) - Number(isDown("backward"))
      ),
  };
};
