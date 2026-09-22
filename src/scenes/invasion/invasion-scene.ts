import type { LoadAssetsCtx, SetSceneCtx } from "@src/framework/scene";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import AnimationSystem from "@src/scenes/invasion/systems/animation";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";
import HUDRenderingSystem from "@src/scenes/invasion/systems/hud-rendering";
import PlayerAttackSystem from "@src/scenes/invasion/systems/player-attack";
import PlayerMovementSystem from "@src/scenes/invasion/systems/player-movement";
import PositionFollowingSystem from "@src/scenes/invasion/systems/position-following";
import SpriteRenderingSystem from "@src/scenes/invasion/systems/sprite-rendering";
import VelocitySystem from "@src/scenes/invasion/systems/velocity";
import SpriteTextRenderer from "@src/scenes/sprite-text-renderer";

import spriteSheetSrc from "@src/assets/space_invaders.png";
import { setupGame } from "@src/scenes/invasion/entities/game";
import CallbackOnTimeoutSystem from "@src/scenes/invasion/systems/callback-on-timeout";
import CollisionDetectionSystem from "@src/scenes/invasion/systems/collision-detection";
import DamageSystem from "@src/scenes/invasion/systems/damage";
import InvaderOrchestrationSystem from "@src/scenes/invasion/systems/invader-orchestration";

const InvasionScene = {
  loadAssets: (ctx: LoadAssetsCtx): void => {
    ctx.assetLoader.loadImage(SPRITE_SHEET_IMG_ID, spriteSheetSrc);
  },
  setScene: (ctx: SetSceneCtx): void => {
    ctx.systemRegistry.registerTickSystem(new CollisionDetectionSystem());
    ctx.systemRegistry.registerTickSystem(new DamageSystem());
    ctx.systemRegistry.registerTickSystem(new VelocitySystem());
    ctx.systemRegistry.registerTickSystem(new DeletionSystem());
    ctx.systemRegistry.registerTickSystem(new PlayerMovementSystem());
    ctx.systemRegistry.registerTickSystem(new PlayerAttackSystem());
    ctx.systemRegistry.registerTickSystem(new PositionFollowingSystem());
    ctx.systemRegistry.registerTickSystem(new AnimationSystem());
    ctx.systemRegistry.registerTickSystem(new InvaderOrchestrationSystem());
    ctx.systemRegistry.registerTickSystem(new CallbackOnTimeoutSystem());

    ctx.systemRegistry.registerRenderSystem(new SpriteRenderingSystem());
    ctx.systemRegistry.registerRenderSystem(new HUDRenderingSystem(new SpriteTextRenderer(SPRITE_SHEET_IMG_ID)));

    setupGame(ctx);
  },
};

export default InvasionScene;
