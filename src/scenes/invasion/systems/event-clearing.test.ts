import type { RenderCtx } from "@src/framework/render-system";
import type { TickCtx } from "@src/framework/tick-system";
import Damage from "@src/scenes/invasion/components/damage";
import PlayerAttack from "@src/scenes/invasion/components/player-attack";
import Position from "@src/scenes/invasion/components/position";
import EventClearingSystem from "@src/scenes/invasion/systems/event-clearing";
import { addComponent, addEntity, createWorld, entityExists, hasComponent, type ComponentRef } from "bitecs";
import { expect, test, vi } from "vitest";

interface EventClearingSystemTestSetup {
  tickCtx: TickCtx;
  renderCtx: RenderCtx;
  system: EventClearingSystem;
}

const setupTest = (
  tickEvents: Array<ComponentRef>,
  renderEvents: Array<ComponentRef>,
): EventClearingSystemTestSetup => {
  const world = createWorld();

  return {
    tickCtx: {
      currentMs: 0,
      deltaMs: 1,
      sceneSetter: {
        setScene: vi.fn(),
      },
      userInput: {
        initiated: vi.fn(),
        held: vi.fn(),
      },
      world: world,
    },
    renderCtx: {
      assetGetter: {
        getImage: vi.fn(),
        getAudio: vi.fn(),
      },
      renderer: {
        drawImage: vi.fn(),
        drawLine: vi.fn(),
        clearAll: vi.fn(),
      },
      world: world,
    },
    system: new EventClearingSystem({ tickEvents, renderEvents }),
  };
};

test("entity does not have any of the cleared components, entity is not deleted", () => {
  const { tickCtx, renderCtx, system } = setupTest([Damage], [PlayerAttack]);

  const entity = addEntity(tickCtx.world);
  addComponent(tickCtx.world, entity, Position);

  system.tick(tickCtx);
  system.render(renderCtx);

  expect(entityExists(tickCtx.world, entity)).toBe(true);
  expect(hasComponent(tickCtx.world, entity, Position)).toBe(true);
});

test("entity does have render cleared component, entity is deleted only after render", () => {
  const { tickCtx, renderCtx, system } = setupTest([Damage], [PlayerAttack]);

  const entity = addEntity(tickCtx.world);
  addComponent(tickCtx.world, entity, PlayerAttack);

  system.tick(tickCtx);

  expect(entityExists(tickCtx.world, entity)).toBe(true);
  expect(hasComponent(tickCtx.world, entity, PlayerAttack)).toBe(true);

  system.render(renderCtx);

  expect(entityExists(tickCtx.world, entity)).toBe(false);
});

test("entity does have tick cleared component, entity is deleted only after tick", () => {
  const { tickCtx, renderCtx, system } = setupTest([Damage], [PlayerAttack]);

  const entity = addEntity(tickCtx.world);
  addComponent(tickCtx.world, entity, Damage);

  system.render(renderCtx);

  expect(entityExists(tickCtx.world, entity)).toBe(true);
  expect(hasComponent(tickCtx.world, entity, Damage)).toBe(true);

  system.tick(tickCtx);

  expect(entityExists(tickCtx.world, entity)).toBe(false);
});
