import type { TickCtx } from "@src/framework/tick-system";
import Damage from "@src/scenes/invasion/components/damage";
import DamageCallback from "@src/scenes/invasion/components/damage-callback";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import { type default as Collision, COLLISION_EVENT_TYPE } from "@src/scenes/invasion/events/collision";
import { addComponent, hasComponent } from "bitecs";

// This must be executed before the deletion system in a tick since it assumes entity existence.
export default class DamageSystem {
  tick(ctx: TickCtx): void {
    for (const event of ctx.eventLog.getTick(COLLISION_EVENT_TYPE)) {
      const collision = event as Collision;

      if (!hasComponent(ctx.world, collision.entity, Damage) || !hasComponent(ctx.world, collision.other, Hitpoints)) {
        continue;
      }

      if ((Damage.type[collision.entity]! & Hitpoints.susceptibleToDamageType[collision.other]!) < 1) {
        continue;
      }

      if (hasComponent(ctx.world, collision.other, DamageCallback)) {
        DamageCallback.callback[collision.other]!(ctx, collision.other);
      }

      Hitpoints.current[collision.other]! -= Damage.amount[collision.entity]!;

      if (Hitpoints.current[collision.other]! < 1) {
        addComponent(ctx.world, collision.other, ToBeDeleted);
      }
    }
  }
}
