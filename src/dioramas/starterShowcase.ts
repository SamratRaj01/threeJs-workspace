import type { Diorama } from "../engine/sandbox";
import { studioBackdrop } from "../backdrops/studio";
import { starterShapes } from "../features/starter-shapes";
import { liquidSphere } from "../features/liquid-sphere";
import { fpsMeter } from "../features/fps-meter";
import { fullscreenOnDoubleClick } from "../features/fullscreen";

// The original starter scene: spinning shapes and a water blob on cobblestone
export const starterShowcase: Diorama = (sandbox) => {
  sandbox.use(studioBackdrop());
  sandbox.use(starterShapes());
  sandbox.use(liquidSphere());
  sandbox.use(fpsMeter());
  sandbox.use(fullscreenOnDoubleClick());
};
