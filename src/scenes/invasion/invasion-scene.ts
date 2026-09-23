import type { LoadAssetsCtx, SetSceneCtx } from "@src/framework/scene";
import {
  ALIEN_ATTACK_AUDIO,
  ALIEN_EXPLOSION_AUDIO,
  ARP1_AUDIO,
  ARP2_AUDIO,
  ARP3_AUDIO,
  ARP4_AUDIO,
  PLAYER_ATTACK_AUDIO,
  PLAYER_EXPLOSION_AUDIO,
  SPRITE_SHEET_IMG_ID,
} from "@src/scenes/invasion/constants";
import { setupGame } from "@src/scenes/invasion/entities/game";
import AnimationSystem from "@src/scenes/invasion/systems/animation";
import CallbackOnTimeoutSystem from "@src/scenes/invasion/systems/callback-on-timeout";
import CollisionDetectionSystem from "@src/scenes/invasion/systems/collision-detection";
import DamageSystem from "@src/scenes/invasion/systems/damage";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";
import HUDRenderingSystem from "@src/scenes/invasion/systems/hud-rendering";
import InvaderOrchestrationSystem from "@src/scenes/invasion/systems/invader-orchestration";
import PlayerAttackSystem from "@src/scenes/invasion/systems/player-attack";
import PlayerMovementSystem from "@src/scenes/invasion/systems/player-movement";
import PositionFollowingSystem from "@src/scenes/invasion/systems/position-following";
import SpriteRenderingSystem from "@src/scenes/invasion/systems/sprite-rendering";
import VelocitySystem from "@src/scenes/invasion/systems/velocity";
import SpriteTextRenderer from "@src/scenes/sprite-text-renderer";

import alienExplosionAudio from "@src/scenes/invasion/assets/alien_explosion.wav";
import alienShotAudio from "@src/scenes/invasion/assets/alien_shot.wav";
import arp1Audio from "@src/scenes/invasion/assets/arp1.wav";
import arp2Audio from "@src/scenes/invasion/assets/arp2.wav";
import arp3Audio from "@src/scenes/invasion/assets/arp3.wav";
import arp4Audio from "@src/scenes/invasion/assets/arp4.wav";
import playerExplosionAudio from "@src/scenes/invasion/assets/player_explosion.wav";
import playerShotAudio from "@src/scenes/invasion/assets/player_shot.wav";
import spriteSheetImage from "@src/scenes/invasion/assets/space_invaders.png";

const InvasionScene = {
  loadAssets: (ctx: LoadAssetsCtx): void => {
    ctx.assetLoader.loadImage(SPRITE_SHEET_IMG_ID, spriteSheetImage);

    ctx.assetLoader.loadAudio(ALIEN_EXPLOSION_AUDIO, alienExplosionAudio);
    ctx.assetLoader.loadAudio(ALIEN_ATTACK_AUDIO, alienShotAudio);
    ctx.assetLoader.loadAudio(ARP1_AUDIO, arp1Audio);
    ctx.assetLoader.loadAudio(ARP2_AUDIO, arp2Audio);
    ctx.assetLoader.loadAudio(ARP3_AUDIO, arp3Audio);
    ctx.assetLoader.loadAudio(ARP4_AUDIO, arp4Audio);
    ctx.assetLoader.loadAudio(PLAYER_EXPLOSION_AUDIO, playerExplosionAudio);
    ctx.assetLoader.loadAudio(PLAYER_ATTACK_AUDIO, playerShotAudio);
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
