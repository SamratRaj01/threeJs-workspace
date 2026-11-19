import * as THREE from "three";
import type { Player } from "../player";
import type { CapsuleInput } from "../input";

// Screen-aligned directions on the ground plane for a camera on the (1, 1, 1) diagonal
const forward = new THREE.Vector3(-1, 0, -1).normalize();
const right = new THREE.Vector3(1, 0, -1).normalize();

export class Movement {
  speed: number;
  private move = new THREE.Vector3();
  private input: CapsuleInput;

  constructor(input: CapsuleInput, speed = 5) {
    this.input = input;
    this.speed = speed;
  }

  update(player: Player) {
    const axis = this.input.moveAxis();
    this.move
      .set(0, 0, 0)
      .addScaledVector(forward, axis.y)
      .addScaledVector(right, axis.x);
    this.move.normalize(); // normalize so diagonals aren't faster
    if (this.move.lengthSq() > 0) player.facing.copy(this.move);

    player.velocity.x = this.move.x * this.speed;
    player.velocity.z = this.move.z * this.speed;
  }
}
