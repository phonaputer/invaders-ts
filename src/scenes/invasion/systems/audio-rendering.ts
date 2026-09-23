import type { RenderCtx } from "@src/framework/render-system";
import type PlayAudio from "@src/scenes/invasion/events/play-audio";
import { PLAY_AUDIO_EVENT_TYPE } from "@src/scenes/invasion/events/play-audio";
import type StopAudio from "@src/scenes/invasion/events/stop-audio";
import { STOP_AUDIO_EVENT_TYPE } from "@src/scenes/invasion/events/stop-audio";

export default class AudioRenderingSystem {
  render(ctx: RenderCtx): void {
    const soundsToPlay = new Set<string>();
    const soundsToStop = new Set<string>();

    for (const rawEvent of ctx.eventLog.getRender(STOP_AUDIO_EVENT_TYPE)) {
      const event = rawEvent as StopAudio;
      soundsToStop.add(event.id);
    }

    for (const rawEvent of ctx.eventLog.getRender(PLAY_AUDIO_EVENT_TYPE)) {
      const event = rawEvent as PlayAudio;
      if (!soundsToStop.has(event.id)) {
        soundsToPlay.add(event.id);
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
