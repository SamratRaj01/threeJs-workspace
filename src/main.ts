import { createSandbox } from "./engine/sandbox";
import { isoPlayground } from "./dioramas/isoPlayground";
// import { starterShowcase } from "./dioramas/starterShowcase";
// import { basicBackdrop } from "./backdrops/basic";
// import { liquidSphere } from "./features/liquid-sphere";

const sandbox = createSandbox(document.getElementById("c") as HTMLCanvasElement);

// Pick what to look at. Run a diorama...
isoPlayground(sandbox);
// starterShowcase(sandbox);

// ...or test one feature on its own:
// sandbox.use(basicBackdrop());
// sandbox.use(liquidSphere());

sandbox.start();
