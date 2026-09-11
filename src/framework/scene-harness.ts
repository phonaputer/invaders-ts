import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MS_PER_TICK,
} from "@src/framework/constants";
import type { RenderSystem } from "@src/framework/render-system";
import type { SceneInitializationCallback } from "@src/framework/scene";
import type { TickSystem } from "@src/framework/tick-system";
import { type World, createWorld } from "bitecs";

export class SceneHarness {
  private tickSystems: TickSystem[] = [];
  private renderSystems: RenderSystem[] = [];
  private readonly world: World;

  private previousFrameMs = 0;
  private untickedMs = 0;

  constructor(initializeScene: SceneInitializationCallback) {
    this.world = createWorld();

    initializeScene({
      systemRegistry: this,
      world: this.world,
    });
  }

  frame(ctx: CanvasRenderingContext2D, currentMs: number): void {
    const elapsedMs = currentMs - this.previousFrameMs;
    this.previousFrameMs = currentMs;
    this.untickedMs += elapsedMs;

    while (this.untickedMs >= MS_PER_TICK) {
      this.untickedMs -= MS_PER_TICK;
      const thisTickAbsoluteMs = currentMs - this.untickedMs;

      this.tick(MS_PER_TICK, thisTickAbsoluteMs);
    }

    this.render(ctx);
  }

  private tick(deltaMs: number, currentMs: number): void {
    for (let i = 0; i < this.tickSystems.length; i++) {
      this.tickSystems[i]!.tick({
        world: this.world,
        deltaMs,
        currentMs,
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
