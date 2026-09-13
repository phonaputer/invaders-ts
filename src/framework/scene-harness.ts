import AssetAwareRenderer, { type AssetUnawareRenderer } from "@src/framework/asset-aware-renderer";
import AssetRegistry from "@src/framework/asset-registry";
import { MS_PER_TICK } from "@src/framework/constants";
import DefaultEventLog from "@src/framework/default-event-log";
import type { RenderSystem } from "@src/framework/render-system";
import type Scene from "@src/framework/scene";
import type SceneSetter from "@src/framework/scene-setter";
import type { TickSystem } from "@src/framework/tick-system";
import { BrowserInputWatcher } from "@src/framework/user-input";
import { type World, createWorld } from "bitecs";

export class SceneHarness {
  private readonly assetRegistry: AssetRegistry;
  private readonly eventLog: DefaultEventLog;
  private readonly renderer: AssetAwareRenderer;
  private readonly scene: Scene;
  private readonly sceneSetter: SceneSetter;
  private readonly userInput: BrowserInputWatcher;
  private readonly world: World;

  private tickSystems: TickSystem[] = [];
  private renderSystems: RenderSystem[] = [];

  private setScene = false;
  private previousFrameMs = 0;
  private untickedMs = 0;

  constructor(scene: Scene, renderer: AssetUnawareRenderer, sceneSetter: SceneSetter) {
    this.assetRegistry = new AssetRegistry();
    this.eventLog = new DefaultEventLog();
    this.renderer = new AssetAwareRenderer(renderer, this.assetRegistry);
    this.scene = scene;
    this.sceneSetter = sceneSetter;
    this.userInput = new BrowserInputWatcher();
    this.world = createWorld();
  }

  frame(currentMs: number): void {
    if (!this.setScene) {
      this.scene.setScene({
        currentMs,
        systemRegistry: this,
        world: this.world,
      });
      this.setScene = true;
    }

    const elapsedMs = currentMs - this.previousFrameMs;
    this.previousFrameMs = currentMs;
    this.untickedMs += elapsedMs;

    this.userInput.recordInput();
    this.eventLog.clearRender();

    while (this.untickedMs >= MS_PER_TICK) {
      this.eventLog.clearTick();

      this.untickedMs -= MS_PER_TICK;
      const thisTickAbsoluteMs = currentMs - this.untickedMs;

      this.tick(MS_PER_TICK, thisTickAbsoluteMs);
    }

    this.render();
  }

  private tick(deltaMs: number, currentMs: number): void {
    for (let i = 0; i < this.tickSystems.length; i++) {
      this.tickSystems[i]!.tick({
        currentMs,
        deltaMs,
        eventLog: this.eventLog,
        sceneSetter: this.sceneSetter,
        userInput: this.userInput,
        world: this.world,
      });
    }
  }

  private render(): void {
    this.renderer.clearAll();

    for (let i = 0; i < this.renderSystems.length; i++) {
      this.renderSystems[i]!.render({
        assetGetter: this.assetRegistry,
        eventLog: this.eventLog,
        renderer: this.renderer,
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

  async waitUntilSceneIsReady(): Promise<void> {
    this.scene.loadAssets({ assetLoader: this.assetRegistry });

    await this.assetRegistry.waitUntilAllAssetsAreLoaded();
  }

  close(): void {
    this.userInput.close();
  }
}
