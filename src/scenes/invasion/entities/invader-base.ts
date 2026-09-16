import Damage from "@src/scenes/invasion/components/damage";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import InvaderAnimation from "@src/scenes/invasion/components/invader-animation";
import InvaderOrchestration from "@src/scenes/invasion/components/invader-orchestration";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import DamageType from "@src/scenes/invasion/damage-type";
import { addComponent, addEntity, type EntityId, type World } from "bitecs";

interface NewInvaderContext {
  world: World;
  currentMs: number;
}

interface Frame {
  x: number;
  y: number;
}

export interface NewInvaderArgs {
  ctx: NewInvaderContext;
  x: number;
  y: number;
}

interface NewBaseInvaderArgs {
  ctx: NewInvaderContext;
  x: number;
  y: number;
  strip: Frame[];
}

const newBaseInvader = (args: NewBaseInvaderArgs): EntityId => {
  const entity = addEntity(args.ctx.world);

  addComponent(args.ctx.world, entity, Damage);
  Damage.type[entity] = DamageType.Alien;
  Damage.amount[entity] = 1;

  addComponent(args.ctx.world, entity, Hitpoints);
  Hitpoints.susceptibleToDamageType[entity] = DamageType.PlayerProjectile;
  Hitpoints.current[entity] = 1;

  addComponent(args.ctx.world, entity, InvaderAnimation);
  InvaderAnimation.currentFrame[entity] = 0;
  InvaderAnimation.strip[entity] = args.strip;

  addComponent(args.ctx.world, entity, InvaderOrchestration);

  addComponent(args.ctx.world, entity, Position);
  Position.x[entity] = args.x;
  Position.y[entity] = args.y;
  Position.w[entity] = 14;
  Position.h[entity] = 14;

  addComponent(args.ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 16 * args.strip[0]!.x;
  Sprite.srcY[entity] = 16 * args.strip[0]!.y;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 14;
  Sprite.dstH[entity] = 14;

  return entity;
};

export default newBaseInvader;
