import { CANVAS_HEIGHT, CANVAS_WIDTH, GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import ScalingCanvasRenderer from "@src/framework/scaling-canvas-renderer";
import type Scene from "@src/framework/scene";
import { SceneHarness } from "@src/framework/scene-harness";

export class Game {
  private canvas?: HTMLCanvasElement;
  private renderCtx?: CanvasRenderingContext2D;
  private renderer?: ScalingCanvasRenderer;

  private newScene: Scene | undefined;
  private curScene?: SceneHarness;

  run(canvasID: string, scene: Scene): void {
    this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderCtx = this.canvas.getContext("2d")!;
    this.renderCtx.imageSmoothingEnabled = false;

    this.renderer = new ScalingCanvasRenderer(this.renderCtx, CANVAS_WIDTH / GAME_WIDTH, CANVAS_HEIGHT / GAME_HEIGHT);

    this.startNewScene(scene);
  }

  setScene(scene: Scene): void {
    this.newScene = scene;
  }

  private startNewScene(scene: Scene) {
    if (this.curScene !== undefined) {
      this.curScene.close();
    }

    this.curScene = new SceneHarness(scene, this.renderer!, this);

    this.curScene
      .waitUntilSceneIsReady()
      .then(() => {
        requestAnimationFrame(this.animate);
      })
      .catch((error) => {
        console.log("Failed to load new scene:", error);
      });
  }

  private getScene(): SceneHarness | undefined {
    if (this.newScene === undefined && this.curScene !== undefined) {
      return this.curScene;
    }

    if (this.newScene === undefined) {
      throw new Error("Tried to run game with no scene.");
    }

    this.startNewScene(this.newScene);
    this.newScene = undefined;

    return undefined;
  }

  private animate = (currentMs: number): void => {
    const scene = this.getScene();
    if (scene === undefined) {
      return;
    }

    scene.frame(currentMs);

    requestAnimationFrame(this.animate);
  };
}
