import type { RenderSystem } from "@src/framework/render-system";
import type { TickSystem } from "@src/framework/tick-system";
import type { World } from "bitecs";

interface SystemRegistry {
  registerTickSystem: (system: TickSystem) => void;
  registerRenderSystem: (system: RenderSystem) => void;
}

export interface InitializeCtx {
  systemRegistry: SystemRegistry;
  world: World;
}

export type SceneInitializationCallback = (ctx: InitializeCtx) => void;
