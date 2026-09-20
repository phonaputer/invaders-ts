import type { TickCtx } from "@src/framework/tick-system";
import CallbackOnTimeout from "@src/scenes/invasion/components/callback-on-timeout";

import { query, removeComponent } from "bitecs";

export default class CallbackOnTimeoutSystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [CallbackOnTimeout])) {
      if (CallbackOnTimeout.callbackMs[entity]! > ctx.currentMs) {
        continue;
      }

      CallbackOnTimeout.callback[entity]!(ctx, entity);
      removeComponent(ctx.world, entity, CallbackOnTimeout);
    }
  }
}
