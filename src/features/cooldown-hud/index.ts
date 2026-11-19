import "./cooldownHud.css";
import { defineFeature } from "../../engine/sandbox";

// Anything with a total cooldown and a remaining time can be shown
export type CooldownSource = { cooldown: number; readonly cooldownRemaining: number };

type Row = {
  source: CooldownSource;
  root: HTMLDivElement;
  fill: HTMLDivElement;
  time: HTMLSpanElement;
};

// Bottom-left bars for cooldowns. Call track() on what setup returns.
export const cooldownHud = () =>
  defineFeature({
    name: "Cooldown HUD",
    setup(ctx) {
      const container = document.createElement("div");
      container.className = "cooldowns";
      document.body.appendChild(container);
      ctx.onDispose(() => container.remove());

      const rows: Row[] = [];

      // Rows are only visible while their cooldown is running
      ctx.onLateUpdate(() => {
        for (const { source, root, fill, time } of rows) {
          const remaining = source.cooldownRemaining;
          if (remaining <= 0) {
            root.style.display = "none";
            continue;
          }
          root.style.display = "";
          fill.style.transform = `scaleX(${Math.min(remaining / source.cooldown, 1)})`;
          time.textContent = `${remaining.toFixed(1)}s`;
        }
      });

      const track = (name: string, source: CooldownSource) => {
        const root = document.createElement("div");
        root.className = "cooldown";
        root.style.display = "none";

        const fill = document.createElement("div");
        fill.className = "cooldown-fill";

        const label = document.createElement("div");
        label.className = "cooldown-label";
        const nameEl = document.createElement("span");
        nameEl.textContent = name;
        const time = document.createElement("span");
        label.append(nameEl, time);

        root.append(fill, label);
        container.appendChild(root);
        rows.push({ source, root, fill, time });
      };

      return { track };
    },
  });
