import type { RenderSystem } from "@src/framework/render-system";
import type { TickSystem } from "@src/framework/tick-system";

interface SystemRegistry {
  registerTickSystem: (system: TickSystem) => void;
  registerRenderSystem: (system: RenderSystem) => void;
}

export interface InitializeCtx {
  // TODO asset registry
  systemRegistry: SystemRegistry;
}

export type SceneInitializationCallback = (ctx: InitializeCtx) => void;
