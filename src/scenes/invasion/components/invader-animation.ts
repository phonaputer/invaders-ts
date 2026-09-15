import { MAX_ENTITIES } from "@src/framework/constants";

interface Frame {
  x: number;
  y: number;
}

const InvaderAnimation = {
  currentFrame: new Int8Array(MAX_ENTITIES),
  strip: [] as Frame[][],
};

export default InvaderAnimation;
