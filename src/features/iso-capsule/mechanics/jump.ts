import type { Player } from "../player";
import type { CapsuleInput } from "../input";

export class Jump {
  velocity: number;
  private input: CapsuleInput;

  constructor(input: CapsuleInput, velocity = 7) {
    this.input = input;
    this.velocity = velocity;
  }

  // Only attached to the grounded state, so no ground check needed here
  update(player: Player) {
    if (this.input.isDown("jump")) player.velocity.y = this.velocity;
  }
}
