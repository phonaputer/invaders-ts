import type { EntityId } from "bitecs";

type DeletionCallbackFunction = (entity: EntityId) => void;

const DeletionCallback = {
  callback: [] as DeletionCallbackFunction[],
};

export default DeletionCallback;
