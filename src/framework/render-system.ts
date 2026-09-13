import type AssetGetter from "@src/framework/asset-getter";
import type EventLog from "@src/framework/event-log";
import type Renderer from "@src/framework/renderer";
import { type World } from "bitecs";

export interface RenderCtx {
  assetGetter: AssetGetter;
  eventLog: EventLog;
  renderer: Renderer;
  world: World;
}

export interface RenderSystem {
  render: (ctx: RenderCtx) => void;
}
