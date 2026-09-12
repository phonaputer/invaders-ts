import type { TickCtx } from "@src/framework/tick-system";
import DeletionCallback from "@src/scenes/invasion/components/deletion-callback";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import TTL from "@src/scenes/invasion/components/ttl";
import { addComponent, query, removeEntity } from "bitecs";

export default class DeletionSystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [TTL])) {
      if (TTL.expirationMs[entity]! <= ctx.currentMs) {
        addComponent(ctx.world, entity, ToBeDeleted);
      }
    }

    for (const entity of query(ctx.world, [ToBeDeleted, DeletionCallback])) {
      DeletionCallback.callback[entity]!(ctx, entity);
    }

    for (const entity of query(ctx.world, [ToBeDeleted])) {
      removeEntity(ctx.world, entity);
    }
  }
}
