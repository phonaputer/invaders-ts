import { type World } from "bitecs";

export interface TickCtx {
  world: World;
}

export interface TickSystem {
  tick: (ctx: TickCtx) => void;
}
