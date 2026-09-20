import AnimationUnpausable from "@src/scenes/invasion/components/animation-unpausable";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import TTL from "@src/scenes/invasion/components/ttl";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import { addComponent, addEntity, type World } from "bitecs";

interface NewExplosionContext {
  world: World;
  currentMs: number;
}

interface Positon {
  x: number;
  y: number;
}

const newExplosion = (ctx: NewExplosionContext, { x, y }: Positon): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, AnimationUnpausable);
  AnimationUnpausable.msPerFrame[entity] = 80;
  AnimationUnpausable.nextFrameMs[entity] = ctx.currentMs + 80;
  AnimationUnpausable.currentFrame[entity] = 0;
  AnimationUnpausable.strip[entity] = [
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
  ];

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = x;
  Position.y[entity] = y;
  Position.w[entity] = 16;
  Position.h[entity] = 16;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 48;
  Sprite.srcY[entity] = 16;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 16;
  Sprite.dstH[entity] = 16;

  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = ctx.currentMs + 320;
};

export default newExplosion;
