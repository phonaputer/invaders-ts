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

  private executeAnimations(ctx: TickCtx) {
    for (const entity of query(ctx.world, [Animation, Sprite])) {
      if (Animation.nextFrameMs[entity]! > ctx.currentMs) {
        continue;
      }

      Animation.nextFrameMs[entity] = ctx.currentMs + Animation.msPerFrame[entity]!;

      const strip = Animation.strip[entity]!;
      const currentFrame = (Animation.currentFrame[entity]! + 1) % strip.length;

      Animation.currentFrame[entity] = currentFrame;

      const frame = strip[currentFrame]!;

      Sprite.srcX[entity] = frame.x * Sprite.srcW[entity]!;
      Sprite.srcY[entity] = frame.y * Sprite.srcH[entity]!;
    }
  }

  private executeUnpausableAnimations(ctx: TickCtx) {
    for (const entity of query(ctx.world, [AnimationUnpausable, Sprite])) {
      if (AnimationUnpausable.nextFrameMs[entity]! > ctx.currentMs) {
        continue;
      }

      AnimationUnpausable.nextFrameMs[entity] = ctx.currentMs + AnimationUnpausable.msPerFrame[entity]!;

      const strip = AnimationUnpausable.strip[entity]!;
      const currentFrame = (AnimationUnpausable.currentFrame[entity]! + 1) % strip.length;

      AnimationUnpausable.currentFrame[entity] = currentFrame;

      const frame = strip[currentFrame]!;

      Sprite.srcX[entity] = frame.x * Sprite.srcW[entity]!;
      Sprite.srcY[entity] = frame.y * Sprite.srcH[entity]!;
    }
  }
}
