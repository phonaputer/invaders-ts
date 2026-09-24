import { MAX_ENTITIES } from "@src/framework/constants";

const CollisionOccurred = {
  entity: new Float64Array(MAX_ENTITIES),
  other: new Float64Array(MAX_ENTITIES),
};

export default CollisionOccurred;
