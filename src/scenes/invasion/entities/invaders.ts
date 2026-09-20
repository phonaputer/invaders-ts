import type { TickCtx } from "@src/framework/tick-system";
import InvaderOrchestration from "@src/scenes/invasion/components/invader-orchestration";
import Position from "@src/scenes/invasion/components/position";
import InvaderOrchestrationState from "@src/scenes/invasion/components/singleton/invader-orchestration-state";
import newCrab from "@src/scenes/invasion/entities/invader-crab";
import newJellyfish from "@src/scenes/invasion/entities/invader-jellyfish";
import newOctopus from "@src/scenes/invasion/entities/invader-octopus";
import newInvaderProjectile from "@src/scenes/invasion/entities/invader-projectile";
import newTadpole from "@src/scenes/invasion/entities/invader-tadpole";
import { query, type World } from "bitecs";

const onAttack = (ctx: TickCtx): void => {
  const invaders = query(ctx.world, [Position, InvaderOrchestration]);

  if (invaders.length < 1) {
    return;
  }

  const attackingInvader = invaders[Math.floor(Math.random() * invaders.length)]!;

  newInvaderProjectile(ctx, { x: Position.x[attackingInvader]!, y: Position.y[attackingInvader]! });
};

const STARTING_X = 2;
const ALIEN_WIDTH = 14;
const ALIEN_HEIGHT = 14;
const COL_SPACING = 2;
const ROW_SPACING = -1.2;

const rackInvaders = (ctx: TickCtx): void => {
  let x = STARTING_X;
  let y = 32;

  const rowInvaderFns = [newOctopus, newJellyfish, newCrab, newTadpole, newTadpole];

  for (const newInvader of rowInvaderFns) {
    for (let i = 0; i < 12; i++) {
      newInvader({ ctx, x, y });
      x += ALIEN_WIDTH + COL_SPACING;
    }

    x = STARTING_X;
    y += ALIEN_HEIGHT + ROW_SPACING;
  }

  InvaderOrchestrationState.movingLeft = false;
  InvaderOrchestrationState.currentArpIndex = 0;
  InvaderOrchestrationState.nextMoveMs = InvaderOrchestrationState.baseMsPerMove + ctx.currentMs;
};

interface SetupInvadersContext {
  world: World;
  currentMs: number;
}

const setupInvaders = (ctx: SetupInvadersContext) => {
  InvaderOrchestrationState.baseMsPerMove = 66;
  InvaderOrchestrationState.nextMoveMs = 66 + ctx.currentMs;
  InvaderOrchestrationState.xSpeed = 8;
  InvaderOrchestrationState.ySpeed = 12;
  InvaderOrchestrationState.lastInvaderXSpeed = 16;
  InvaderOrchestrationState.lastInvaderYSpeed = 12;
  InvaderOrchestrationState.msPerAttack = 320;
  InvaderOrchestrationState.nextAttackMs = 320 + ctx.currentMs;
  InvaderOrchestrationState.currentArpIndex = 0;
  InvaderOrchestrationState.movingLeft = false;
  InvaderOrchestrationState.noInvadersCallback = rackInvaders;
  InvaderOrchestrationState.touchdownCallback = (_tickCtx: TickCtx) => {
    console.log("You lose - more coming here soon...");
  };
  InvaderOrchestrationState.attackCallback = onAttack;
};

export default setupInvaders;
