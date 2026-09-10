import { type World } from "bitecs";

export type RenderCtx = {
  rendering: CanvasRenderingContext2D;
  world: World;
};

export interface RenderSystem {
  render: (ctx: RenderCtx) => void;
}
