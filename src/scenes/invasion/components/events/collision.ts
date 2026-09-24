import { MAX_ENTITIES } from "@src/framework/constants";

const Collision = {
  entity: new Float64Array(MAX_ENTITIES),
  other: new Float64Array(MAX_ENTITIES),
};

export default Collision;
