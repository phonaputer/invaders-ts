import type { TickCtx } from "@src/framework/tick-system";
import DeletionCallback from "@src/scenes/invasion/components/deletion-callback";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import TTL from "@src/scenes/invasion/components/ttl";
import DeletionSystem from "@src/scenes/invasion/systems/deletion";
import { addComponent, addEntity, createWorld, entityExists } from "bitecs";
import { expect, test, vi } from "vitest";

interface DeletionSystemTestSetup {
  ctx: TickCtx;
  system: DeletionSystem;
}

const setupTest = (): DeletionSystemTestSetup => ({
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
  system: new DeletionSystem(),
});

test("entity has ToBeDeleted tag, it is deleted from the world", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, ToBeDeleted);

  system.tick(ctx);

  expect(entityExists(ctx.world, entity)).toBe(false);
});

test("entity does NOT have ToBeDeleted tag, it is NOT deleted", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);

  system.tick(ctx);

  expect(entityExists(ctx.world, entity)).toBe(true);
});

test("entity has reached TTL, it is deleted from the world", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = 100;
  ctx.currentMs = 100;

  system.tick(ctx);

  expect(entityExists(ctx.world, entity)).toBe(false);
});

test("entity has exceeded TTL, it is deleted from the world", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = 100;
  ctx.currentMs = 101;

  system.tick(ctx);

  expect(entityExists(ctx.world, entity)).toBe(false);
});

test("entity has not yet reached TTL, it is NOT deleted", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = 100;
  ctx.currentMs = 99;

  system.tick(ctx);

  expect(entityExists(ctx.world, entity)).toBe(true);
});

test("entity with callback has ToBeDeleted tag, callback is invoked", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, DeletionCallback);
  const callback = vi.fn();
  DeletionCallback.callback[entity] = callback;

  addComponent(ctx.world, entity, ToBeDeleted);

  system.tick(ctx);

  expect(callback).toHaveBeenCalledWith(ctx, entity);
});

test("entity with callback does NOT have ToBeDeleted tag, callback NOT invoked", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, DeletionCallback);
  const callback = vi.fn();
  DeletionCallback.callback[entity] = callback;

  system.tick(ctx);

  expect(callback).not.toHaveBeenCalled();
});

test("entity with callback has reached its TTL, callback is invoked", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, DeletionCallback);
  const callback = vi.fn();
  DeletionCallback.callback[entity] = callback;

  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = 100;
  ctx.currentMs = 100;

  system.tick(ctx);

  expect(callback).toHaveBeenCalledWith(ctx, entity);
});

test("entity with callback has NOT reached its TTL, callback NOT invoked", () => {
  const { ctx, system } = setupTest();
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, DeletionCallback);
  const callback = vi.fn();
  DeletionCallback.callback[entity] = callback;

  addComponent(ctx.world, entity, TTL);
  TTL.expirationMs[entity] = 100;
  ctx.currentMs = 99;

  system.tick(ctx);

  expect(callback).not.toHaveBeenCalled();
});
