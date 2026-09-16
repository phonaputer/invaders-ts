import type { TickCtx } from "@src/framework/tick-system";
import type { EntityId } from "bitecs";

type DamageCallbackFunction = (ctx: TickCtx, entity: EntityId) => void;

const DamageCallback = {
  callback: [] as DamageCallbackFunction[],
};

export default DamageCallback;
