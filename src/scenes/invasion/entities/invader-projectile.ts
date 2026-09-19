import type { TickCtx } from "@src/framework/tick-system";
import Animation from "@src/scenes/invasion/components/animation";
import CollisionActive from "@src/scenes/invasion/components/collision-active";
import Damage from "@src/scenes/invasion/components/damage";
import DamageCallback from "@src/scenes/invasion/components/damage-callback";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import Velocity from "@src/scenes/invasion/components/velocity";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import DamageType from "@src/scenes/invasion/damage-type";
import newExplosion from "@src/scenes/invasion/entities/explosion";
import { addComponent, addEntity, hasComponent, type EntityId, type World } from "bitecs";

const onDamage = (ctx: TickCtx, entity: EntityId): void => {
  if (!hasComponent(ctx.world, entity, Position)) {
    return;
  }

  newExplosion(ctx, { x: Position.x[entity]!, y: Position.y[entity]! });
};

interface NewProjectileContext {
  world: World;
  currentMs: number;
}

interface Position {
  x: number;
  y: number;
}

const newInvaderProjectile = (ctx: NewProjectileContext, position: Position): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, Animation);
  Animation.msPerFrame[entity] = 640;
  Animation.nextFrameMs[entity] = ctx.currentMs + 640;
  Animation.currentFrame[entity] = 0;
  Animation.strip[entity] = [
    { x: 5, y: 2 },
    { x: 6, y: 2 },
  ];

  addComponent(ctx.world, entity, CollisionActive);
  CollisionActive.hitboxOffsetX[entity] = 7;
  CollisionActive.hitboxOffsetY[entity] = 6;
  CollisionActive.hitboxW[entity] = 1;
  CollisionActive.hitboxH[entity] = 4;

  addComponent(ctx.world, entity, Damage);
  Damage.type[entity] = DamageType.AlienProjectile;
  Damage.amount[entity] = 1;

  addComponent(ctx.world, entity, DamageCallback);
  DamageCallback.callback[entity] = onDamage;

  addComponent(ctx.world, entity, Hitpoints);
  Hitpoints.susceptibleToDamageType[entity] = DamageType.Player | DamageType.PlayerProjectile | DamageType.Fortress;
  Hitpoints.current[entity] = 1;

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = position.x - 2;
  Position.y[entity] = position.y - 2;
  Position.w[entity] = 16;
  Position.h[entity] = 16;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 80;
  Sprite.srcY[entity] = 32;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 16;
  Sprite.dstH[entity] = 16;

  addComponent(ctx.world, entity, Velocity);
  Velocity.x[entity] = 0;
  Velocity.y[entity] = 1;
};

export default newInvaderProjectile;
