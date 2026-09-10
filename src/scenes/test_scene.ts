import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@src/framework/constants";
import type { InitializeCtx } from "@src/framework/scene";
import type { TickCtx } from "@src/framework/tick_system";
import type { RenderCtx } from "@src/framework/render_system";

import spaceInvadersSpritesheet from "@src/assets/space_invaders.png";

const SQUARE_WH: number = 75;
const SQUARE_X: number = CANVAS_WIDTH / 2 - SQUARE_WH / 2;
var squareY: number = 10;
const BASE_Y_SPEED: number = 1;
var direction: number = 1;
var ySpeed: number = 1;

var spriteSheetImage: HTMLImageElement;

class TestRenderSystem {
  render(ctx: RenderCtx): void {
    ctx.rendering.imageSmoothingEnabled = false;
    ctx.rendering.drawImage(
      spriteSheetImage,
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
    let newY = squareY + ySpeed * direction;
    if (newY + SQUARE_WH > CANVAS_HEIGHT || newY < 0) {
      direction = -direction;
      ySpeed = BASE_Y_SPEED;
    } else {
      squareY = newY;
      ySpeed += 0.3;
    }
  }
}

export function initializeTestScene(ctx: InitializeCtx): void {
  spriteSheetImage = new Image();
  spriteSheetImage.src = spaceInvadersSpritesheet;

  ctx.systemRegistry.registerRenderSystem(new TestRenderSystem());
  ctx.systemRegistry.registerTickSystem(new TestTickSystem());
}
