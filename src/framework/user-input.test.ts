// @vitest-environment happy-dom

import { BrowserInputWatcher, Input } from "@src/framework/user-input";
import { describe, expect, onTestFinished, test } from "vitest";

const setup = (): BrowserInputWatcher => {
  const watcher = new BrowserInputWatcher();
  onTestFinished(() => watcher.close());

  return watcher;
};

describe("initiated", () => {
  test("key is not pressed, returns false", () => {
    const watcher = setup();

    expect(watcher.initiated(Input.Left)).toBe(false);
  });

  test("key was pressed this frame, returns true", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    watcher.recordInput();

    expect(watcher.initiated(Input.Left)).toBe(true);
  });

  test("key was pressed last frame, returns false", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    watcher.recordInput();
    watcher.recordInput();

    expect(watcher.initiated(Input.Left)).toBe(false);
  });

  test("unwatched key is pressed, ignored", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "z" }));
    watcher.recordInput();
    expect(watcher.held(Input.Left)).toBe(false);

    globalThis.dispatchEvent(new KeyboardEvent("keyup", { key: "z" }));
    watcher.recordInput();
    expect(watcher.held(Input.Left)).toBe(false);
  });
});

describe("held", () => {
  test("key is not pressed, returns false", () => {
    const watcher = setup();

    expect(watcher.held(Input.Left)).toBe(false);
  });

  test("key was pressed this frame, returns true", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    watcher.recordInput();

    expect(watcher.held(Input.Left)).toBe(true);
  });

  test("key was pressed in a previous frame but has not yet been unpressed, returns true", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    watcher.recordInput();
    watcher.recordInput();

    expect(watcher.held(Input.Left)).toBe(true);
  });

  test("key was pressed then unpressed, returns false", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    watcher.recordInput();
    watcher.recordInput();
    watcher.recordInput();
    expect(watcher.held(Input.Left)).toBe(true);

    globalThis.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
    watcher.recordInput();
    expect(watcher.held(Input.Left)).toBe(false);
  });

  test("unwatched key is pressed, ignored", () => {
    const watcher = setup();

    globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "z" }));
    watcher.recordInput();
    expect(watcher.held(Input.Left)).toBe(false);

    globalThis.dispatchEvent(new KeyboardEvent("keyup", { key: "z" }));
    watcher.recordInput();
    expect(watcher.held(Input.Left)).toBe(false);
  });
});
