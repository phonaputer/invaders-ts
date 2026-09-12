import type { TickCtx } from "@src/framework/tick-system";
import type { EntityId } from "bitecs";

type DeletionCallbackFunction = (ctx: TickCtx, entity: EntityId) => void;

const DeletionCallback = {
  callback: [] as DeletionCallbackFunction[],
};

export default DeletionCallback;
