import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import { default as newBaseInvader, type NewInvaderArgs } from "@src/scenes/invasion/entities/invader-base";
import { addComponent } from "bitecs";

const newJellyfish = (args: NewInvaderArgs): void => {
  const entity = newBaseInvader({
    ctx: args.ctx,
    x: args.x,
    y: args.y,
    strip: [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
  });

  addComponent(args.ctx.world, entity, CollisionPassive);
  CollisionPassive.hitboxOffsetX[entity] = 1;
  CollisionPassive.hitboxOffsetY[entity] = 3;
  CollisionPassive.hitboxW[entity] = 12;
  CollisionPassive.hitboxH[entity] = 8;
};

export default newJellyfish;
