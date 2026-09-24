import type { TickCtx } from "@src/framework/tick-system";
import CallbackOnTimeout from "@src/scenes/invasion/components/callback-on-timeout";
import CallbackOnTimeoutSystem from "@src/scenes/invasion/systems/callback-on-timeout";
import { addComponent, addEntity, createWorld, entityExists, hasComponent } from "bitecs";
import { expect, test, vi } from "vitest";

interface CallbackOnTimeoutSystemTestSetup {
  ctx: TickCtx;
  system: CallbackOnTimeoutSystem;
}

const setupTest = (): CallbackOnTimeoutSystemTestSetup => ({
  ctx: {
    currentMs: 0,
    deltaMs: 1,
    sceneSetter: {
      setScene: vi.fn(),
    },
    userInput: {
      initiated: vi.fn(),
      held: vi.fn(),
    },
    world: createWorld(),
  },
  system: new CallbackOnTimeoutSystem(),
});

test("timeout not yet reached, callback not invoked", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, CallbackOnTimeout);
  const callback = vi.fn();
  CallbackOnTimeout.callback[entity] = callback;
  CallbackOnTimeout.callbackMs[entity] = 100;
  ctx.currentMs = 99;

  system.tick(ctx);

  expect(callback).not.toHaveBeenCalled();
  expect(hasComponent(ctx.world, entity, CallbackOnTimeout)).toBe(true);
});

test("timeout reached, callback invoked & entity removed", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, CallbackOnTimeout);
  const callback = vi.fn();
  CallbackOnTimeout.callback[entity] = callback;
  CallbackOnTimeout.callbackMs[entity] = 100;
  ctx.currentMs = 100;

  system.tick(ctx);

  expect(callback).toHaveBeenCalledWith(ctx, entity);
  expect(entityExists(ctx.world, entity)).toBe(false);
});
