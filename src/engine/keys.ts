// Which keyboard keys are held right now (by KeyboardEvent.code, e.g. "KeyW", "Space").
// Features read this; they map keys to their own actions so the engine knows nothing about controls.
export type KeyState = {
  isDown(code: string): boolean;
  anyDown(codes: readonly string[]): boolean;
};

export const createKeys = (): KeyState & { dispose(): void } => {
  const down = new Set<string>();
  const onDown = (e: KeyboardEvent) => down.add(e.code);
  const onUp = (e: KeyboardEvent) => down.delete(e.code);
  const onBlur = () => down.clear();

  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  window.addEventListener("blur", onBlur);

  return {
    isDown: (code) => down.has(code),
    anyDown: (codes) => codes.some((code) => down.has(code)),
    dispose() {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    },
  };
};
