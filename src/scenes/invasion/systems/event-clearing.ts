import type { RenderCtx } from "@src/framework/render-system";
import type { TickCtx } from "@src/framework/tick-system";
import { query, removeEntity, type ComponentRef } from "bitecs";

interface EventClearingSystemArgs {
  tickEvents: Array<ComponentRef>;
  renderEvents: Array<ComponentRef>;
}

export default class EventClearingSystem {
  private readonly tickEvents: ComponentRef[];
  private readonly renderEvents: ComponentRef[];

  constructor({ tickEvents, renderEvents }: EventClearingSystemArgs) {
    this.tickEvents = tickEvents;
    this.renderEvents = renderEvents;
  }

  tick(ctx: TickCtx): void {
    for (const eventComponent of this.tickEvents) {
      for (const entity of query(ctx.world, [eventComponent])) {
        removeEntity(ctx.world, entity);
      }
    }
  }

  render(ctx: RenderCtx): void {
    for (const eventComponent of this.renderEvents) {
      for (const entity of query(ctx.world, [eventComponent])) {
        removeEntity(ctx.world, entity);
      }
    }
  }
}
