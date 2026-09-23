import type { TickCtx } from "@src/framework/tick-system";
import CallbackOnTimeout from "@src/scenes/invasion/components/callback-on-timeout";
import Position from "@src/scenes/invasion/components/position";
import HUD from "@src/scenes/invasion/components/singleton/hud";
import Pause from "@src/scenes/invasion/components/singleton/pause";
import setupFortreses from "@src/scenes/invasion/entities/fortress";
import setupInvaders from "@src/scenes/invasion/entities/invaders";
import newPlayer from "@src/scenes/invasion/entities/player";
import newPlayerExplosion from "@src/scenes/invasion/entities/player-explosion";
import { resetActiveProjectileCount } from "@src/scenes/invasion/entities/player-projectile";
import { addComponent, addEntity, resetWorld, type EntityId, type World } from "bitecs";

const DEFEAT_PAUSE_MS = 2400;

export const incrementScore = (score: number): void => {
  HUD.score += score;
  if (HUD.highScore < HUD.score) {
    HUD.highScore = HUD.score;
  }
};

export const onPlayerDefeat = (ctx: TickCtx, entity: EntityId): void => {
  Pause.paused = true;

  if (HUD.remainingLives < 1) {
    HUD.gameOver = true;
  } else {
    HUD.remainingLives--;
  }

  newPlayerExplosion(ctx, { x: Position.x[entity]!, y: Position.y[entity]!, expirationMs: DEFEAT_PAUSE_MS });

  const respawnEntity = addEntity(ctx.world);
  addComponent(ctx.world, respawnEntity, CallbackOnTimeout);
  CallbackOnTimeout.callbackMs[respawnEntity] = ctx.currentMs + DEFEAT_PAUSE_MS;

  if (HUD.gameOver) {
    CallbackOnTimeout.callback[respawnEntity] = reSetupGame;
  } else {
    CallbackOnTimeout.callback[respawnEntity] = respawn;
  }
};

const respawn = (ctx: TickCtx): void => {
  HUD.gameOver = false;
  Pause.paused = false;
  newPlayer(ctx);
};

interface SetupContext {
  world: World;
  currentMs: number;
}

export const setupGame = (ctx: SetupContext): void => {
  newPlayer(ctx);
  setupInvaders(ctx);
  setupFortreses(ctx);

  HUD.remainingLives = 2;
  HUD.score = 0;
  HUD.highScore = 0;
  HUD.gameOver = false;

  Pause.paused = false;
};

const reSetupGame = (ctx: SetupContext): void => {
  const highScore = HUD.highScore;

  resetWorld(ctx.world);
  resetActiveProjectileCount();

  setupGame(ctx);

  HUD.highScore = highScore;
};
