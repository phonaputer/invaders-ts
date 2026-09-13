import { GAME_HEIGHT, GAME_WIDTH } from "@src/framework/constants";
import type { TickCtx } from "@src/framework/tick-system";
import CollisionActive from "@src/scenes/invasion/components/collision-active";
import CollisionPassive from "@src/scenes/invasion/components/collision-passive";
import Position from "@src/scenes/invasion/components/position";
import type Collision from "@src/scenes/invasion/events/collision";
import { COLLISION_EVENT_TYPE } from "@src/scenes/invasion/events/collision";
import { query, type EntityId } from "bitecs";

const BUCKET_WIDTH = 15;
const BUCKET_HEIGHT = 15;

interface Hitbox {
  entity: EntityId;
  x: number;
  y: number;
  w: number;
  h: number;
  passive: boolean;
}

interface Bucket {
  x: number;
  y: number;
}

export default class CollisionDetectionSystem {
  private readonly bucketsToCheck = new Map<string, Bucket>();
  private readonly hitboxBuckets = [] as Hitbox[][][];

  constructor() {
    for (let x = 0; x < GAME_WIDTH; x += BUCKET_WIDTH) {
      const xBucket: Hitbox[][] = [];

      for (let y = 0; y < GAME_HEIGHT; y += BUCKET_HEIGHT) {
        xBucket.push([] as Hitbox[]);
      }

      this.hitboxBuckets.push(xBucket);
    }
  }

  tick(ctx: TickCtx): void {
    this.clearBuckets();
    this.fillBuckets(ctx);

    for (const bucket of this.bucketsToCheck.values()) {
      this.checkCollisions(ctx, this.hitboxBuckets[bucket.x]![bucket.y]!);
    }
  }

  fillBuckets(ctx: TickCtx) {
    for (const entity of query(ctx.world, [CollisionActive, Position])) {
      const hitbox: Hitbox = {
        entity,
        x: Position.x[entity]! + CollisionActive.hitboxOffsetX[entity]!,
        y: Position.y[entity]! + CollisionActive.hitboxOffsetY[entity]!,
        w: CollisionActive.hitboxW[entity]!,
        h: CollisionActive.hitboxH[entity]!,
        passive: false,
      };

      const { x: minX, y: minY } = this.findBucketForPoint(hitbox.x, hitbox.y);
      const { x: maxX, y: maxY } = this.findBucketForPoint(hitbox.x + hitbox.w, hitbox.y + hitbox.h);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          this.addToBucket(hitbox, x, y);
          this.bucketsToCheck.set(this.bucketKey(x, y), { x, y });
        }
      }
    }

    for (const entity of query(ctx.world, [CollisionPassive, Position])) {
      const hitbox: Hitbox = {
        entity,
        x: Position.x[entity]! + CollisionPassive.hitboxOffsetX[entity]!,
        y: Position.y[entity]! + CollisionPassive.hitboxOffsetY[entity]!,
        w: CollisionPassive.hitboxW[entity]!,
        h: CollisionPassive.hitboxH[entity]!,
        passive: true,
      };

      const { x: minX, y: minY } = this.findBucketForPoint(hitbox.x, hitbox.y);
      const { x: maxX, y: maxY } = this.findBucketForPoint(hitbox.x + hitbox.w, hitbox.y + hitbox.h);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          this.addToBucket(hitbox, x, y);
        }
      }
    }
  }

  findBucketForPoint(x: number, y: number): Bucket {
    return {
      x: Math.trunc(x / BUCKET_WIDTH),
      y: Math.trunc(y / BUCKET_HEIGHT),
    };
  }

  bucketKey(x: number, y: number): string {
    return `${x}:${y}`;
  }

  addToBucket(hitbox: Hitbox, x: number, y: number): void {
    this.hitboxBuckets[x]![y]!.push(hitbox);
  }

  clearBuckets() {
    for (const yBucket of this.hitboxBuckets) {
      for (const cellBucket of yBucket) {
        cellBucket.length = 0;
      }
    }

    this.bucketsToCheck.clear();
  }

  checkCollisions(ctx: TickCtx, hitboxes: Hitbox[]): void {
    for (let l = 0; l < hitboxes.length; l++) {
      const left = hitboxes[l]!;

      for (let r = l + 1; r < hitboxes.length; r++) {
        const right = hitboxes[r]!;

        if (this.areTouching(left, right)) {
          this.logCollision(ctx, left.entity, right.entity);
        }
      }
    }
  }

  logCollision(ctx: TickCtx, left: EntityId, right: EntityId): void {
    const rightEvent: Collision = {
      entity: right,
      other: left,
    };
    const leftEvent: Collision = {
      entity: left,
      other: right,
    };

    ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, rightEvent);
    ctx.eventLog.pushTick(COLLISION_EVENT_TYPE, leftEvent);
  }

  areTouching(left: Hitbox, right: Hitbox): boolean {
    if (right.passive && left.passive) {
      return false;
    }

    // "left" above "right"
    if (left.y + left.h < right.y) {
      return false;
    }

    // "left" below "right"
    if (left.y > right.y + right.h) {
      return false;
    }

    // "left" left of "right"
    if (left.x + left.w < right.x) {
      return false;
    }

    // "left" right of "right"
    if (left.x > right.x + right.w) {
      return false;
    }

    return true;
  }
}
