import type { TickCtx } from "@src/framework/tick-system";
import Damage from "@src/scenes/invasion/components/damage";
import DamageCallback from "@src/scenes/invasion/components/damage-callback";
import CollisionOccurred from "@src/scenes/invasion/components/events/collision-occurred";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import { addComponent, hasComponent, query } from "bitecs";

// This must be executed before the deletion system in a tick since it assumes entity existence.
export default class DamageSystem {
  tick(ctx: TickCtx): void {
    for (const collision of query(ctx.world, [CollisionOccurred])) {
      const entity = CollisionOccurred.entity[collision]!;
      const other = CollisionOccurred.other[collision]!;

      if (!hasComponent(ctx.world, entity, Damage) || !hasComponent(ctx.world, other, Hitpoints)) {
        continue;
      }

      if ((Damage.type[entity]! & Hitpoints.susceptibleToDamageType[other]!) < 1) {
        continue;
      }

      if (hasComponent(ctx.world, other, DamageCallback)) {
        DamageCallback.callback[other]!(ctx, other, Damage.amount[entity]!);
      }

      Hitpoints.current[other]! -= Damage.amount[entity]!;

      if (Hitpoints.current[other]! < 1) {
        addComponent(ctx.world, other, ToBeDeleted);
      }
    }
  }
}
