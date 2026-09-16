import { MAX_ENTITIES } from "@src/framework/constants";

const Hitpoints = {
  susceptibleToDamageType: new Int8Array(MAX_ENTITIES),
  current: new Int8Array(MAX_ENTITIES),
};

export default Hitpoints;
