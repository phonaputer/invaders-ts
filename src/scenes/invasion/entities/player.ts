import { GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import Damage from "@src/scenes/invasion/components/damage";
import DeletionCallback from "@src/scenes/invasion/components/deletion-callback";
import AudioStarted from "@src/scenes/invasion/components/events/audio-started";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import PlayerAttack, { type PlayerAttackCallbackArgs } from "@src/scenes/invasion/components/player-attack";
import PlayerMovement from "@src/scenes/invasion/components/player-movement";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import { PLAYER_ATTACK_AUDIO, SPRITE_SHEET_IMG_ID } from "@src/scenes/invasion/constants";
import DamageType from "@src/scenes/invasion/damage-type";
import { onPlayerDefeat } from "@src/scenes/invasion/entities/game";
import newPlayerMuzzleFlash from "@src/scenes/invasion/entities/player-muzzle-flash";
import newPlayerProjectile, { activeProjectileCount } from "@src/scenes/invasion/entities/player-projectile";
import { addComponent, addEntity, type World } from "bitecs";

interface NewPlayerContext {
  world: World;
  currentMs: number;
}

const newPlayer = (ctx: NewPlayerContext): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 0;
  CollisionPassive.hitboxOffsetY[entity] = 7;
  CollisionPassive.hitboxW[entity] = 15;
  CollisionPassive.hitboxH[entity] = 5;

  addComponent(ctx.world, entity, Damage);
  Damage.type[entity] = DamageType.Player;
  Damage.amount[entity] = 1;

  addComponent(ctx.world, entity, DeletionCallback);
  DeletionCallback.callback[entity] = onPlayerDefeat;

  addComponent(ctx.world, entity, Hitpoints);
  Hitpoints.susceptibleToDamageType[entity] = DamageType.AlienProjectile;
  Hitpoints.current[entity] = 1;

  addComponent(ctx.world, entity, PlayerAttack);
  PlayerAttack.msPerAttack[entity] = 150;
  PlayerAttack.nextAttackMs[entity] = ctx.currentMs + 50;
  PlayerAttack.callback[entity] = standardWeaponCallback;

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

  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = SPRITE_SHEET_IMG_ID;
  Sprite.srcX[entity] = 0;
  Sprite.srcY[entity] = 32;
  Sprite.srcW[entity] = 16;
  Sprite.srcH[entity] = 16;
  Sprite.dstW[entity] = 16;
  Sprite.dstH[entity] = 16;
};

const standardWeaponCallback = ({ ctx, entity, x, y }: PlayerAttackCallbackArgs): void => {
  if (activeProjectileCount() >= 3) {
    return;
  }

  newPlayerProjectile(ctx, { x, y });
  newPlayerMuzzleFlash(ctx, entity);

  const startAudio = addEntity(ctx.world);
  addComponent(ctx.world, startAudio, AudioStarted);
  AudioStarted.id[startAudio] = PLAYER_ATTACK_AUDIO;
};

export default newPlayer;
