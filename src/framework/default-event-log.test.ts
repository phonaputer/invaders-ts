import DefaultEventLog from "@src/framework/default-event-log";
import { expect, test } from "vitest";

interface TestEvent {
  num: number;
  text: string;
}

test("set tick events as same type, can retrieve them by that type", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushTick("type123", eventOne);
  log.pushTick("type123", eventTwo);
  log.pushTick("type123", eventThree);

  const results = log.getTick("type123");

  expect(results).toStrictEqual([eventOne, eventTwo, eventThree]);
});

test("set tick events as different types, can retrieve them by their types", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushTick("type1", eventOne);
  log.pushTick("type2", eventTwo);
  log.pushTick("type3", eventThree);

  expect(log.getTick("type1")).toStrictEqual([eventOne]);
  expect(log.getTick("type2")).toStrictEqual([eventTwo]);
  expect(log.getTick("type3")).toStrictEqual([eventThree]);
});

test("clear tick events, all tick events removed", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushTick("type1", eventOne);
  log.pushTick("type2", eventTwo);
  log.pushTick("type3", eventThree);

  log.clearTick();

  expect(log.getTick("type1")).toHaveLength(0);
  expect(log.getTick("type2")).toHaveLength(0);
  expect(log.getTick("type3")).toHaveLength(0);
});

test("clear tick events, render events not removed", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushRender("type1", eventOne);
  log.pushRender("type2", eventTwo);
  log.pushRender("type3", eventThree);

  log.clearTick();

  expect(log.getRender("type1")).toStrictEqual([eventOne]);
  expect(log.getRender("type2")).toStrictEqual([eventTwo]);
  expect(log.getRender("type3")).toStrictEqual([eventThree]);
});

test("set render events as same type, can retrieve them by that type", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushRender("type123", eventOne);
  log.pushRender("type123", eventTwo);
  log.pushRender("type123", eventThree);

  const results = log.getRender("type123");

  expect(results).toStrictEqual([eventOne, eventTwo, eventThree]);
});

test("set render events as different types, can retrieve them by their types", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushRender("type1", eventOne);
  log.pushRender("type2", eventTwo);
  log.pushRender("type3", eventThree);

  expect(log.getRender("type1")).toStrictEqual([eventOne]);
  expect(log.getRender("type2")).toStrictEqual([eventTwo]);
  expect(log.getRender("type3")).toStrictEqual([eventThree]);
});

test("clear render events, all render events removed", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushRender("type1", eventOne);
  log.pushRender("type2", eventTwo);
  log.pushRender("type3", eventThree);

  log.clearRender();

  expect(log.getRender("type1")).toHaveLength(0);
  expect(log.getRender("type2")).toHaveLength(0);
  expect(log.getRender("type3")).toHaveLength(0);
});

test("clear render events, tick events not removed", () => {
  const log = new DefaultEventLog();
  const eventOne: TestEvent = { num: 111, text: "one" };
  const eventTwo: TestEvent = { num: 222, text: "two" };
  const eventThree: TestEvent = { num: 333, text: "three" };

  log.pushTick("type1", eventOne);
  log.pushTick("type2", eventTwo);
  log.pushTick("type3", eventThree);

  log.clearRender();

  expect(log.getTick("type1")).toStrictEqual([eventOne]);
  expect(log.getTick("type2")).toStrictEqual([eventTwo]);
  expect(log.getTick("type3")).toStrictEqual([eventThree]);
});
