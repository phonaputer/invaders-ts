import type { InitializeCtx } from "@src/framework/scene";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";

export const initializeInvasionScene = (ctx: InitializeCtx): void => {
  ctx.systemRegistry.registerTickSystem(new DeletionSystem());
};
