import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import { default as newBaseInvader, type NewInvaderArgs } from "@src/scenes/invasion/entities/invader-base";
import { addComponent } from "bitecs";

const newOctopus = (args: NewInvaderArgs): void => {
  const entity = newBaseInvader({
    ctx: args.ctx,
    x: args.x,
    y: args.y,
    strip: [
      { x: 6, y: 0 },
      { x: 7, y: 0 },
    ],
  });

  addComponent(args.ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 0;
  CollisionPassive.hitboxOffsetY[entity] = 3;
  CollisionPassive.hitboxW[entity] = 14;
  CollisionPassive.hitboxH[entity] = 8;

  // TODO deletion callback
};

export default newOctopus;
