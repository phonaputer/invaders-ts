import { GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import Position from "@src/scenes/invasion/components/position";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import Velocity from "@src/scenes/invasion/components/velocity";
import { addComponent, query } from "bitecs";

const OFFSCREEN_BOUNDARY = 5;

export default class VelocitySystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [Velocity, Position])) {
      Position.x[entity]! += Velocity.x[entity]!;
      Position.y[entity]! += Velocity.y[entity]!;
    }

    for (const entity of query(ctx.world, [Velocity, Position])) {
      const x = Position.x[entity]!;
      const y = Position.y[entity]!;
      const w = Position.w[entity]!;
      const h = Position.h[entity]!;

      if (
        x > GAME_WIDTH + OFFSCREEN_BOUNDARY ||
        x + w < 0 - OFFSCREEN_BOUNDARY ||
        y > GAME_HEIGHT + OFFSCREEN_BOUNDARY ||
        y + h < 0 - OFFSCREEN_BOUNDARY
      ) {
        addComponent(ctx.world, entity, ToBeDeleted);
      }
    }
  }
}
