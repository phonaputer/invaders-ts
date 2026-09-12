import { GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import PlayerMovement from "@src/scenes/invasion/components/player-movement";
import Position from "@src/scenes/invasion/components/position";
import { addComponent, addEntity, type World } from "bitecs";

import spaceInvadersSpritesheet from "@src/assets/space_invaders.png";
import Sprite from "@src/scenes/invasion/components/sprite";

interface NewPlayerContext {
  world: World;
  currentMs: number;
}

const newPlayer = (ctx: NewPlayerContext): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, PlayerMovement);
  PlayerMovement.nextFrameMs[entity] = ctx.currentMs + 66;
  PlayerMovement.msPerFrame[entity] = 66;
  PlayerMovement.currentFrame[entity] = 0;
  PlayerMovement.strip[entity] = [
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ];
  PlayerMovement.playing[entity] = false;
  PlayerMovement.reversed[entity] = false;
  PlayerMovement.speedX[entity] = 1.5;

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = GAME_WIDTH / 2 - 8;
  Position.y[entity] = GAME_HEIGHT - 35;
  Position.w[entity] = 16;
  Position.h[entity] = 16;

  // TODO this is gonna create multiple images if multiple players get created. needs fixin'
  const spriteSheetImage = new Image();
  spriteSheetImage.src = spaceInvadersSpritesheet;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = spriteSheetImage;
  Sprite.srcX[entity] = 0;
  Sprite.srcY[entity] = 32;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 16;
  Sprite.dstH[entity] = 16;
};

export default newPlayer;
