import { CANVAS_HEIGHT, CANVAS_WIDTH, MS_PER_TICK } from "@src/framework/constants";
import type { RenderSystem } from "@src/framework/render-system";
import type Renderer from "@src/framework/renderer";
import type { SceneInitializationCallback } from "@src/framework/scene";
import type SceneSetter from "@src/framework/scene-setter";
import type { TickSystem } from "@src/framework/tick-system";
import { BrowserInputWatcher } from "@src/framework/user-input";
import { type World, createWorld } from "bitecs";

export class SceneHarness {
  private tickSystems: TickSystem[] = [];
  private renderSystems: RenderSystem[] = [];
  private readonly world: World;
  private readonly userInput: BrowserInputWatcher;

  private previousFrameMs = 0;
  private untickedMs = 0;

  constructor(initializeScene: SceneInitializationCallback, currentMs: number) {
    this.world = createWorld();
    this.userInput = new BrowserInputWatcher();

    initializeScene({
      currentMs,
      systemRegistry: this,
      world: this.world,
    });
  }

  frame(sceneSetter: SceneSetter, renderer: Renderer, currentMs: number): void {
    const elapsedMs = currentMs - this.previousFrameMs;
    this.previousFrameMs = currentMs;
    this.untickedMs += elapsedMs;

    this.userInput.recordInput();

    while (this.untickedMs >= MS_PER_TICK) {
      this.untickedMs -= MS_PER_TICK;
      const thisTickAbsoluteMs = currentMs - this.untickedMs;

      this.tick(sceneSetter, MS_PER_TICK, thisTickAbsoluteMs);
    }

    this.render(renderer);
  }

  private tick(sceneSetter: SceneSetter, deltaMs: number, currentMs: number): void {
    for (let i = 0; i < this.tickSystems.length; i++) {
      this.tickSystems[i]!.tick({
        currentMs,
        deltaMs,
        sceneSetter,
        userInput: this.userInput,
        world: this.world,
      });
    }
  }

  private render(renderer: Renderer): void {
    renderer.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < this.renderSystems.length; i++) {
      this.renderSystems[i]!.render({
        renderer,
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

  close(): void {
    this.userInput.close();
  }
}
