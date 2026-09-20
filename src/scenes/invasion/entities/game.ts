import type { TickCtx } from "@src/framework/tick-system";
import CallbackOnTimeout from "@src/scenes/invasion/components/callback-on-timeout";
import Position from "@src/scenes/invasion/components/position";
import HUD from "@src/scenes/invasion/components/singleton/hud";
import Pause from "@src/scenes/invasion/components/singleton/pause";
import newPlayer from "@src/scenes/invasion/entities/player";
import newPlayerExplosion from "@src/scenes/invasion/entities/player-explosion";
import { addComponent, addEntity, type EntityId } from "bitecs";

const DEFEAT_PAUSE_MS = 2400;

export const onPlayerDefeat = (ctx: TickCtx, entity: EntityId): void => {
  HUD.remainingLives--;
  Pause.paused = true;

  newPlayerExplosion(ctx, { x: Position.x[entity]!, y: Position.y[entity]!, expirationMs: DEFEAT_PAUSE_MS });

  const respawnEntity = addEntity(ctx.world);
  addComponent(ctx.world, respawnEntity, CallbackOnTimeout);
  CallbackOnTimeout.callback[respawnEntity] = respawn;
  CallbackOnTimeout.callbackMs[respawnEntity] = ctx.currentMs + DEFEAT_PAUSE_MS;
};

const respawn = (ctx: TickCtx): void => {
  Pause.paused = false;
  newPlayer(ctx);
};
