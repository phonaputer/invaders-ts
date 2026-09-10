import {
  MS_PER_TICK,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "@src/framework/constants";
import type { TickSystem } from "@src/framework/tick_system";
import type { RenderSystem } from "@src/framework/render_system";
import type { SceneInitializationCallback } from "@src/framework/scene";
import { createWorld, type World } from "bitecs";

export class SceneHarness {
  private tickSystems: TickSystem[] = [];
  private renderSystems: RenderSystem[] = [];
  private readonly world: World;

  private previousFrameMs: number = 0;
  private untickedMs: number = 0;

  constructor(initializeScene: SceneInitializationCallback) {
    this.world = createWorld();

    initializeScene({
      systemRegistry: this,
    });
  }

  frame(ctx: CanvasRenderingContext2D, thisFrameMs: number): void {
    const elapsedMs = thisFrameMs - this.previousFrameMs;
    this.previousFrameMs = thisFrameMs;
    this.untickedMs += elapsedMs;

    while (this.untickedMs >= MS_PER_TICK) {
      this.untickedMs -= MS_PER_TICK;
      this.tick();
    }

    this.render(ctx);
  }

  private tick(): void {
    for (let i = 0; i < this.tickSystems.length; i++) {
      this.tickSystems[i]!.tick({
        world: this.world,
      });
    }
  }

  private render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < this.renderSystems.length; i++) {
      this.renderSystems[i]!.render({
        rendering: ctx,
        world: this.world,
      });
    }
  }

  registerTickSystem(system: TickSystem): void {
    this.tickSystems.push(system);
  }

  registerRenderSystem(system: RenderSystem): void {
    this.renderSystems.push(system);
  }
}
