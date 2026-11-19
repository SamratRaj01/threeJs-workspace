import { defineFeature } from "../../engine/sandbox";

declare global {
  interface Document {
    webkitExitFullscreen?: () => Promise<void>;
    webkitFullscreenElement?: Element;
  }
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

// Double-click anywhere to toggle fullscreen on the canvas
export const fullscreenOnDoubleClick = () =>
  defineFeature({
    name: "Fullscreen",
    setup(ctx) {
      const toggle = () => {
        const current = document.fullscreenElement || document.webkitFullscreenElement;
        if (!current) {
          // webkit fallback for older Safari; does not work on Safari mobile
          if (ctx.canvas.requestFullscreen) ctx.canvas.requestFullscreen();
          else ctx.canvas.webkitRequestFullscreen?.();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        } else {
          document.webkitExitFullscreen?.();
        }
      };
      window.addEventListener("dblclick", toggle);
      ctx.onDispose(() => window.removeEventListener("dblclick", toggle));
    },
  });
