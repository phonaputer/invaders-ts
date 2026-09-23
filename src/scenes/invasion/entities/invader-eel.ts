import { GAME_WIDTH } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import Animation from "@src/scenes/invasion/components/animation";
import CallbackOnTimeout from "@src/scenes/invasion/components/callback-on-timeout";
import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import Damage from "@src/scenes/invasion/components/damage";
import DamageCallback from "@src/scenes/invasion/components/damage-callback";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import Velocity from "@src/scenes/invasion/components/velocity";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import DamageType from "@src/scenes/invasion/damage-type";
import newExplosion from "@src/scenes/invasion/entities/explosion";
import { incrementScore } from "@src/scenes/invasion/entities/game";
import { addComponent, addEntity, hasComponent, type EntityId, type World } from "bitecs";

const LEFT_STRIP = [
  { x: 0, y: 4 },
  { x: 1, y: 4 },
  { x: 0, y: 4 },
  { x: 2, y: 4 },
];

const RIGHT_STRIP = [
  { x: 4, y: 5 },
  { x: 4, y: 4 },
  { x: 4, y: 5 },
  { x: 3, y: 4 },
];

interface NewEelContext {
  world: World;
  currentMs: number;
}

const spawnEel = (ctx: NewEelContext): void => {
  newEel(ctx);
  scheduleEelSpawn(ctx);
};

export const scheduleEelSpawn = (ctx: NewEelContext): void => {
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, CallbackOnTimeout);
  CallbackOnTimeout.callbackMs[entity] = ctx.currentMs + Math.floor(Math.random() * 10_000) + 15_000;
  CallbackOnTimeout.callback[entity] = spawnEel;
};

const onDamage = (ctx: TickCtx, entity: EntityId): void => {
  incrementScore(Math.floor(Math.random() * 201) + 100);

  if (!hasComponent(ctx.world, entity, Position)) {
    return;
  }

  newExplosion(ctx, { x: Position.x[entity]!, y: Position.y[entity]! });
};

const newEel = (ctx: NewEelContext): EntityId => {
  let xVelocity = 0.5;
  let startX = -24;
  let strip = RIGHT_STRIP;

  const goingLeft = Math.random() < 0.5;
  if (goingLeft) {
    xVelocity = -xVelocity;
    startX = GAME_WIDTH;
    strip = LEFT_STRIP;
  }

  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, Animation);
  Animation.msPerFrame[entity] = 400;
  Animation.nextFrameMs[entity] = ctx.currentMs + 400;
  Animation.currentFrame[entity] = 0;
  Animation.strip[entity] = strip;

  addComponent(ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 0;
  CollisionPassive.hitboxOffsetY[entity] = 7;
  CollisionPassive.hitboxW[entity] = 24;
  CollisionPassive.hitboxH[entity] = 2;

  addComponent(ctx.world, entity, Damage);
  Damage.type[entity] = DamageType.Alien;
  Damage.amount[entity] = 1;

  addComponent(ctx.world, entity, DamageCallback);
  DamageCallback.callback[entity] = onDamage;

  addComponent(ctx.world, entity, Hitpoints);
  Hitpoints.susceptibleToDamageType[entity] = DamageType.PlayerProjectile;
  Hitpoints.current[entity] = 1;

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = startX;
  Position.y[entity] = 16;
  Position.w[entity] = 24;
  Position.h[entity] = 16;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 16 * strip[0]!.x;
  Sprite.srcY[entity] = 16 * strip[0]!.y;
  Sprite.srcW[entity] = 24;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 24;
  Sprite.dstH[entity] = 16;

  addComponent(ctx.world, entity, Velocity);
  Velocity.x[entity] = xVelocity;
  Velocity.y[entity] = 0;

  return entity;
};

export default newEel;
