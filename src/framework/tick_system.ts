import { type World } from "bitecs";

export type TickCtx = {
  world: World;
};

export interface TickSystem {
  tick: (ctx: TickCtx) => void;
}
