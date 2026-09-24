import type AssetGetter from "@src/framework/asset-getter";
import type Renderer from "@src/framework/renderer";
import { type World } from "bitecs";

export interface RenderCtx {
  assetGetter: AssetGetter;
  renderer: Renderer;
  world: World;
}

export interface RenderSystem {
  render: (ctx: RenderCtx) => void;
}
