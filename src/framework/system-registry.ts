import type { RenderSystem } from "@src/framework/render-system";
import type { TickSystem } from "@src/framework/tick-system";

export default interface SystemRegistry {
  /**
   * Systems are executed each tick in the order they are registered.
   */
  registerTickSystem: (system: TickSystem) => void;

  /**
   * Systems are executed each frame in the order they are registered.
   */
  registerRenderSystem: (system: RenderSystem) => void;
}
