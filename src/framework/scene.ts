import type { RenderSystem } from "@src/framework/render-system";
import type { TickSystem } from "@src/framework/tick-system";
import type { World } from "bitecs";

interface SystemRegistry {
  /**
   * Systems are executed each tick in the order they are registered.
   */
  registerTickSystem: (system: TickSystem) => void;

  /**
   * Systems are executed each frame in the order they are registered.
   */
  registerRenderSystem: (system: RenderSystem) => void;
}

export interface InitializeCtx {
  systemRegistry: SystemRegistry;
  world: World;
}

export type SceneInitializationCallback = (ctx: InitializeCtx) => void;
