import Animation from "@src/scenes/invasion/components/animation";
import Position from "@src/scenes/invasion/components/position";
import PositionFollowing from "@src/scenes/invasion/components/position-following";
import Sprite from "@src/scenes/invasion/components/sprite";
import TTL from "@src/scenes/invasion/components/ttl";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import { addComponent, addEntity, type EntityId, type World } from "bitecs";

interface NewMuzzleFlashContext {
  world: World;
  currentMs: number;
}

const newPlayerMuzzleFlash = (ctx: NewMuzzleFlashContext, player: EntityId): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, Animation);
  Animation.msPerFrame[entity] = 160;
  Animation.nextFrameMs[entity] = ctx.currentMs + 160;
  Animation.currentFrame[entity] = 0;
  Animation.strip[entity] = [
    { x: 3, y: 2 },
    { x: 4, y: 2 },
  ];

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = 0;
  Position.y[entity] = 0;
  Position.w[entity] = 16;
  Position.h[entity] = 16;

  addComponent(ctx.world, entity, PositionFollowing);
  PositionFollowing.leader[entity] = player;
  PositionFollowing.xOffset[entity] = 0;
  PositionFollowing.yOffset[entity] = 0;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 48;
  Sprite.srcY[entity] = 32;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 16;
  Sprite.dstH[entity] = 16;

  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = ctx.currentMs + 320;
};

export default newPlayerMuzzleFlash;
