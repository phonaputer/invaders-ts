import { MAX_ENTITIES } from "@src/framework/constants";

interface Frame {
  x: number;
  y: number;
}

const Animation = {
  nextFrameMs: [] as number[],
  msPerFrame: new Int16Array(MAX_ENTITIES),
  currentFrame: new Int8Array(MAX_ENTITIES),
  strip: [] as Frame[][],
};

export default Animation;
