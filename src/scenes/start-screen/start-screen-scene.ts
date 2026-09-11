import type { RenderCtx } from "@src/framework/render-system";
import type Renderer from "@src/framework/renderer";
import type { InitializeCtx } from "@src/framework/scene";
import SpriteTextRenderer from "@src/scenes/sprite-text-renderer";

import spaceInvadersSpritesheet from "@src/assets/space_invaders.png";

var spriteSheetImage: HTMLImageElement | undefined = undefined;

interface TextRenderer {
  renderTextCentered: (renderer: Renderer, y: number, text: string) => void;
}

class RenderSystem {
  constructor(
    private readonly textRenderer: TextRenderer,
    private readonly spriteSheetImage: HTMLImageElement,
  ) {}

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

    this.textRenderer.renderTextCentered(ctx.renderer, 220, "press <space> to begin");
  }
}

const initializeStartScreenScene = (ctx: InitializeCtx): void => {
  spriteSheetImage = new Image();
  spriteSheetImage.src = spaceInvadersSpritesheet;

  ctx.systemRegistry.registerRenderSystem(new RenderSystem(new SpriteTextRenderer(spriteSheetImage), spriteSheetImage));
};

export default initializeStartScreenScene;
