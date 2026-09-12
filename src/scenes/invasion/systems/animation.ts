import type { TickCtx } from "@src/framework/tick-system";
import Animation from "@src/scenes/invasion/components/animation";
import AnimationUnpausable from "@src/scenes/invasion/components/animation-unpausable";
import Pause from "@src/scenes/invasion/components/singleton/pause";
import Sprite from "@src/scenes/invasion/components/sprite";
import { query } from "bitecs";

export default class AnimationSystem {
  tick(ctx: TickCtx): void {
    this.executeUnpausableAnimations(ctx);

    if (Pause.paused) {
      return;
    }

    this.executeAnimations(ctx);
  }

  executeAnimations(ctx: TickCtx) {
    for (const entity of query(ctx.world, [Animation, Sprite])) {
      if (Animation.nextFrameMs[entity]! > ctx.currentMs) {
        continue;
      }

      Animation.nextFrameMs[entity] = ctx.currentMs + Animation.msPerFrame[entity]!;

      const strip = Animation.strip[entity]!;

      let currentFrame = Animation.currentFrame[entity]!;
      currentFrame++;
      if (currentFrame >= strip.length) {
        currentFrame = 0;
      }

      Animation.currentFrame[entity] = currentFrame;

      const frame = strip[currentFrame]!;

      Sprite.srcX[entity] = frame.x * Sprite.srcW[entity]!;
      Sprite.srcY[entity] = frame.y * Sprite.srcH[entity]!;
    }
  }

  executeUnpausableAnimations(ctx: TickCtx) {
    for (const entity of query(ctx.world, [AnimationUnpausable, Sprite])) {
      if (AnimationUnpausable.nextFrameMs[entity]! > ctx.currentMs) {
        continue;
      }

      AnimationUnpausable.nextFrameMs[entity] = ctx.currentMs + AnimationUnpausable.msPerFrame[entity]!;

      const strip = AnimationUnpausable.strip[entity]!;

      let currentFrame = AnimationUnpausable.currentFrame[entity]!;
      currentFrame++;
      if (currentFrame >= strip.length) {
        currentFrame = 0;
      }

      AnimationUnpausable.currentFrame[entity] = currentFrame;

      const frame = strip[currentFrame]!;

      Sprite.srcX[entity] = frame.x * Sprite.srcW[entity]!;
      Sprite.srcY[entity] = frame.y * Sprite.srcH[entity]!;
    }
  }
}
