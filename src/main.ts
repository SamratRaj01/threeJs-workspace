import { createSandbox } from "./engine/sandbox";
import { isoPlayground } from "./demos/isoPlayground";
// import { starterShowcase } from "./demos/starterShowcase";
// import { basicEnvironment } from "./environments/basic";
// import { liquidSphere } from "./features/liquid-sphere";

const sandbox = createSandbox(document.getElementById("c") as HTMLCanvasElement);

// Pick what to look at. Run a demo...
isoPlayground(sandbox);
// starterShowcase(sandbox);

// ...or test one feature on its own:
// sandbox.use(basicEnvironment());
// sandbox.use(liquidSphere());

sandbox.start();
