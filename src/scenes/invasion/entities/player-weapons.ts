import AudioStarted from "@src/scenes/invasion/components/events/audio-started";
import PlayerAttack, { type PlayerAttackCallbackArgs } from "@src/scenes/invasion/components/player-attack";
import { PLAYER_ATTACK_AUDIO } from "@src/scenes/invasion/constants";
import newPlayerMuzzleFlash from "@src/scenes/invasion/entities/player-muzzle-flash";
import newPlayerProjectile, { activeProjectileCount } from "@src/scenes/invasion/entities/player-projectile";
import { addComponent, addEntity, hasComponent, type EntityId, type World } from "bitecs";

interface GrantWeaponCtx {
  currentMs: number;
  world: World;
}

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

export const grantStandardWeapon = (ctx: GrantWeaponCtx, entity: EntityId): void => {
  if (hasComponent(ctx.world, entity, PlayerAttack)) {
    PlayerAttack.msPerAttack[entity] = 150;
    PlayerAttack.nextAttackMs[entity] = ctx.currentMs + 50;
    PlayerAttack.callback[entity] = standardWeaponCallback;
  }
};

const fastWeaponCallback = ({ ctx, entity, x, y }: PlayerAttackCallbackArgs): void => {
  newPlayerProjectile(ctx, { x, y });
  newPlayerMuzzleFlash(ctx, entity);

  const startAudio = addEntity(ctx.world);
  addComponent(ctx.world, startAudio, AudioStarted);
  AudioStarted.id[startAudio] = PLAYER_ATTACK_AUDIO;
};

export const grantFastWeapon = (ctx: GrantWeaponCtx, entity: EntityId): void => {
  if (hasComponent(ctx.world, entity, PlayerAttack)) {
    PlayerAttack.msPerAttack[entity] = 100;
    PlayerAttack.nextAttackMs[entity] = ctx.currentMs + 100;
    PlayerAttack.callback[entity] = fastWeaponCallback;
  }
};
