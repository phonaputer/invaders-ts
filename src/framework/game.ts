import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@src/framework/constants";
import type { SceneInitializationCallback } from "@src/framework/scene";
import { SceneHarness } from "@src/framework/scene_harness";

export class Game {
  private canvas?: HTMLCanvasElement;
  private renderCtx?: CanvasRenderingContext2D;

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

    requestAnimationFrame(this.animate);
  }

  private getScene(): SceneHarness {
    if (this.initializeSceneCallback !== undefined) {
      this.curScene = new SceneHarness(this.initializeSceneCallback);
      this.initializeSceneCallback = undefined;
    }

    if (this.curScene === undefined) {
      throw new Error("Tried to animate game with no scene.");
    }

    return this.curScene;
  }

  private animate = (thisFrameMs: number): void => {
    this.getScene().frame(this.renderCtx!, thisFrameMs);
    requestAnimationFrame(this.animate);
  };
}
