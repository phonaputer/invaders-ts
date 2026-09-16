import { MAX_ENTITIES } from "@src/framework/constants";

const Damage = {
  type: new Int8Array(MAX_ENTITIES),
  amount: new Int8Array(MAX_ENTITIES),
};

export default Damage;
