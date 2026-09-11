import { CANVAS_HEIGHT, CANVAS_WIDTH, GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import ScalingCanvasRenderer from "@src/framework/scaling-canvas-renderer";
import type { SceneInitializationCallback } from "@src/framework/scene";
import { SceneHarness } from "@src/framework/scene-harness";

export class Game {
  private canvas?: HTMLCanvasElement;
  private renderCtx?: CanvasRenderingContext2D;
  private renderer?: ScalingCanvasRenderer;

  private initializeSceneCallback: SceneInitializationCallback | undefined;
  private curScene?: SceneHarness;

  setScene(initializeScene: SceneInitializationCallback): void {
    this.initializeSceneCallback = initializeScene;
  }

  run(canvasID: string): void {
    this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderCtx = this.canvas.getContext("2d")!;
    this.renderCtx.imageSmoothingEnabled = false;

    this.renderer = new ScalingCanvasRenderer(this.renderCtx, CANVAS_WIDTH / GAME_WIDTH, CANVAS_HEIGHT / GAME_HEIGHT);

    requestAnimationFrame(this.animate);
  }

  private getScene(): SceneHarness {
    if (this.initializeSceneCallback !== undefined) {
      if (this.curScene !== undefined) {
        this.curScene.close();
      }

      this.curScene = new SceneHarness(this.initializeSceneCallback);
      this.initializeSceneCallback = undefined;
    }

    if (this.curScene === undefined) {
      throw new Error("Tried to animate game with no scene.");
    }

    return this.curScene;
  }

  private animate = (currentMs: number): void => {
    this.getScene().frame(this, this.renderer!, currentMs);
    requestAnimationFrame(this.animate);
  };
}
