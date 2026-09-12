import type { TickCtx } from "@src/framework/tick-system";
import { Input } from "@src/framework/user-input";
import PlayerAttack from "@src/scenes/invasion/components/player-attack";
import Position from "@src/scenes/invasion/components/position";
import { query } from "bitecs";

export default class PlayerAttackSystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [PlayerAttack, Position])) {
      if (PlayerAttack.nextAttackMs[entity]! > ctx.currentMs || !ctx.userInput.held(Input.Fire)) {
        continue;
      }

      PlayerAttack.callback[entity]!({ ctx, entity, x: Position.x[entity]!, y: Position.y[entity]! });
    }
  }
}
