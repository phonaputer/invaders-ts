import type { RenderCtx } from "@src/framework/render-system";
import AudioStarted from "@src/scenes/invasion/components/events/audio-started";
import AudioStopped from "@src/scenes/invasion/components/events/audio-stopped";
import { query } from "bitecs";

export default class AudioRenderingSystem {
  render(ctx: RenderCtx): void {
    const soundsToPlay = new Set<string>();
    const soundsToStop = new Set<string>();

    for (const entity of query(ctx.world, [AudioStopped])) {
      soundsToStop.add(AudioStopped.id[entity]!);
    }

    for (const entity of query(ctx.world, [AudioStarted])) {
      const id = AudioStarted.id[entity]!;
      if (!soundsToStop.has(id)) {
        soundsToPlay.add(id);
      }
    }

    for (const soundID of soundsToPlay) {
      const sound = ctx.assetGetter.getAudio(soundID);
      if (sound !== undefined) {
        sound.currentTime = 0;
        sound.play();
      }
    }

    for (const soundID of soundsToStop) {
      ctx.assetGetter.getAudio(soundID)?.pause();
    }
  }
}
