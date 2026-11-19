import type { Demo } from "../engine/sandbox";
import { studioEnvironment } from "../environments/studio";
import { starterShapes } from "../features/starter-shapes";
import { liquidSphere } from "../features/liquid-sphere";
import { fpsMeter } from "../features/fps-meter";
import { fullscreenOnDoubleClick } from "../features/fullscreen";

// The original starter scene: spinning shapes and a water blob on cobblestone
export const starterShowcase: Demo = (sandbox) => {
  sandbox.use(studioEnvironment());
  sandbox.use(starterShapes());
  sandbox.use(liquidSphere());
  sandbox.use(fpsMeter());
  sandbox.use(fullscreenOnDoubleClick());
};
