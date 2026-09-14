import { GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import DefaultEventLog from "@src/framework/default-event-log";
import type { TickCtx } from "@src/framework/tick-system";
import Position from "@src/scenes/invasion/components/position";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import Velocity from "@src/scenes/invasion/components/velocity";
import VelocitySystem from "@src/scenes/invasion/systems/velocity";
import { addComponent, addEntity, createWorld, hasComponent, type EntityId } from "bitecs";
import { expect, test, vi } from "vitest";

interface VelocitySystemTestSetup {
  ctx: TickCtx;
  system: VelocitySystem;
}

const setupTest = (): VelocitySystemTestSetup => ({
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
  system: new VelocitySystem(),
});

interface PositionArg {
  x: number;
  y: number;
  w: number;
  h: number;
}

const setPosition = (ctx: TickCtx, entity: EntityId, position: PositionArg) => {
  addComponent(ctx.world, entity, Position);
  Position.x[entity] = position.x;
  Position.y[entity] = position.y;
  Position.w[entity] = position.w;
  Position.h[entity] = position.h;
};

const expectPosition = (entity: EntityId, position: PositionArg) => {
  expect(Position.x[entity]).toBe(position.x);
  expect(Position.y[entity]).toBe(position.y);
  expect(Position.w[entity]).toBe(position.w);
  expect(Position.h[entity]).toBe(position.h);
};

interface VelocityArg {
  x: number;
  y: number;
}

const setVelocity = (ctx: TickCtx, entity: EntityId, velocity: VelocityArg) => {
  addComponent(ctx.world, entity, Velocity);
  Velocity.x[entity] = velocity.x;
  Velocity.y[entity] = velocity.y;
};

test("positive velocity, entities move 'forward'", () => {
  const { ctx, system } = setupTest();
  const entityOne = addEntity(ctx.world);
  setPosition(ctx, entityOne, { x: 1, y: 1, w: 1, h: 1 });
  setVelocity(ctx, entityOne, { x: 2, y: 1 });
  const entityTwo = addEntity(ctx.world);
  setPosition(ctx, entityTwo, { x: 1, y: 1, w: 1, h: 1 });
  setVelocity(ctx, entityTwo, { x: 100, y: 50 });

  system.tick(ctx);

  expectPosition(entityOne, { x: 3, y: 2, w: 1, h: 1 });
  expectPosition(entityTwo, { x: 101, y: 51, w: 1, h: 1 });
});

test("negative velocity, entities move 'back'", () => {
  const { ctx, system } = setupTest();
  const entityOne = addEntity(ctx.world);
  setPosition(ctx, entityOne, { x: 200, y: 200, w: 1, h: 1 });
  setVelocity(ctx, entityOne, { x: -2, y: -1 });
  const entityTwo = addEntity(ctx.world);
  setPosition(ctx, entityTwo, { x: 200, y: 200, w: 1, h: 1 });
  setVelocity(ctx, entityTwo, { x: -100, y: -50 });

  system.tick(ctx);

  expectPosition(entityOne, { x: 198, y: 199, w: 1, h: 1 });
  expectPosition(entityTwo, { x: 100, y: 150, w: 1, h: 1 });
});

test("entity moves off top of screen, deletion tag added", () => {
  const { ctx, system } = setupTest();
  const height = 1;
  const entityOne = addEntity(ctx.world);
  setPosition(ctx, entityOne, { x: 5, y: 0, w: 1, h: 1 });
  setVelocity(ctx, entityOne, { x: 0, y: -6 - height });

  system.tick(ctx);

  expectPosition(entityOne, { x: 5, y: -6 - height, w: 1, h: 1 });
  expect(hasComponent(ctx.world, entityOne, ToBeDeleted)).toBe(true);
});

test("entity moves off bottom of screen, deletion tag added", () => {
  const { ctx, system } = setupTest();
  const entityOne = addEntity(ctx.world);
  setPosition(ctx, entityOne, { x: 5, y: GAME_HEIGHT, w: 1, h: 1 });
  setVelocity(ctx, entityOne, { x: 0, y: 6 });

  system.tick(ctx);

  expectPosition(entityOne, { x: 5, y: GAME_HEIGHT + 6, w: 1, h: 1 });
  expect(hasComponent(ctx.world, entityOne, ToBeDeleted)).toBe(true);
});

test("entity moves off left of screen, deletion tag added", () => {
  const { ctx, system } = setupTest();
  const width = 1;
  const entityOne = addEntity(ctx.world);
  setPosition(ctx, entityOne, { x: 0, y: 5, w: 1, h: 1 });
  setVelocity(ctx, entityOne, { x: -6 - width, y: 0 });

  system.tick(ctx);

  expectPosition(entityOne, { x: -6 - width, y: 5, w: 1, h: 1 });
  expect(hasComponent(ctx.world, entityOne, ToBeDeleted)).toBe(true);
});

test("entity moves off bottom of screen, deletion tag added", () => {
  const { ctx, system } = setupTest();
  const entityOne = addEntity(ctx.world);
  setPosition(ctx, entityOne, { x: GAME_WIDTH, y: 5, w: 1, h: 1 });
  setVelocity(ctx, entityOne, { x: 6, y: 0 });

  system.tick(ctx);

  expectPosition(entityOne, { x: GAME_WIDTH + 6, y: 5, w: 1, h: 1 });
  expect(hasComponent(ctx.world, entityOne, ToBeDeleted)).toBe(true);
});
