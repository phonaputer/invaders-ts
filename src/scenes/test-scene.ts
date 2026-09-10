import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@src/framework/constants";
import type { RenderCtx } from "@src/framework/render-system";
import type { InitializeCtx } from "@src/framework/scene";
import type { TickCtx } from "@src/framework/tick-system";

import spaceInvadersSpritesheet from "@src/assets/space_invaders.png";

const SQUARE_WH = 75,
  SQUARE_X = CANVAS_WIDTH / 2 - SQUARE_WH / 2,
  BASE_Y_SPEED = 1;

let direction = 1,
  squareY = 10,
  ySpeed = 1;

var spriteSheetImage: HTMLImageElement | undefined = undefined;

class TestRenderSystem {
  render(ctx: RenderCtx): void {
    ctx.rendering.imageSmoothingEnabled = false;
    ctx.rendering.drawImage(
      spriteSheetImage!,
      16,
      0,
      16,
      16,
      SQUARE_X,
      squareY,
      SQUARE_WH,
      SQUARE_WH,
    );
  }
}

class TestTickSystem {
  tick(_ctx: TickCtx): void {
    const newY = squareY + ySpeed * direction;
    if (newY + SQUARE_WH > CANVAS_HEIGHT || newY < 0) {
      direction = -direction;
      ySpeed = BASE_Y_SPEED;
    } else {
      squareY = newY;
      ySpeed += 0.3;
    }
  }
}

export const initializeTestScene = (ctx: InitializeCtx): void => {
  spriteSheetImage = new Image();
  spriteSheetImage.src = spaceInvadersSpritesheet;

  ctx.systemRegistry.registerRenderSystem(new TestRenderSystem());
  ctx.systemRegistry.registerTickSystem(new TestTickSystem());
};
