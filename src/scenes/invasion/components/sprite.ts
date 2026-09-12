import { MAX_ENTITIES } from "@src/framework/constants";

const Sprite = {
  image: [] as HTMLImageElement[],
  srcX: new Int8Array(MAX_ENTITIES),
  srcY: new Int8Array(MAX_ENTITIES),
  srcW: new Int8Array(MAX_ENTITIES),
  srcH: new Int8Array(MAX_ENTITIES),
  dstW: new Int16Array(MAX_ENTITIES),
  dstH: new Int16Array(MAX_ENTITIES),
};

export default Sprite;
