import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import { default as newBaseInvader, type NewInvaderArgs } from "@src/scenes/invasion/entities/invader-base";
import { addComponent } from "bitecs";

const newTadpole = (args: NewInvaderArgs): void => {
  const entity = newBaseInvader({
    ctx: args.ctx,
    x: args.x,
    y: args.y,
    strip: [
      { x: 4, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ],
    score: 10,
  });

  addComponent(args.ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 4;
  CollisionPassive.hitboxOffsetY[entity] = 2;
  CollisionPassive.hitboxW[entity] = 5;
  CollisionPassive.hitboxH[entity] = 9;
};

export default newTadpole;
