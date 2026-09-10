import type { TickSystem } from "@src/framework/tick_system";
import type { RenderSystem } from "@src/framework/render_system";

interface SystemRegistry {
  registerTickSystem: (system: TickSystem) => void;
  registerRenderSystem: (system: RenderSystem) => void;
}

export type InitializeCtx = {
  // TODO asset registry
  systemRegistry: SystemRegistry;
};

export type SceneInitializationCallback = (ctx: InitializeCtx) => void;
