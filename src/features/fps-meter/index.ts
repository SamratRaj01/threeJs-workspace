import Stats from "stats.js";
import { defineFeature } from "../../engine/sandbox";

// The stats.js FPS panel in the top-left corner (click it to cycle FPS / ms / MB)
export const fpsMeter = () =>
  defineFeature({
    name: "FPS",
    setup(ctx) {
      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      ctx.onLateUpdate(() => stats.update());
      ctx.onDispose(() => stats.dom.remove());
    },
  });
