import type AssetLoader from "@src/framework/asset-loader";
import type SystemRegistry from "@src/framework/system-registry";
import type { World } from "bitecs";

export interface LoadAssetsCtx {
  assetLoader: AssetLoader;
}

export interface SetSceneCtx {
  currentMs: number;
  systemRegistry: SystemRegistry;
  world: World;
}

export default interface Scene {
  loadAssets: (ctx: LoadAssetsCtx) => void;
  setScene: (ctx: SetSceneCtx) => void;
}
