import { type World } from "bitecs";

export interface RenderCtx {
  rendering: CanvasRenderingContext2D;
  world: World;
}

export interface RenderSystem {
  render: (ctx: RenderCtx) => void;
}
