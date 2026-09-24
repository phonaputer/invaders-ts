import { GAME_WIDTH } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import AudioStarted from "@src/scenes/invasion/components/events/audio-started";
import InvaderAnimation from "@src/scenes/invasion/components/invader-animation";
import InvaderOrchestration from "@src/scenes/invasion/components/invader-orchestration";
import Position from "@src/scenes/invasion/components/position";
import InvaderOrchestrationState from "@src/scenes/invasion/components/singleton/invader-orchestration-state";
import Pause from "@src/scenes/invasion/components/singleton/pause";
import Sprite from "@src/scenes/invasion/components/sprite";
import { ARP1_AUDIO, ARP2_AUDIO, ARP3_AUDIO, ARP4_AUDIO, GROUND_HEIGHT } from "@src/scenes/invasion/constants";
import { addComponent, addEntity, query } from "bitecs";

export default class InvaderOrchestrationSystem {
  private readonly arpSounds = [ARP1_AUDIO, ARP2_AUDIO, ARP3_AUDIO, ARP4_AUDIO];

  tick(ctx: TickCtx): void {
    if (Pause.paused) {
      return;
    }

    const invaderCount = this.countInvaders(ctx);
    if (invaderCount < 1) {
      InvaderOrchestrationState.noInvadersCallback(ctx);
      return;
    }

    this.attack(ctx);

    if (!this.shouldMoveThisTick(ctx, invaderCount)) {
      return;
    }

    this.moveInvaders(ctx, invaderCount);
    this.animateInvaders(ctx);
    this.playArp(ctx);
  }

  private countInvaders(ctx: TickCtx): number {
    return query(ctx.world, [InvaderOrchestration]).length;
  }

  private attack(ctx: TickCtx): void {
    if (ctx.currentMs < InvaderOrchestrationState.nextAttackMs) {
      return;
    }

    InvaderOrchestrationState.nextAttackMs = ctx.currentMs + InvaderOrchestrationState.msPerAttack;

    InvaderOrchestrationState.attackCallback(ctx);
  }

  private shouldMoveThisTick(ctx: TickCtx, invaderCount: number): boolean {
    if (InvaderOrchestrationState.nextMoveMs <= ctx.currentMs) {
      InvaderOrchestrationState.nextMoveMs =
        ctx.currentMs + InvaderOrchestrationState.baseMsPerMove + invaderCount * 16;
      return true;
    }

    return false;
  }

  private moveInvaders(ctx: TickCtx, invaderCount: number): void {
    if (this.handleWallHit(ctx, invaderCount)) {
      return;
    }

    let dx = InvaderOrchestrationState.xSpeed;
    if (invaderCount == 1) {
      dx = InvaderOrchestrationState.lastInvaderXSpeed;
    }
    if (InvaderOrchestrationState.movingLeft) {
      dx = -dx;
    }

    for (const entity of query(ctx.world, [Position, InvaderOrchestration])) {
      Position.x[entity]! += dx;
    }
  }

  private handleWallHit(ctx: TickCtx, invaderCount: number): boolean {
    let dx = InvaderOrchestrationState.xSpeed;
    if (invaderCount == 1) {
      dx = InvaderOrchestrationState.lastInvaderXSpeed;
    }

    const entities = query(ctx.world, [Position, InvaderOrchestration]);

    let hitWall = false;

    if (InvaderOrchestrationState.movingLeft) {
      for (const entity of entities) {
        if (Position.x[entity]! - dx <= 0) {
          hitWall = true;
          break;
        }
      }
    } else {
      for (const entity of entities) {
        if (Position.x[entity]! + Position.w[entity]! + dx >= GAME_WIDTH) {
          hitWall = true;
          break;
        }
      }
    }

    if (!hitWall) {
      return false;
    }

    InvaderOrchestrationState.movingLeft = !InvaderOrchestrationState.movingLeft;

    let dy = InvaderOrchestrationState.ySpeed;
    if (invaderCount == 1) {
      dy = InvaderOrchestrationState.lastInvaderYSpeed;
    }

    for (const entity of entities) {
      Position.y[entity]! += dy;
    }

    for (const entity of entities) {
      if (Position.y[entity]! + Position.w[entity]! >= GROUND_HEIGHT) {
        InvaderOrchestrationState.touchdownCallback(ctx);
        break;
      }
    }

    return true;
  }

  private animateInvaders(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [InvaderAnimation, Sprite])) {
      InvaderAnimation.currentFrame[entity] =
        (InvaderAnimation.currentFrame[entity]! + 1) % InvaderAnimation.strip[entity]!.length;

      const frame = InvaderAnimation.strip[entity]![InvaderAnimation.currentFrame[entity]!]!;

      Sprite.srcX[entity] = frame.x * Sprite.srcW[entity]!;
      Sprite.srcY[entity] = frame.y * Sprite.srcH[entity]!;
    }
  }

  private playArp(ctx: TickCtx): void {
    const startAudio = addEntity(ctx.world);
    addComponent(ctx.world, startAudio, AudioStarted);
    AudioStarted.id[startAudio] = this.arpSounds[InvaderOrchestrationState.currentArpIndex]!;

    InvaderOrchestrationState.currentArpIndex++;
    if (InvaderOrchestrationState.currentArpIndex >= this.arpSounds.length) {
      InvaderOrchestrationState.currentArpIndex = 0;
    }
  }
}
