import type { InitializeCtx } from "@src/framework/scene";
import newPlayer from "@src/scenes/invasion/entities/player";
import AnimationSystem from "@src/scenes/invasion/systems/animation";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";
import PlayerAttackSystem from "@src/scenes/invasion/systems/player-attack";
import PlayerMovementSystem from "@src/scenes/invasion/systems/player-movement";
import PositionFollowingSystem from "@src/scenes/invasion/systems/position-following";
import SpriteRenderingSystem from "@src/scenes/invasion/systems/sprite-rendering";
import VelocitySystem from "@src/scenes/invasion/systems/velocity";

const initializeInvasionScene = (ctx: InitializeCtx): void => {
  ctx.systemRegistry.registerTickSystem(new VelocitySystem());
  ctx.systemRegistry.registerTickSystem(new PlayerMovementSystem());
  ctx.systemRegistry.registerTickSystem(new PlayerAttackSystem());
  ctx.systemRegistry.registerTickSystem(new PositionFollowingSystem());
  ctx.systemRegistry.registerTickSystem(new DeletionSystem());
  ctx.systemRegistry.registerTickSystem(new AnimationSystem());

  ctx.systemRegistry.registerRenderSystem(new SpriteRenderingSystem());

  newPlayer(ctx);
};

export default initializeInvasionScene;
