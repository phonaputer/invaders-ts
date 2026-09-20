import { MAX_ENTITIES } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import type { EntityId } from "bitecs";

type CallbackOnTimeoutFunction = (ctx: TickCtx, entity: EntityId) => void;

const CallbackOnTimeout = {
  callback: [] as CallbackOnTimeoutFunction[],
  callbackMs: new Float64Array(MAX_ENTITIES),
};

export default CallbackOnTimeout;
