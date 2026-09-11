import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_ENTITIES,
} from "@src/framework/constants";
import type { RenderCtx } from "@src/framework/render-system";
import type { InitializeCtx } from "@src/framework/scene";
import type { TickCtx } from "@src/framework/tick-system";
import { addComponent, addEntity, query } from "bitecs";

import spaceInvadersSpritesheet from "@src/assets/space_invaders.png";

const Position = {
  x: new Int16Array(MAX_ENTITIES),
  y: new Int16Array(MAX_ENTITIES),
  w: new Int16Array(MAX_ENTITIES),
  h: new Int16Array(MAX_ENTITIES),
};

const Velocity = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
};

const Sprite = {
  image: [] as HTMLImageElement[],
  srcX: new Int8Array(MAX_ENTITIES),
  srcY: new Int8Array(MAX_ENTITIES),
  srcW: new Int8Array(MAX_ENTITIES),
  srcH: new Int8Array(MAX_ENTITIES),
  dstW: new Int16Array(MAX_ENTITIES),
  dstH: new Int16Array(MAX_ENTITIES),
};

var spriteSheetImage: HTMLImageElement | undefined = undefined;

class TestRenderSystem {
  render(ctx: RenderCtx): void {
    ctx.rendering.imageSmoothingEnabled = false;

    for (const entity of query(ctx.world, [Position, Sprite])) {
      ctx.rendering.drawImage(
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

class TestTickSystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [Position, Velocity])) {
      const newY = Position.y[entity]! + Velocity.y[entity]!;
      const direction = Math.sign(Velocity.y[entity]!);

      if (newY + Position.h[entity]! > CANVAS_HEIGHT || newY < 0) {
        Velocity.y[entity] = direction * -1;
      } else {
        Position.y[entity] = newY;
        Velocity.y[entity]! += 0.3 * direction;
      }
    }
  }
}

export const initializeTestScene = (ctx: InitializeCtx): void => {
  spriteSheetImage = new Image();
  spriteSheetImage.src = spaceInvadersSpritesheet;

  ctx.systemRegistry.registerRenderSystem(new TestRenderSystem());
  ctx.systemRegistry.registerTickSystem(new TestTickSystem());

  const testEntity = addEntity(ctx.world);

  addComponent(ctx.world, testEntity, Position);
  addComponent(ctx.world, testEntity, Velocity);
  addComponent(ctx.world, testEntity, Sprite);

  const SQUARE_WH = 75;

  Position.x[testEntity] = CANVAS_WIDTH / 2 - SQUARE_WH / 2;
  Position.y[testEntity] = 10;
  Position.w[testEntity] = SQUARE_WH;
  Position.h[testEntity] = SQUARE_WH;

  Velocity.x[testEntity] = 0;
  Velocity.y[testEntity] = 1;

  Sprite.image[testEntity] = spriteSheetImage!;
  Sprite.srcX[testEntity] = 16;
  Sprite.srcY[testEntity] = 0;
  Sprite.srcW[testEntity] = 16;
  Sprite.srcH[testEntity] = 16;
  Sprite.dstW[testEntity] = SQUARE_WH;
  Sprite.dstH[testEntity] = SQUARE_WH;
};
