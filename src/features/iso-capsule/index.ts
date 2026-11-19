import { defineFeature } from "../../engine/sandbox";
import { createCapsuleInput, defaultBindings, type Bindings } from "./input";
import { HALF_HEIGHT, Player } from "./player";
import { PlayerState } from "./playerStates";
import { Movement } from "./mechanics/movement";
import { Jump } from "./mechanics/jump";
import { Dash } from "./mechanics/dash";

type Options = { bindings?: Bindings };

// A capsule you drive with WASD / arrows, Space to jump, Shift to dash.
// Movement directions assume a camera on the (1, 1, 1) diagonal (see backdrops/iso).
// New mechanic = create it, expose its tuning here, list it under the states it works in.
export const isoCapsule = ({ bindings = defaultBindings }: Options = {}) =>
  defineFeature({
    name: "Capsule",
    setup(ctx) {
      const input = createCapsuleInput(ctx.keys, bindings);
      const movement = new Movement(input);
      const jump = new Jump(input);
      const dash = new Dash(input);

      ctx.gui.add(movement, "speed").min(0).max(20).step(0.1).name("Move Speed");
      ctx.gui.add(jump, "velocity").min(0).max(20).step(0.1).name("Jump Velocity");
      const dashFolder = ctx.gui.addFolder("Dash");
      dashFolder.add(dash, "speed").min(1).max(50).step(0.1).name("Speed");
      dashFolder.add(dash, "duration").min(0.05).max(1).step(0.01).name("Duration");
      dashFolder.add(dash, "cooldown").min(0).max(3).step(0.01).name("Cooldown");

      // dash runs last so it can take over velocity on the frame it starts
      const player = new Player()
        .addState(PlayerState.Grounded, [movement, jump, dash])
        .addState(PlayerState.Airborne, [movement, dash])
        .addState(PlayerState.Dashing, [dash]);

      ctx.add(player);
      ctx.onUpdate((dt) => player.update(dt));

      // restHeight: the capsule's center height when standing on the ground
      return { player, dash, restHeight: HALF_HEIGHT };
    },
  });
