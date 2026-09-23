import type { RenderCtx } from "@src/framework/render-system";
import type Renderer from "@src/framework/renderer";
import type { LoadAssetsCtx, SetSceneCtx } from "@src/framework/scene";
import type { TickCtx } from "@src/framework/tick-system";
import { Input } from "@src/framework/user-input";
import InvasionScene from "@src/scenes/invasion/invasion-scene";
import SpriteTextRenderer from "@src/scenes/sprite-text-renderer";

import menuSelectAudio from "@src/scenes/invasion/assets/menu_select.wav";
import spriteSheetSrc from "@src/scenes/invasion/assets/space_invaders.png";

const SPRITE_SHEET_IMG_ID = "spritesheet";
const MENU_SELECT_AUDIO_ID = "menu-select";

const SPACE_ENGAGED_EVENT = "space-engaged";

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
  private readonly spriteSheetImageID: string;

  constructor(textRenderer: TextRenderer, spriteSheetImageID: string) {
    this.textRenderer = textRenderer;
    this.spriteSheetImageID = spriteSheetImageID;
  }

  render(ctx: RenderCtx): void {
    this.textRenderer.renderTextCentered(ctx.renderer, 60, "personal space invaders");

    ctx.renderer.drawImage(this.spriteSheetImageID, 64, 0, 16, 16, 60, 85, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 90, " - 10 points");

    ctx.renderer.drawImage(this.spriteSheetImageID, 16, 16, 16, 16, 60, 100, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 105, " - 20 points");

    ctx.renderer.drawImage(this.spriteSheetImageID, 16, 0, 16, 16, 60, 115, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 120, " - 30 points");

    ctx.renderer.drawImage(this.spriteSheetImageID, 96, 0, 16, 16, 60, 130, 16, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 135, " - 40 points");

    ctx.renderer.drawImage(this.spriteSheetImageID, 96, 64, 24, 16, 52, 145, 24, 16);
    this.textRenderer.renderTextCentered(ctx.renderer, 150, " -  ? points");

    this.textRenderer.renderTextCentered(ctx.renderer, 180, "<a> and <d> to move");
    this.textRenderer.renderTextCentered(ctx.renderer, 190, "<space> to shoot");

    if (isBlinkingTextVisible) {
      this.textRenderer.renderTextCentered(ctx.renderer, 220, "press <space> to begin");
    }

    if (ctx.eventLog.getRender(SPACE_ENGAGED_EVENT).length > 0) {
      ctx.assetGetter.getAudio(MENU_SELECT_AUDIO_ID)?.play();
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
        ctx.sceneSetter.setScene(InvasionScene);
      }
    } else {
      if (ctx.userInput.initiated(Input.Fire)) {
        blinkEngaged = true;
        spaceEngagedTime = ctx.currentMs;
        ctx.eventLog.pushRender(SPACE_ENGAGED_EVENT, true);
      }
    }
  }
}

const StartScreenScene = {
  loadAssets: (ctx: LoadAssetsCtx): void => {
    ctx.assetLoader.loadImage(SPRITE_SHEET_IMG_ID, spriteSheetSrc);
    ctx.assetLoader.loadAudio(MENU_SELECT_AUDIO_ID, menuSelectAudio);
  },
  setScene: (ctx: SetSceneCtx): void => {
    ctx.systemRegistry.registerRenderSystem(
      new RenderSystem(new SpriteTextRenderer(SPRITE_SHEET_IMG_ID), SPRITE_SHEET_IMG_ID),
    );
    ctx.systemRegistry.registerTickSystem(new TickSystem());
  },
};

export default StartScreenScene;
