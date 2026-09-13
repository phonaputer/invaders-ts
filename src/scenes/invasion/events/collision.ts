import type { EntityId } from "bitecs";

export const COLLISION_EVENT_TYPE = "collision";

export default interface Collision {
  entity: EntityId;
  other: EntityId;
}
