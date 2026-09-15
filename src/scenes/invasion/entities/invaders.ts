import type { TickCtx } from "@src/framework/tick-system";
import InvaderOrchestrationState from "@src/scenes/invasion/components/singleton/invader-orchestration-state";
import newCrab from "@src/scenes/invasion/entities/invader-crab";
import newJellyfish from "@src/scenes/invasion/entities/invader-jellyfish";
import newOctopus from "@src/scenes/invasion/entities/invader-octopus";
import newTadpole from "@src/scenes/invasion/entities/invader-tadpole";
import type { World } from "bitecs";

interface SetupInvadersContext {
  world: World;
  currentMs: number;
}

const STARTING_X = 2;
const ALIEN_WIDTH = 14;
const ALIEN_HEIGHT = 14;
const COL_SPACING = 2;
const ROW_SPACING = -1.2;

const setupInvaders = (ctx: SetupInvadersContext) => {
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
  InvaderOrchestrationState.noInvadersCallback = (ctx: TickCtx) => {
    setupInvaders(ctx);
  };
  InvaderOrchestrationState.touchdownCallback = (_ctx: TickCtx) => {
    console.log("You lose - more coming here soon...");
  };
};

export default setupInvaders;
