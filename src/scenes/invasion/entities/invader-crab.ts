import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import { default as newBaseInvader, type NewInvaderArgs } from "@src/scenes/invasion/entities/invader-base";
import { addComponent } from "bitecs";

const newCrab = (args: NewInvaderArgs): void => {
  const entity = newBaseInvader({
    ctx: args.ctx,
    x: args.x,
    y: args.y,
    strip: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    score: 20,
  });

  addComponent(args.ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 3;
  CollisionPassive.hitboxOffsetY[entity] = 4;
  CollisionPassive.hitboxW[entity] = 10;
  CollisionPassive.hitboxH[entity] = 7;
};

export default newCrab;
