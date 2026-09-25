import type { RenderCtx } from "@src/framework/render-system";
import CollisionActive from "@src/scenes/invasion/components/collision-active";
import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import Position from "@src/scenes/invasion/components/position";
import { query } from "bitecs";

export default class DebugHitboxRenderingSystem {
  render(ctx: RenderCtx): void {
    for (const entity of query(ctx.world, [CollisionPassive, Position])) {
      ctx.renderer.drawRect(
        Position.x[entity]! + CollisionPassive.hitboxOffsetX[entity]!,
        Position.y[entity]! + CollisionPassive.hitboxOffsetY[entity]!,
        CollisionPassive.hitboxW[entity]!,
        CollisionPassive.hitboxH[entity]!,
        "#aaaaaa",
        1,
      );
    }

    for (const entity of query(ctx.world, [CollisionActive, Position])) {
      ctx.renderer.drawRect(
        Position.x[entity]! + CollisionActive.hitboxOffsetX[entity]!,
        Position.y[entity]! + CollisionActive.hitboxOffsetY[entity]!,
        CollisionActive.hitboxW[entity]!,
        CollisionActive.hitboxH[entity]!,
        "#bb00bb",
        1,
      );
    }
  }
}
