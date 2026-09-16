import DefaultEventLog from "@src/framework/default-event-log";
import type { TickCtx } from "@src/framework/tick-system";
import Damage from "@src/scenes/invasion/components/damage";
import DamageCallback from "@src/scenes/invasion/components/damage-callback";
import Hitpoints from "@src/scenes/invasion/components/hitpoints";
import ToBeDeleted from "@src/scenes/invasion/components/to-be-deleted";
import DamageType from "@src/scenes/invasion/damage-type";
import { type default as Collision, COLLISION_EVENT_TYPE } from "@src/scenes/invasion/events/collision";
import DamageSystem from "@src/scenes/invasion/systems/damage";
import { addComponent, addEntity, createWorld, hasComponent } from "bitecs";
import { expect, test, vi } from "vitest";

interface DamageSystemTestSetup {
  ctx: TickCtx;
  system: DamageSystem;
}

const setupTest = (): DamageSystemTestSetup => ({
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
  system: new DamageSystem(),
});

test("entity does not have Damage component, collision skipped with no error", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);

  const other = addEntity(ctx.world);
  addComponent(ctx.world, other, Hitpoints);
  Hitpoints.current[other] = 10;
  Hitpoints.susceptibleToDamageType[other] = DamageType.Alien | DamageType.AlienProjectile;

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);

  expect(Hitpoints.current[other]).toBe(10);
});

test("other does not have Hitpoints component, collision skipped with no error", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Damage);
  Damage.amount[entity] = 3;
  Damage.type[entity] = DamageType.Alien;

  const other = addEntity(ctx.world);

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);
});

test("other not susceptible to damage type of entity, other takes no damage", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Damage);
  Damage.amount[entity] = 3;
  Damage.type[entity] = DamageType.Player | DamageType.PlayerProjectile;

  const other = addEntity(ctx.world);
  addComponent(ctx.world, other, Hitpoints);
  Hitpoints.current[other] = 10;
  Hitpoints.susceptibleToDamageType[other] = DamageType.Alien | DamageType.AlienProjectile;

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);

  expect(Hitpoints.current[other]).toBe(10);
});

test("other susceptible to damage type of entity, other takes damage", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Damage);
  Damage.amount[entity] = 3;
  Damage.type[entity] = DamageType.Alien;

  const other = addEntity(ctx.world);
  addComponent(ctx.world, other, Hitpoints);
  Hitpoints.current[other] = 10;
  Hitpoints.susceptibleToDamageType[other] = DamageType.Alien | DamageType.AlienProjectile;

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);

  expect(Hitpoints.current[other]).toBe(7);
});

test("other takes damage reducing it to 0 hitpoints, other marked as deleted", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Damage);
  Damage.amount[entity] = 10;
  Damage.type[entity] = DamageType.Alien;

  const other = addEntity(ctx.world);
  addComponent(ctx.world, other, Hitpoints);
  Hitpoints.current[other] = 10;
  Hitpoints.susceptibleToDamageType[other] = DamageType.Alien | DamageType.AlienProjectile;

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);

  expect(Hitpoints.current[other]).toBe(0);
  expect(hasComponent(ctx.world, other, ToBeDeleted)).toBe(true);
});

test("other takes damage reducing it to negative hitpoints, other marked as deleted", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Damage);
  Damage.amount[entity] = 11;
  Damage.type[entity] = DamageType.Alien;

  const other = addEntity(ctx.world);
  addComponent(ctx.world, other, Hitpoints);
  Hitpoints.current[other] = 10;
  Hitpoints.susceptibleToDamageType[other] = DamageType.Alien | DamageType.AlienProjectile;

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);

  expect(Hitpoints.current[other]).toBe(-1);
  expect(hasComponent(ctx.world, other, ToBeDeleted)).toBe(true);
});

test("other takes damage and has DamageCallback, callback is invoked", () => {
  const { ctx, system } = setupTest();

  const entity = addEntity(ctx.world);
  addComponent(ctx.world, entity, Damage);
  Damage.amount[entity] = 1;
  Damage.type[entity] = DamageType.Alien;

  const other = addEntity(ctx.world);
  addComponent(ctx.world, other, Hitpoints);
  Hitpoints.current[other] = 10;
  Hitpoints.susceptibleToDamageType[other] = DamageType.Alien | DamageType.AlienProjectile;
  addComponent(ctx.world, other, DamageCallback);
  const callbackFn = vi.fn();
  DamageCallback.callback[other] = callbackFn;

  const collision: Collision = { entity, other };
  ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, collision);

  system.tick(ctx);

  expect(callbackFn).toHaveBeenCalledWith(ctx, other);
});
