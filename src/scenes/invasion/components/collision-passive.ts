import { MAX_ENTITIES } from "@src/framework/constants";

const CollisionPassive = {
  hitboxOffsetX: new Int8Array(MAX_ENTITIES),
  hitboxOffsetY: new Int8Array(MAX_ENTITIES),
  hitboxW: new Int16Array(MAX_ENTITIES),
  hitboxH: new Int16Array(MAX_ENTITIES),
};

export default CollisionPassive;
