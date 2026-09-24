import type { TickCtx } from "@src/framework/tick-system";
import Position from "@src/scenes/invasion/components/position";
import PositionFollowing from "@src/scenes/invasion/components/position-following";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import PositionFollowingSystem from "@src/scenes/invasion/systems/position-following";
import { addComponent, addEntity, createWorld, hasComponent, removeEntity } from "bitecs";
import { expect, test, vi } from "vitest";

interface PositionFollowingTestSetup {
  ctx: TickCtx;
  system: PositionFollowingSystem;
}

const setupTest = (): PositionFollowingTestSetup => ({
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
  system: new PositionFollowingSystem(),
});

test("leader has moved, entity is moved to leader's position", () => {
  const { ctx, system } = setupTest();

  const leader = addEntity(ctx.world);
  addComponent(ctx.world, leader, Position);
  Position.x[leader] = 5;
  Position.y[leader] = 6;

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Position);
  Position.x[entity] = 0;
  Position.y[entity] = 1;
  addComponent(ctx.world, entity, PositionFollowing);
  PositionFollowing.leader[entity] = leader;
  PositionFollowing.xOffset[entity] = 10;
  PositionFollowing.yOffset[entity] = -2;

  system.tick(ctx);

  expect(Position.x[entity]).toBe(15);
  expect(Position.y[entity]).toBe(4);
});

test("leader does not have position, entity is marked for deletion", () => {
  const { ctx, system } = setupTest();

  const leader = addEntity(ctx.world);

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Position);
  Position.x[entity] = 0;
  Position.y[entity] = 1;
  addComponent(ctx.world, entity, PositionFollowing);
  PositionFollowing.leader[entity] = leader;
  PositionFollowing.xOffset[entity] = 10;
  PositionFollowing.yOffset[entity] = -2;

  system.tick(ctx);

  expect(Position.x[entity]).toBe(0);
  expect(Position.y[entity]).toBe(1);
  expect(hasComponent(ctx.world, entity, ToBeDeleted)).toBe(true);
});

test("leader does not exist, entity is marked for deletion", () => {
  const { ctx, system } = setupTest();

  const leader = addEntity(ctx.world);
  addComponent(ctx.world, leader, Position);
  Position.x[leader] = 5;
  Position.y[leader] = 6;

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Position);
  Position.x[entity] = 0;
  Position.y[entity] = 1;
  addComponent(ctx.world, entity, PositionFollowing);
  PositionFollowing.leader[entity] = leader;
  PositionFollowing.xOffset[entity] = 10;
  PositionFollowing.yOffset[entity] = -2;

  removeEntity(ctx.world, leader);

  system.tick(ctx);

  expect(hasComponent(ctx.world, entity, ToBeDeleted)).toBe(true);
  expect(Position.x[entity]).toBe(0);
  expect(Position.y[entity]).toBe(1);
});
