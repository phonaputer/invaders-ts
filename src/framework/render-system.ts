import type Renderer from "@src/framework/renderer";
import { type World } from "bitecs";

export interface RenderCtx {
  renderer: Renderer;
  world: World;
}

export interface RenderSystem {
  render: (ctx: RenderCtx) => void;
}
