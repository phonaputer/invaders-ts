import { GAME_WIDTH } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import Damage from "@src/scenes/invasion/components/damage";
import DamageCallback from "@src/scenes/invasion/components/damage-callback";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import { SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import DamageType from "@src/scenes/invasion/damage-type";
import { addComponent, addEntity, type EntityId, type World } from "bitecs";

const TILE_SRC_WIDTH = 4;
const TILE_SRC_HEIGHT = 4;
const TILE_DRAW_WIDTH = 4;
const TILE_DRAW_HEIGHT = 4;

const FORTRESS_STARTING_SRC_X = 48;
const FORTRESS_STARTING_SRC_Y = 48;

interface NewFortressContext {
  world: World;
  currentMs: number;
}

interface NewTileArgs {
  ctx: NewFortressContext;
  x: number;
  y: number;
  spriteSrcX: number;
  spriteSrcY: number;
}

const tileOnDamage = (_: TickCtx, entity: EntityId, amount: number): void => {
  Sprite.srcX[entity]! += TILE_SRC_WIDTH * 6 * amount;
};

const newFortressTile = ({ ctx, x, y, spriteSrcX, spriteSrcY }: NewTileArgs): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 0;
  CollisionPassive.hitboxOffsetY[entity] = 0;
  CollisionPassive.hitboxW[entity] = TILE_DRAW_WIDTH;
  CollisionPassive.hitboxH[entity] = TILE_DRAW_HEIGHT;

  addComponent(ctx.world, entity, Damage);
  Damage.type[entity] = DamageType.Fortress;
  Damage.amount[entity] = 1;

  addComponent(ctx.world, entity, DamageCallback);
  DamageCallback.callback[entity] = tileOnDamage;

  addComponent(ctx.world, entity, Hitpoints);
  Hitpoints.susceptibleToDamageType[entity] = DamageType.PlayerProjectile | DamageType.AlienProjectile;
  Hitpoints.current[entity] = 3;

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = x;
  Position.y[entity] = y;
  Position.w[entity] = TILE_DRAW_WIDTH;
  Position.h[entity] = TILE_DRAW_HEIGHT;

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = spriteSrcX;
  Sprite.srcY[entity] = spriteSrcY;
  Sprite.srcW[entity] = TILE_SRC_WIDTH;
  Sprite.srcH[entity] = TILE_SRC_HEIGHT;
  Sprite.dstW[entity] = TILE_DRAW_WIDTH;
  Sprite.dstH[entity] = TILE_DRAW_HEIGHT;
};

interface NewFortressArgs {
  ctx: NewFortressContext;
  x: number;
  y: number;
}

const newFortress = ({ ctx, x, y }: NewFortressArgs): void => {
  for (let column = 0; column < 6; column++) {
    const tileX = x + column * TILE_DRAW_WIDTH;
    const tileSrcX = FORTRESS_STARTING_SRC_X + column * TILE_SRC_WIDTH;

    for (let row = 0; row < 4; row++) {
      if (row == 3 && (column == 2 || column == 3)) {
        continue;
      }

      const tileY = y + row * TILE_DRAW_HEIGHT;
      const tileSrcY = FORTRESS_STARTING_SRC_Y + row * TILE_SRC_HEIGHT;

      newFortressTile({ ctx, x: tileX, y: tileY, spriteSrcX: tileSrcX, spriteSrcY: tileSrcY });
    }
  }
};

const FORTRESS_Y = 235;
const FORTRESS_WIDTH = 24;
const FORTRESS_X_SPACING = 28;
const NUM_FORTRESSES = 4;

const setupFortreses = (ctx: NewFortressContext): void => {
  const xSpaceTakenUpByForts = FORTRESS_WIDTH * NUM_FORTRESSES + FORTRESS_X_SPACING * (NUM_FORTRESSES - 1);
  const remainingXSpace = GAME_WIDTH - xSpaceTakenUpByForts;

  let x = Math.trunc(remainingXSpace / 2);

  for (let i = 0; i < NUM_FORTRESSES; i++) {
    newFortress({ ctx, x, y: FORTRESS_Y });
    x += FORTRESS_WIDTH + FORTRESS_X_SPACING;
  }
};

export default setupFortreses;
