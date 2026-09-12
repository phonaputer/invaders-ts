import { MAX_ENTITIES } from "@src/framework/constants";
import type { EntityId } from "bitecs";

const PositionFollowing = {
  leader: [] as EntityId[],
  xOffset: new Float32Array(MAX_ENTITIES),
  yOffset: new Float32Array(MAX_ENTITIES),
};

export default PositionFollowing;
