import type { InitializeCtx } from "@src/framework/scene";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";
import SpriteRenderingSystem from "@src/scenes/invasion/systems/sprite-rendering";

export const initializeInvasionScene = (ctx: InitializeCtx): void => {
  ctx.systemRegistry.registerTickSystem(new DeletionSystem());

  ctx.systemRegistry.registerRenderSystem(new SpriteRenderingSystem());
};
