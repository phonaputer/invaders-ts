import { MAX_ENTITIES } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import type { EntityId } from "bitecs";

export interface PlayerAttackCallbackArgs {
  ctx: TickCtx;
  entity: EntityId;
  x: number;
  y: number;
}

export type PlayerAttackCallback = (args: PlayerAttackCallbackArgs) => void;

const PlayerAttack = {
  nextAttackMs: new Float64Array(MAX_ENTITIES),
  msPerAttack: new Int16Array(MAX_ENTITIES),
  callback: [] as PlayerAttackCallback[],
};

export default PlayerAttack;
