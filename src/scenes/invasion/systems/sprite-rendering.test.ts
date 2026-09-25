import type { RenderCtx } from "@src/framework/render-system";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import SpriteRenderingSystem from "@src/scenes/invasion/systems/sprite-rendering";
import { addComponent, addEntity, createWorld } from "bitecs";
import { expect, test, vi } from "vitest";

interface SpriteRenderingSystemTestSetup {
  ctx: RenderCtx;
  system: SpriteRenderingSystem;
}

const setupTest = (): SpriteRenderingSystemTestSetup => ({
  ctx: {
    assetGetter: {
      getImage: vi.fn(),
      getAudio: vi.fn(),
    },
    renderer: {
      drawImage: vi.fn(),
      drawLine: vi.fn(),
      drawRect: vi.fn(),
      clearAll: vi.fn(),
    },
    world: createWorld(),
  },
  system: new SpriteRenderingSystem(),
});

test("entity has sprite and position, sprite is rendered at position", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = 1;
  Position.y[entity] = 2;
  Position.w[entity] = 3;
  Position.h[entity] = 4;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = "test123";
  Sprite.srcX[entity] = 15;
  Sprite.srcY[entity] = 16;
  Sprite.srcW[entity] = 17;
  Sprite.srcH[entity] = 18;
  Sprite.dstW[entity] = 19;
  Sprite.dstH[entity] = 20;

  system.render(ctx);

  expect(ctx.renderer.drawImage).toHaveBeenCalledWith("test123", 15, 16, 17, 18, 1, 2, 19, 20);
});
