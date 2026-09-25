import type { Audio } from "@src/framework/asset-getter";
import type { RenderCtx } from "@src/framework/render-system";
import AudioStarted from "@src/scenes/invasion/components/events/audio-started";
import AudioStopped from "@src/scenes/invasion/components/events/audio-stopped";
import AudioRenderingSystem from "@src/scenes/invasion/systems/audio-rendering";
import { addComponent, addEntity, createWorld } from "bitecs";
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
    renderer: {
      drawImage: vi.fn(),
      drawLine: vi.fn(),
      drawRect: vi.fn(),
      clearAll: vi.fn(),
    },
    world: createWorld(),
  },
  system: new AudioRenderingSystem(),
});

const mockAudio = (): Audio => ({
  currentTime: DEFAULT_AUDIO_TIME,
  play: vi.fn(),
  pause: vi.fn(),
});

const start = (ctx: RenderCtx, id: string): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, AudioStarted);
  AudioStarted.id[entity] = id;
};

const stop = (ctx: RenderCtx, id: string): void => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, AudioStopped);
  AudioStopped.id[entity] = id;
};

test("sound is requested to be played, it is played", () => {
  const { ctx, system } = setupTest();

  start(ctx, "id123");

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(audio.currentTime).toBe(0);
  expect(audio.play).toHaveBeenCalled();
});

test("sound is requested to be played multiple times, it is played once", () => {
  const { ctx, system } = setupTest();

  start(ctx, "id123");
  start(ctx, "id123");
  start(ctx, "id123");

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(vi.mocked(ctx.assetGetter.getAudio)).toHaveBeenCalledTimes(1);
  expect(audio.currentTime).toBe(0);
  expect(audio.play).toHaveBeenCalledTimes(1);
});

test("sound is requested to be stopped, it is stopped", () => {
  const { ctx, system } = setupTest();

  stop(ctx, "id123");

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(audio.currentTime).toBe(DEFAULT_AUDIO_TIME);
  expect(audio.pause).toHaveBeenCalled();
});

test("sound is requested to be stopped multiple times, it is stopped once", () => {
  const { ctx, system } = setupTest();

  stop(ctx, "id123");
  stop(ctx, "id123");
  stop(ctx, "id123");

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(vi.mocked(ctx.assetGetter.getAudio)).toHaveBeenCalledTimes(1);
  expect(audio.currentTime).toBe(DEFAULT_AUDIO_TIME);
  expect(audio.pause).toHaveBeenCalledTimes(1);
});

test("sound is requested to be played & stopped, it is stopped not played", () => {
  const { ctx, system } = setupTest();

  start(ctx, "id123");
  stop(ctx, "id123");

  const audio = mockAudio();
  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(audio);

  system.render(ctx);

  expect(audio.currentTime).toBe(DEFAULT_AUDIO_TIME);
  expect(audio.pause).toHaveBeenCalled();
  expect(audio.play).not.toHaveBeenCalled();
});

test("non-existent sound is requested to be played, no error", () => {
  const { ctx, system } = setupTest();

  start(ctx, "id123");

  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(undefined);

  system.render(ctx);
});

test("non-existent sound is requested to be stopped, no error", () => {
  const { ctx, system } = setupTest();

  stop(ctx, "id123");

  vi.mocked(ctx.assetGetter.getAudio).mockReturnValue(undefined);

  system.render(ctx);
});
