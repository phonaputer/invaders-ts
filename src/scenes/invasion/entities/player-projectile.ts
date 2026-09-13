import DeletionCallback from "@src/scenes/invasion/components/deletion-callback";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import Velocity from "@src/scenes/invasion/components/velocity";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import { addComponent, addEntity, type World } from "bitecs";

interface NewProjectileContext {
  world: World;
  currentMs: number;
}

interface Position {
  x: number;
  y: number;
}

let activeProjectiles = 0;

export const activeProjectileCount = (): number => activeProjectiles;

const decrementActiveProjectiles = (): void => {
  activeProjectiles--;
};

const newPlayerProjectile = (ctx: NewProjectileContext, position: Position): void => {
  activeProjectiles++;

  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, DeletionCallback);
  DeletionCallback.callback[entity] = decrementActiveProjectiles;

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = position.x - 2;
  Position.y[entity] = position.y - 2;
  Position.w[entity] = 16;
  Position.h[entity] = 16;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 112;
  Sprite.srcY[entity] = 16;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 16;
  Sprite.dstH[entity] = 16;

  addComponent(ctx.world, entity, Velocity);
  Velocity.x[entity] = 0;
  Velocity.y[entity] = -4;
};

export default newPlayerProjectile;
