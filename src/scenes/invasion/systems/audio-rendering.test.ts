import type { Audio } from "@src/framework/asset-getter";
import DefaultEventLog from "@src/framework/default-event-log";
import type { RenderCtx } from "@src/framework/render-system";
import { PLAY_AUDIO_EVENT_TYPE, type default as PlayAudio } from "@src/scenes/invasion/events/play-audio";
import type StopAudio from "@src/scenes/invasion/events/stop-audio";
import { STOP_AUDIO_EVENT_TYPE } from "@src/scenes/invasion/events/stop-audio";
import AudioRenderingSystem from "@src/scenes/invasion/systems/audio-rendering";
import { createWorld } from "bitecs";
import { expect, test, vi } from "vitest";

const DEFAULT_AUDIO_TIME = 100;

interface AudioRenderingSystemTestSetup {
  ctx: RenderCtx;
  system: AudioRenderingSystem;
}

const setupTest = (): AudioRenderingSystemTestSetup => ({
  ctx: {
    assetGetter: {
      getImage: vi.fn(),
      getAudio: vi.fn(),
    },
    eventLog: new DefaultEventLog(),
    renderer: {
      drawImage: vi.fn(),
      drawLine: vi.fn(),
      clearAll: vi.fn(),
    },
    world: createWorld(),
  },
  system: new AudioRenderingSystem(),
});

const mockAudio = (): Audio => {
  return {
    currentTime: DEFAULT_AUDIO_TIME,
    play: vi.fn(),
    pause: vi.fn(),
  };
};

test("sound is requested to be played, it is played", () => {
  const { ctx, system } = setupTest();

  const event: PlayAudio = { id: "id123" };
  ctx.eventLog.pushRender(PLAY_AUDIO_EVENT_TYPE, event);

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(audio.currentTime).toBe(0);
  expect(audio.play).toHaveBeenCalled();
});

test("sound is requested to be played multiple times, it is played once", () => {
  const { ctx, system } = setupTest();

  const event: PlayAudio = { id: "id123" };
  ctx.eventLog.pushRender(PLAY_AUDIO_EVENT_TYPE, event);
  ctx.eventLog.pushRender(PLAY_AUDIO_EVENT_TYPE, event);
  ctx.eventLog.pushRender(PLAY_AUDIO_EVENT_TYPE, event);

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(vi.mocked(ctx.assetGetter.getAudio)).toHaveBeenCalledTimes(1);
  expect(audio.currentTime).toBe(0);
  expect(audio.play).toHaveBeenCalledTimes(1);
});

test("sound is requested to be stopped, it is stopped", () => {
  const { ctx, system } = setupTest();

  const event: StopAudio = { id: "id123" };
  ctx.eventLog.pushRender(STOP_AUDIO_EVENT_TYPE, event);

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(audio.currentTime).toBe(DEFAULT_AUDIO_TIME);
  expect(audio.pause).toHaveBeenCalled();
});

test("sound is requested to be stopped multiple times, it is stopped once", () => {
  const { ctx, system } = setupTest();

  const event: StopAudio = { id: "id123" };
  ctx.eventLog.pushRender(STOP_AUDIO_EVENT_TYPE, event);
  ctx.eventLog.pushRender(STOP_AUDIO_EVENT_TYPE, event);
  ctx.eventLog.pushRender(STOP_AUDIO_EVENT_TYPE, event);

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(vi.mocked(ctx.assetGetter.getAudio)).toHaveBeenCalledTimes(1);
  expect(audio.currentTime).toBe(DEFAULT_AUDIO_TIME);
  expect(audio.pause).toHaveBeenCalledTimes(1);
});

test("sound is requested to be played & stopped, it is stopped not played", () => {
  const { ctx, system } = setupTest();

  const eventPlay: PlayAudio = { id: "id123" };
  ctx.eventLog.pushRender(PLAY_AUDIO_EVENT_TYPE, eventPlay);
  const eventStop: StopAudio = { id: "id123" };
  ctx.eventLog.pushRender(STOP_AUDIO_EVENT_TYPE, eventStop);

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(audio.currentTime).toBe(DEFAULT_AUDIO_TIME);
  expect(audio.pause).toHaveBeenCalled();
  expect(audio.play).not.toHaveBeenCalled();
});

test("non-existent sound is requested to be played, no error", () => {
  const { ctx, system } = setupTest();

  const event: PlayAudio = { id: "id123" };
  ctx.eventLog.pushRender(PLAY_AUDIO_EVENT_TYPE, event);

  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(undefined);

  system.render(ctx);
});

test("non-existent sound is requested to be stopped, no error", () => {
  const { ctx, system } = setupTest();

  const event: StopAudio = { id: "id123" };
  ctx.eventLog.pushRender(STOP_AUDIO_EVENT_TYPE, event);

  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(undefined);

  system.render(ctx);
});
