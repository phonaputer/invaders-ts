import { GAME_WIDTH } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import { Input } from "@src/framework/user-input";
import PlayerMovement from "@src/scenes/invasion/components/player-movement";
import Position from "@src/scenes/invasion/components/position";
import Sprite from "@src/scenes/invasion/components/sprite";
import { query, type EntityId } from "bitecs";

interface Frame {
  x: number;
  y: number;
}

export default class PlayerMovementSystem {
  tick(ctx: TickCtx): void {
    for (const entity of query(ctx.world, [PlayerMovement, Position, Sprite])) {
      this.handleInput(ctx, entity);
      this.animate(ctx, entity);
    }
  }

  private handleInput(ctx: TickCtx, entity: EntityId) {
    const leftInput = ctx.userInput.held(Input.Left);
    const rightInput = ctx.userInput.held(Input.Right);

    if (leftInput && !rightInput) {
      this.moveLeft(entity);
    } else if (rightInput && !leftInput) {
      this.moveRight(entity);
    } else {
      PlayerMovement.playing[entity] = false;
    }
  }

  private moveLeft(entity: EntityId) {
    const newX = Math.max(0, Position.x[entity]! - PlayerMovement.speedX[entity]!);

    if (Position.x[entity] != newX) {
      PlayerMovement.playing[entity] = true;
      PlayerMovement.reversed[entity] = true;
    } else {
      PlayerMovement.playing[entity] = false;
    }

    Position.x[entity] = newX;
  }

  private moveRight(entity: EntityId) {
    let newX = Position.x[entity]! + PlayerMovement.speedX[entity]!;
    if (newX + Position.w[entity]! > GAME_WIDTH) {
      newX = GAME_WIDTH - Position.w[entity]!;
    }

    if (Position.x[entity] != newX) {
      PlayerMovement.playing[entity] = true;
      PlayerMovement.reversed[entity] = false;
    } else {
      PlayerMovement.playing[entity] = false;
    }

    Position.x[entity] = newX;
  }

  private animate(ctx: TickCtx, entity: EntityId) {
    if (PlayerMovement.playing[entity] === false || PlayerMovement.nextFrameMs[entity]! > ctx.currentMs) {
      return;
    }

    PlayerMovement.nextFrameMs[entity] = ctx.currentMs + PlayerMovement.msPerFrame[entity]!;

    const frame = this.advanceFrame(entity);

    Sprite.srcX[entity] = frame.x * Sprite.srcW[entity]!;
    Sprite.srcY[entity] = frame.y * Sprite.srcH[entity]!;
  }

  private advanceFrame(entity: EntityId): Frame {
    const strip = PlayerMovement.strip[entity]!;

    let currentFrame = PlayerMovement.currentFrame[entity]!;

    if (PlayerMovement.reversed) {
      if (currentFrame == 0) {
        currentFrame = strip.length - 1;
      } else {
        currentFrame--;
      }
    } else {
      currentFrame++;
      if (currentFrame >= strip.length) {
        currentFrame = 0;
      }
    }

    PlayerMovement.currentFrame[entity] = currentFrame;

    return strip[currentFrame]!;
  }
}
