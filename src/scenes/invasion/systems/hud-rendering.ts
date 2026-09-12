import { GAME_WIDTH } from "@src/framework/constants";
import type { RenderCtx } from "@src/framework/render-system";
import type Renderer from "@src/framework/renderer";
import HUD from "@src/scenes/invasion/components/singleton/hud";
import { GROUND_HEIGHT } from "@src/scenes/invasion/constants";

interface TextRenderer {
  renderText: (renderer: Renderer, x: number, y: number, text: string) => void;
  renderTextCentered: (renderer: Renderer, y: number, text: string) => void;
}

export default class HUDRenderingSystem {
  private readonly textRenderer: TextRenderer;

  constructor(textRenderer: TextRenderer) {
    this.textRenderer = textRenderer;
  }

  render(ctx: RenderCtx): void {
    ctx.renderer.drawLine(0, GROUND_HEIGHT + 0.5, GAME_WIDTH, GROUND_HEIGHT + 0.5, "#00FF00", 2);

    this.textRenderer.renderText(ctx.renderer, 6, 6, `score:${HUD.score}`);
    this.textRenderer.renderText(ctx.renderer, GAME_WIDTH / 2 - 31, 6, `hi-score:${HUD.highScore}`);
    this.textRenderer.renderText(ctx.renderer, GAME_WIDTH - 48, 6, `lives:${HUD.remainingLives}`);
  }
}
