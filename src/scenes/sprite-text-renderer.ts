import { GAME_WIDTH } from "@src/framework/constants";
import type Renderer from "@src/framework/renderer";

interface Frame {
  x: number;
  y: number;
}

const CHARACTERS_TO_FRAMES: Record<string, Frame> = {
  "1": { x: 0, y: 10 },
  "2": { x: 1, y: 10 },
  "3": { x: 2, y: 10 },
  "4": { x: 3, y: 10 },
  "5": { x: 4, y: 10 },
  "6": { x: 5, y: 10 },
  "7": { x: 6, y: 10 },
  "8": { x: 7, y: 10 },
  "9": { x: 8, y: 10 },
  "0": { x: 9, y: 10 },
  a: { x: 0, y: 11 },
  b: { x: 1, y: 11 },
  c: { x: 2, y: 11 },
  d: { x: 3, y: 11 },
  e: { x: 4, y: 11 },
  f: { x: 5, y: 11 },
  g: { x: 6, y: 11 },
  h: { x: 7, y: 11 },
  i: { x: 8, y: 11 },
  j: { x: 9, y: 11 },
  k: { x: 10, y: 11 },
  l: { x: 11, y: 11 },
  m: { x: 0, y: 12 },
  n: { x: 1, y: 12 },
  o: { x: 2, y: 12 },
  p: { x: 3, y: 12 },
  q: { x: 4, y: 12 },
  r: { x: 5, y: 12 },
  s: { x: 6, y: 12 },
  t: { x: 7, y: 12 },
  u: { x: 8, y: 12 },
  v: { x: 9, y: 12 },
  w: { x: 10, y: 12 },
  x: { x: 11, y: 12 },
  y: { x: 12, y: 12 },
  z: { x: 13, y: 12 },
  "-": { x: 14, y: 12 },
  ":": { x: 15, y: 12 },
  "<": { x: 15, y: 10 },
  ">": { x: 15, y: 11 },
  "?": { x: 15, y: 9 },
};

const CHARACTER_SRC_WIDTH = 8;
const CHARACTER_SRC_HEIGHT = 8;

const CHARACTER_DRAW_WIDTH = 8;
const CHARACTER_DRAW_HEIGHT = 8;

const CHARACTER_X_SPACING = 6;

export default class SpriteTextRenderer {
  private readonly spriteSheet: HTMLImageElement;

  constructor(spriteSheet: HTMLImageElement) {
    this.spriteSheet = spriteSheet;
  }

  renderText(renderer: Renderer, x: number, y: number, text: string) {
    let curX = x;

    for (const char of text.toLowerCase()) {
      const frame = CHARACTERS_TO_FRAMES[char];

      if (frame) {
        renderer.drawImage(
          this.spriteSheet,
          CHARACTER_SRC_WIDTH * frame.x,
          CHARACTER_SRC_HEIGHT * frame.y,
          CHARACTER_SRC_WIDTH,
          CHARACTER_SRC_HEIGHT,
          curX,
          y,
          CHARACTER_DRAW_WIDTH,
          CHARACTER_DRAW_HEIGHT,
        );
      }

      curX += CHARACTER_X_SPACING;
    }
  }

  renderTextCentered(renderer: Renderer, y: number, text: string) {
    const textWidth = text.length * CHARACTER_X_SPACING;

    const startX = GAME_WIDTH * 0.5 - textWidth * 0.5;

    this.renderText(renderer, startX, y, text);
  }
}
