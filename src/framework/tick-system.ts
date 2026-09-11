import { type World } from "bitecs";

export interface TickCtx {
  world: World;
  deltaMs: number;
  currentMs: number;
}

export interface TickSystem {
  tick: (ctx: TickCtx) => void;
}
