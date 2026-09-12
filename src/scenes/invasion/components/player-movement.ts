import { MAX_ENTITIES } from "@src/framework/constants";

interface Frame {
  x: number;
  y: number;
}

const PlayerMovement = {
  nextFrameMs: [] as number[],
  msPerFrame: new Int16Array(MAX_ENTITIES),
  currentFrame: new Int8Array(MAX_ENTITIES),
  strip: [] as Frame[][],
  playing: [] as boolean[],
  reversed: [] as boolean[],
  speedX: new Float32Array(MAX_ENTITIES),
};

export default PlayerMovement;
