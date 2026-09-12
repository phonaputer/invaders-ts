import type { InitializeCtx } from "@src/framework/scene";
import newPlayer from "@src/scenes/invasion/entities/player";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";
import PlayerMovementSystem from "@src/scenes/invasion/systems/player-movement";
import SpriteRenderingSystem from "@src/scenes/invasion/systems/sprite-rendering";
import VelocitySystem from "@src/scenes/invasion/systems/velocity";

const initializeInvasionScene = (ctx: InitializeCtx): void => {
  ctx.systemRegistry.registerTickSystem(new VelocitySystem());
  ctx.systemRegistry.registerTickSystem(new PlayerMovementSystem());
  ctx.systemRegistry.registerTickSystem(new DeletionSystem());

  ctx.systemRegistry.registerRenderSystem(new SpriteRenderingSystem());

  newPlayer(ctx);
};

export default initializeInvasionScene;
