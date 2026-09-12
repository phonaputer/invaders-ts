import type { TickCtx } from "@src/framework/tick-system";
import Position from "@src/scenes/invasion/components/position";
import PositionFollowing from "@src/scenes/invasion/components/position-following";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import { addComponent, entityExists, hasComponent, query } from "bitecs";

export default class PositionFollowingSystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [PositionFollowing, Position])) {
      const leader = PositionFollowing.leader[entity]!;

      if (!entityExists(ctx.world, leader) || !hasComponent(ctx.world, leader, Position)) {
        addComponent(ctx.world, entity, ToBeDeleted);
        continue;
      }

      Position.x[entity] = Position.x[leader]! + PositionFollowing.xOffset[entity]!;
      Position.y[entity] = Position.y[leader]! + PositionFollowing.yOffset[entity]!;
    }
  }
}
