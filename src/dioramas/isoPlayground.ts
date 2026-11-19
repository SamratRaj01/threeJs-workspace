import type { Diorama } from "../engine/sandbox";
import { isoBackdrop } from "../backdrops/iso";
import { isoCapsule } from "../features/iso-capsule";
import { blobShadow } from "../features/blob-shadow";
import { directionArrow } from "../features/direction-arrow";
import { cooldownHud } from "../features/cooldown-hud";

// Drive a capsule around an isometric floor (WASD / arrows, Space, Shift)
export const isoPlayground: Diorama = (sandbox) => {
  const world = sandbox.use(isoBackdrop());
  const capsule = sandbox.use(isoCapsule());
  sandbox.use(blobShadow({ target: capsule.player, restHeight: capsule.restHeight }));
  sandbox.use(directionArrow({ target: capsule.player, facing: capsule.player.facing }));
  const hud = sandbox.use(cooldownHud());

  world.follow(capsule.player);
  hud.track("Dash", capsule.dash);
};
