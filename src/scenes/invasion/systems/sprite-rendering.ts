import type { RenderCtx } from "@src/framework/render-system";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import { query } from "bitecs";

export default class SpriteRenderingSystem {
  render(ctx: RenderCtx): void {
    for (const entity of query(ctx.world, [Sprite, Position])) {
      ctx.renderer.drawImage(
        Sprite.image[entity]!,
        Sprite.srcX[entity]!,
        Sprite.srcY[entity]!,
        Sprite.srcW[entity]!,
        Sprite.srcH[entity]!,
        Position.x[entity]!,
        Position.y[entity]!,
        Sprite.dstW[entity]!,
        Sprite.dstH[entity]!,
      );
    }
  }
}
