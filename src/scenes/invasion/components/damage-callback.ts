import type { TickCtx } from "@src/framework/tick-system";
import type { EntityId } from "bitecs";

type DamageCallbackFunction = (ctx: TickCtx, entity: EntityId, amount: number) => void;

const DamageCallback = {
  callback: [] as DamageCallbackFunction[],
};

export default DamageCallback;
