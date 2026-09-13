import type EventLog from "@src/framework/event-log";
import type SceneSetter from "@src/framework/scene-setter";
import { type UserInput } from "@src/framework/user-input";
import { type World } from "bitecs";

export interface TickCtx {
  currentMs: number;
  deltaMs: number;
  eventLog: EventLog;
  sceneSetter: SceneSetter;
  userInput: UserInput;
  world: World;
}

export interface TickSystem {
  tick: (ctx: TickCtx) => void;
}
