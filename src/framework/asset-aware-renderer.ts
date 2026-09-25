import type AssetGetter from "@src/framework/asset-getter";

export interface AssetUnawareRenderer {
  drawImage: (
    image: HTMLImageElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) => void;

  drawLine: (startX: number, startY: number, endX: number, endY: number, color: string, widthPx: number) => void;

  drawRect: (x: number, y: number, w: number, h: number, color: string, widthPx: number) => void;

  clearAll: () => void;
}

export default class AssetAwareRenderer {
  private readonly renderer: AssetUnawareRenderer;
  private readonly assetGetter: AssetGetter;

  constructor(renderer: AssetUnawareRenderer, assetGetter: AssetGetter) {
    this.renderer = renderer;
    this.assetGetter = assetGetter;
  }

  drawImage(
    imageID: string,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) {
    const image = this.assetGetter.getImage(imageID);
    if (image !== undefined) {
      this.renderer.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  drawLine(startX: number, startY: number, endX: number, endY: number, color: string, widthPx: number): void {
    this.renderer.drawLine(startX, startY, endX, endY, color, widthPx);
  }

  drawRect(x: number, y: number, w: number, h: number, color: string, widthPx: number): void {
    this.renderer.drawRect(x, y, w, h, color, widthPx);
  }

  clearAll() {
    this.renderer.clearAll();
  }
}
