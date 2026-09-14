import DefaultEventLog from "@src/framework/default-event-log";
import type { TickCtx } from "@src/framework/tick-system";
import CollisionActive from "@src/scenes/invasion/components/collision-active";
import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import Position from "@src/scenes/invasion/components/position";
import { COLLISION_EVENT_TYPE } from "@src/scenes/invasion/events/collision";
import CollisionDetectionSystem from "@src/scenes/invasion/systems/collision-detection";
import { addComponent, addEntity, createWorld, type EntityId } from "bitecs";
import { expect, test, vi } from "vitest";

interface CollisionDetectionSystemTestSetup {
  ctx: TickCtx;
  system: CollisionDetectionSystem;
}

const setupTest = (): CollisionDetectionSystemTestSetup => ({
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
  system: new CollisionDetectionSystem(),
});

interface Hitbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const createEntityWithHitbox = (ctx: TickCtx, hitbox: Hitbox, passive = false): EntityId => {
  const entity = addEntity(ctx.world);

  addComponent(ctx.world, entity, Position);
  Position.x[entity] = hitbox.x;
  Position.y[entity] = hitbox.y;
  Position.w[entity] = 10;
  Position.h[entity] = 10;

  if (passive) {
    addComponent(ctx.world, entity, CollisionPassive);
    CollisionPassive.hitboxOffsetX[entity] = 0;
    CollisionPassive.hitboxOffsetY[entity] = 0;
    CollisionPassive.hitboxW[entity] = hitbox.w;
    CollisionPassive.hitboxH[entity] = hitbox.h;
  } else {
    addComponent(ctx.world, entity, CollisionActive);
    CollisionActive.hitboxOffsetX[entity] = 0;
    CollisionActive.hitboxOffsetY[entity] = 0;
    CollisionActive.hitboxW[entity] = hitbox.w;
    CollisionActive.hitboxH[entity] = hitbox.h;
  }

  return entity;
};

const expectTotalHits = (ctx: TickCtx, expected: number) => {
  expect(ctx.eventLog.getTick(COLLISION_EVENT_TYPE).length).toBe(expected * 2);
};

const expectCollided = (ctx: TickCtx, left: EntityId, right: EntityId): void => {
  const collisions = ctx.eventLog.getTick(COLLISION_EVENT_TYPE);

  expect(collisions).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ entity: left, other: right }),
      expect.objectContaining({ entity: right, other: left }),
    ]),
  );
};

const expectDidNotCollide = (ctx: TickCtx, entity: EntityId): void => {
  const collisions = ctx.eventLog.getTick(COLLISION_EVENT_TYPE);

  expect(collisions).not.toEqual(expect.arrayContaining([expect.objectContaining({ entity })]));
  expect(collisions).not.toEqual(expect.arrayContaining([expect.objectContaining({ other: entity })]));
};

test("entities exactly overlap, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity within another, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 3, h: 3 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through other's bottom, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 2, y: 0, w: 1, h: 2 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 3, h: 3 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through other's top, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 2, y: 3, w: 1, h: 2 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 3, h: 3 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through other's left, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 0, y: 2, w: 2, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 3, h: 3 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through other's right, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 3, y: 2, w: 2, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 3, h: 3 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through big entity's bottom, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 50, y: 0, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 100, h: 100 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through big entity's top, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 50, y: 100, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 100, h: 100 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through big entity's left, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 0, y: 50, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 100, h: 100 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity through big entity's right, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 100, y: 50, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 100, h: 100 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entity below other, no collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 10, y: 10, w: 10, h: 10 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 15, y: 8, w: 1, h: 1 });

  system.tick(ctx);

  expectDidNotCollide(ctx, entityOne);
  expectDidNotCollide(ctx, entityTwo);
});

test("entity above other, no collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 10, y: 10, w: 10, h: 10 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 15, y: 21, w: 1, h: 1 });

  system.tick(ctx);

  expectDidNotCollide(ctx, entityOne);
  expectDidNotCollide(ctx, entityTwo);
});

test("entity left of other, no collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 10, y: 10, w: 10, h: 10 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 8, y: 15, w: 1, h: 1 });

  system.tick(ctx);

  expectDidNotCollide(ctx, entityOne);
  expectDidNotCollide(ctx, entityTwo);
});

test("entity right of other, no collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 10, y: 10, w: 10, h: 10 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 21, y: 15, w: 1, h: 1 });

  system.tick(ctx);

  expectDidNotCollide(ctx, entityOne);
  expectDidNotCollide(ctx, entityTwo);
});

test("entities touching at top-right corner, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 2, y: 2, w: 1, h: 1 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entities touching at bottom-right corner, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 2, y: 0, w: 1, h: 1 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entities touching at bottom-left corner, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 1, h: 1 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entities touching at top-left corner, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 0, y: 2, w: 1, h: 1 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("big entity touching multiple others across multiple buckets, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 20, h: 20 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 19, y: 19, w: 1, h: 1 });
  const entityThree = createEntityWithHitbox(ctx, { x: 0, y: 19, w: 1, h: 1 });
  const entityFour = createEntityWithHitbox(ctx, { x: 19, y: 0, w: 1, h: 1 });
  const entityFive = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 1, h: 1 });
  const entitySix = createEntityWithHitbox(ctx, { x: 10, y: 10, w: 1, h: 1 });

  system.tick(ctx);

  expectTotalHits(ctx, 5);
  expectCollided(ctx, entityOne, entityTwo);
  expectCollided(ctx, entityOne, entityThree);
  expectCollided(ctx, entityOne, entityFour);
  expectCollided(ctx, entityOne, entityFive);
  expectCollided(ctx, entityOne, entitySix);
});

test("entities touching at negative coordinates, should log collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: -10, y: -10, w: 5, h: 5 });
  const entityTwo = createEntityWithHitbox(ctx, { x: -9, y: -9, w: 1, h: 1 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entities collide in multiple buckets, should log only one collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 100, h: 100 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 0, y: 0, w: 100, h: 100 });

  system.tick(ctx);

  expectCollided(ctx, entityOne, entityTwo);
});

test("entities overlap but are both passive, no collision", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 }, true);
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 }, true);

  system.tick(ctx);

  expectDidNotCollide(ctx, entityOne);
  expectDidNotCollide(ctx, entityTwo);
});

test("multiple active and passive entities overlap, only overlaps involving an active entity logged", () => {
  const { ctx, system } = setupTest();
  const entityOne = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityTwo = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 });
  const entityThree = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 }, true);
  const entityFour = createEntityWithHitbox(ctx, { x: 1, y: 1, w: 1, h: 1 }, true);

  system.tick(ctx);

  expectTotalHits(ctx, 5);
  expectCollided(ctx, entityOne, entityTwo);
  expectCollided(ctx, entityOne, entityThree);
  expectCollided(ctx, entityOne, entityFour);
  expectCollided(ctx, entityTwo, entityThree);
  expectCollided(ctx, entityTwo, entityFour);
});
