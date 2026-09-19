import type { TickCtx } from "@src/framework/tick-system";

const InvaderOrchestrationState = {
  baseMsPerMove: 0,
  nextMoveMs: 0,
  xSpeed: 0,
  ySpeed: 0,
  lastInvaderXSpeed: 0,
  lastInvaderYSpeed: 0,
  msPerAttack: 0,
  nextAttackMs: 0,
  currentArpIndex: 0,
  movingLeft: false,
  noInvadersCallback: (_ctx: TickCtx): void => {},
  touchdownCallback: (_ctx: TickCtx): void => {},
  attackCallback: (_ctx: TickCtx): void => {},
};

export default InvaderOrchestrationState;
