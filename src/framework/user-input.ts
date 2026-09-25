export enum Input {
  Left,
  Right,
  Fire,
}

export interface UserInput {
  initiated: (input: Input) => boolean;
  held: (input: Input) => boolean;
}

export class BrowserInputWatcher {
  private readonly abortController = new AbortController();

  private readonly browserKeysToInputs: Record<string, Input> = {
    a: Input.Left,
    d: Input.Right,
    " ": Input.Fire,
  };

  private previousTickSnapshot: Set<Input>;
  private currentlyPressedKeys: Set<Input>;

  private heldInputs: Set<Input>;
  private initiatedInputs: Set<Input>;

  constructor() {
    this.heldInputs = new Set();
    this.initiatedInputs = new Set();

    this.currentlyPressedKeys = new Set();
    this.previousTickSnapshot = new Set();

    globalThis.addEventListener(
      "keydown",
      (e) => {
        const input = this.browserKeysToInputs[e.key];
        if (input !== undefined) {
          this.currentlyPressedKeys.add(input);
          e.preventDefault();
        }
      },
      { signal: this.abortController.signal },
    );

    globalThis.addEventListener(
      "keyup",
      (e) => {
        const input = this.browserKeysToInputs[e.key];
        if (input !== undefined) {
          this.currentlyPressedKeys.delete(input);
        }
      },
      { signal: this.abortController.signal },
    );
  }

  recordInput() {
    this.heldInputs = this.currentlyPressedKeys;
    this.initiatedInputs = new Set();

    for (const key of this.currentlyPressedKeys) {
      if (!this.previousTickSnapshot.has(key)) {
        this.initiatedInputs.add(key);
      }
    }

    this.previousTickSnapshot = new Set(this.currentlyPressedKeys);
  }

  initiated(input: Input): boolean {
    return this.initiatedInputs.has(input);
  }

  held(input: Input): boolean {
    return this.heldInputs.has(input);
  }

  close() {
    this.abortController.abort();
  }
}
