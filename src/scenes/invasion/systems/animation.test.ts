import DefaultEventLog from "@src/framework/default-event-log";
import type { TickCtx } from "@src/framework/tick-system";
import Animation from "@src/scenes/invasion/components/animation";
import AnimationUnpausable from "@src/scenes/invasion/components/animation-unpausable";
import Pause from "@src/scenes/invasion/components/singleton/pause";
import Sprite from "@src/scenes/invasion/components/sprite";
import AnimationSystem from "@src/scenes/invasion/systems/animation";
import { addComponent, addEntity, createWorld, type EntityId } from "bitecs";
import { describe, expect, test, vi } from "vitest";

interface AnimationSystemTestSetup {
  ctx: TickCtx;
  system: AnimationSystem;
}

const setupTest = (): AnimationSystemTestSetup => ({
  ctx: {
    currentMs: 0,
    deltaMs: 1,
    eventLog: new DefaultEventLog(),
    sceneSetter: {
      setScene: vi.fn(),
    },
    userInput: {
      initiated: vi.fn(),
      held: vi.fn(),
    },
    world: createWorld(),
  },
  system: new AnimationSystem(),
});

interface SpriteArgs {
  srcX: number;
  srcY: number;
}

const SPRITE_WIDTH = 2;
const SPRITE_HEIGHT = 30;

const addSprite = (ctx: TickCtx, entity: EntityId, args: SpriteArgs) => {
  addComponent(ctx.world, entity, Sprite);
  Sprite.image[entity] = "test123";
  Sprite.srcX[entity] = args.srcX;
  Sprite.srcY[entity] = args.srcY;
  Sprite.srcW[entity] = SPRITE_WIDTH;
  Sprite.srcH[entity] = SPRITE_HEIGHT;
  Sprite.dstW[entity] = 111;
  Sprite.dstH[entity] = 222;
};

const expectSpriteToHave = (entity: EntityId, args: SpriteArgs) => {
  expect(Sprite.image[entity]).toBe("test123");
  expect(Sprite.srcX[entity]).toBe(args.srcX);
  expect(Sprite.srcY[entity]).toBe(args.srcY);
  expect(Sprite.srcW[entity]).toBe(SPRITE_WIDTH);
  expect(Sprite.srcH[entity]).toBe(SPRITE_HEIGHT);
  expect(Sprite.dstW[entity]).toBe(111);
  expect(Sprite.dstH[entity]).toBe(222);
};

describe("unpausable animation", () => {
  test("entity not yet reached next frame time, entity is not modified", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, AnimationUnpausable);
    AnimationUnpausable.currentFrame[entity] = 0;
    AnimationUnpausable.msPerFrame[entity] = 10;
    AnimationUnpausable.nextFrameMs[entity] = 100;
    AnimationUnpausable.strip[entity] = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];

    ctx.currentMs = 99;

    system.tick(ctx);

    expectSpriteToHave(entity, { srcX: 0, srcY: 0 });
    expect(AnimationUnpausable.nextFrameMs[entity]).toBe(100);
    expect(Animation.currentFrame[entity]).toBe(0);
  });

  test("entity reached next frame time, frame is advanced", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, AnimationUnpausable);
    AnimationUnpausable.currentFrame[entity] = 0;
    AnimationUnpausable.msPerFrame[entity] = 10;
    AnimationUnpausable.nextFrameMs[entity] = 100;
    AnimationUnpausable.strip[entity] = [
      { x: 1, y: 1 },
      { x: 2, y: 3 },
    ];

    ctx.currentMs = 100;

    system.tick(ctx);

    expectSpriteToHave(entity, { srcX: 2 * SPRITE_WIDTH, srcY: 3 * SPRITE_HEIGHT });
    expect(AnimationUnpausable.nextFrameMs[entity]).toBe(110);
    expect(AnimationUnpausable.currentFrame[entity]).toBe(1);
  });

  test("already at last frame, should wrap around to first frame", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, AnimationUnpausable);
    AnimationUnpausable.currentFrame[entity] = 1;
    AnimationUnpausable.msPerFrame[entity] = 10;
    AnimationUnpausable.nextFrameMs[entity] = 100;
    AnimationUnpausable.strip[entity] = [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
    ];

    ctx.currentMs = 101;

    system.tick(ctx);

    expectSpriteToHave(entity, { srcX: SPRITE_WIDTH, srcY: 2 * SPRITE_HEIGHT });
    expect(AnimationUnpausable.nextFrameMs[entity]).toBe(111);
    expect(AnimationUnpausable.currentFrame[entity]).toBe(0);
  });

  test("game is paused, still advances frame", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, AnimationUnpausable);
    AnimationUnpausable.currentFrame[entity] = 0;
    AnimationUnpausable.msPerFrame[entity] = 10;
    AnimationUnpausable.nextFrameMs[entity] = 100;
    AnimationUnpausable.strip[entity] = [
      { x: 1, y: 1 },
      { x: 2, y: 3 },
    ];

    ctx.currentMs = 100;

    Pause.paused = true;
    system.tick(ctx);
    Pause.paused = false;

    expectSpriteToHave(entity, { srcX: 2 * SPRITE_WIDTH, srcY: 3 * SPRITE_HEIGHT });
    expect(AnimationUnpausable.nextFrameMs[entity]).toBe(110);
    expect(AnimationUnpausable.currentFrame[entity]).toBe(1);
  });
});

describe("animation", () => {
  test("entity not yet reached next frame time, entity is not modified", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, Animation);
    Animation.currentFrame[entity] = 0;
    Animation.msPerFrame[entity] = 10;
    Animation.nextFrameMs[entity] = 100;
    Animation.strip[entity] = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];

    ctx.currentMs = 99;

    system.tick(ctx);

    expectSpriteToHave(entity, { srcX: 0, srcY: 0 });
    expect(Animation.nextFrameMs[entity]).toBe(100);
    expect(Animation.currentFrame[entity]).toBe(0);
  });

  test("entity reached next frame time, frame is advanced", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, Animation);
    Animation.currentFrame[entity] = 0;
    Animation.msPerFrame[entity] = 10;
    Animation.nextFrameMs[entity] = 100;
    Animation.strip[entity] = [
      { x: 1, y: 1 },
      { x: 2, y: 3 },
    ];

    ctx.currentMs = 100;

    system.tick(ctx);

    expectSpriteToHave(entity, { srcX: 2 * SPRITE_WIDTH, srcY: 3 * SPRITE_HEIGHT });
    expect(Animation.nextFrameMs[entity]).toBe(110);
    expect(Animation.currentFrame[entity]).toBe(1);
  });

  test("already at last frame, should wrap around to first frame", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, Animation);
    Animation.currentFrame[entity] = 1;
    Animation.msPerFrame[entity] = 10;
    Animation.nextFrameMs[entity] = 100;
    Animation.strip[entity] = [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
    ];

    ctx.currentMs = 101;

    system.tick(ctx);

    expectSpriteToHave(entity, { srcX: SPRITE_WIDTH, srcY: 2 * SPRITE_HEIGHT });
    expect(Animation.nextFrameMs[entity]).toBe(111);
    expect(Animation.currentFrame[entity]).toBe(0);
  });

  test("game is paused, does NOT advance frame", () => {
    const { ctx, system } = setupTest();

    const entity = addEntity(ctx.world);
    addSprite(ctx, entity, { srcX: 0, srcY: 0 });
    addComponent(ctx.world, entity, Animation);
    Animation.currentFrame[entity] = 0;
    Animation.msPerFrame[entity] = 10;
    Animation.nextFrameMs[entity] = 100;
    Animation.strip[entity] = [
      { x: 1, y: 1 },
      { x: 2, y: 3 },
    ];

    ctx.currentMs = 100;

    Pause.paused = true;
    system.tick(ctx);
    Pause.paused = false;

    expectSpriteToHave(entity, { srcX: 0, srcY: 0 });
    expect(Animation.nextFrameMs[entity]).toBe(100);
    expect(Animation.currentFrame[entity]).toBe(0);
  });
});
