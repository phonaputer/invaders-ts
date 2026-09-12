import { MAX_ENTITIES } from "@src/framework/constants";

const Position = {
  x: new Int16Array(MAX_ENTITIES),
  y: new Int16Array(MAX_ENTITIES),
  w: new Int16Array(MAX_ENTITIES),
  h: new Int16Array(MAX_ENTITIES),
};

export default Position;
