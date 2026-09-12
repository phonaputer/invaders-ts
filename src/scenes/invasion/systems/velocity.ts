import type { TickCtx } from "@src/framework/tick-system";
import Position from "@src/scenes/invasion/components/position";
import Velocity from "@src/scenes/invasion/components/velocity";
import { query } from "bitecs";

export default class VelocitySystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [Velocity, Position])) {
      Position.x[entity]! += Velocity.x[entity]!;
      Position.y[entity]! += Velocity.y[entity]!;
    }
  }
}
