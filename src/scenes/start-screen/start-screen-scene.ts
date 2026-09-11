import type { RenderCtx } from "@src/framework/render-system";
import type Renderer from "@src/framework/renderer";
import type { InitializeCtx } from "@src/framework/scene";
import type { TickCtx } from "@src/framework/tick-system";
import { Input } from "@src/framework/user-input";
import SpriteTextRenderer from "@src/scenes/sprite-text-renderer";
import { initializeTestScene } from "@src/scenes/test-scene";

import spriteSheetSrc from "@src/assets/space_invaders.png";

const SPACE_TO_SCENE_SWAP_MS = 750;
let spaceEngagedTime = 0;

const BLINK_MS = 50;
let isBlinkingTextVisible = true;
let lastBlinkMs = 0;
let blinkEngaged = false;

interface TextRenderer {
  renderTextCentered: (renderer: Renderer, y: number, text: string) => void;
}

class RenderSystem {
  private readonly textRenderer: TextRenderer;
  private readonly spriteSheetImage: HTMLImageElement;

  constructor(textRenderer: TextRenderer, spriteSheetImage: HTMLImageElement) {
    this.textRenderer = textRenderer;
    this.spriteSheetImage = spriteSheetImage;
  }

  render(ctx: RenderCtx): void {
    this.textRenderer.renderTextCentered(ctx.renderer, 60, "personal space invaders");

    ctx.renderer.drawImage(this.spriteSheetImage, 64, 0, 16, 16, 60, 85, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 90, " - 10 points");

    ctx.renderer.drawImage(this.spriteSheetImage, 16, 16, 16, 16, 60, 100, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 105, " - 20 points");

    ctx.renderer.drawImage(this.spriteSheetImage, 16, 0, 16, 16, 60, 115, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 120, " - 30 points");

    ctx.renderer.drawImage(this.spriteSheetImage, 96, 0, 16, 16, 60, 130, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 135, " - 40 points");

    ctx.renderer.drawImage(this.spriteSheetImage, 96, 64, 24, 16, 52, 145, 24, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 150, " -  ? points");

    this.textRenderer.renderTextCentered(ctx.renderer, 180, "<a> and <d> to move");
    this.textRenderer.renderTextCentered(ctx.renderer, 190, "<space> to shoot");

    if (isBlinkingTextVisible) {
      this.textRenderer.renderTextCentered(ctx.renderer, 220, "press <space> to begin");
    }
  }
}

class TickSystem {
  tick(ctx: TickCtx): void {
    if (blinkEngaged) {
      if (ctx.currentMs > lastBlinkMs + BLINK_MS) {
        lastBlinkMs = ctx.currentMs;
        isBlinkingTextVisible = !isBlinkingTextVisible;
      }

      if (ctx.currentMs > spaceEngagedTime + SPACE_TO_SCENE_SWAP_MS) {
        ctx.sceneSetter.setScene(initializeTestScene);
      }
    } else {
      if (ctx.userInput.initiated(Input.Fire)) {
        blinkEngaged = true;
        spaceEngagedTime = ctx.currentMs;
      }
    }
  }
}

const initializeStartScreenScene = (ctx: InitializeCtx): void => {
  const spriteSheetImage = new Image();
  spriteSheetImage.src = spriteSheetSrc;

  ctx.systemRegistry.registerRenderSystem(new RenderSystem(new SpriteTextRenderer(spriteSheetImage), spriteSheetImage));
  ctx.systemRegistry.registerTickSystem(new TickSystem());
};

export default initializeStartScreenScene;
