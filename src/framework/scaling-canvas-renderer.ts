import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@src/framework/constants";

export default class ScalingCanvasRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scaleFactorX: number;
  private readonly scaleFactorY: number;

  constructor(ctx: CanvasRenderingContext2D, scaleFactorX: number, scaleFactorY: number) {
    this.ctx = ctx;
    this.scaleFactorX = scaleFactorX;
    this.scaleFactorY = scaleFactorY;
  }

  drawImage(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) {
    this.ctx.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      this.scaleFactorX * dx,
      this.scaleFactorY * dy,
      this.scaleFactorX * dw,
      this.scaleFactorY * dh,
    );
  }

  drawLine(startX: number, startY: number, endX: number, endY: number, color: string, widthPx: number): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = widthPx;

    this.ctx.beginPath();
    this.ctx.moveTo(startX * this.scaleFactorX, startY * this.scaleFactorY);
    this.ctx.lineTo(endX * this.scaleFactorX, endY * this.scaleFactorY);
    this.ctx.stroke();
  }

  drawRect(x: number, y: number, w: number, h: number, color: string, widthPx: number): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = widthPx;

    this.ctx.strokeRect(x * this.scaleFactorX, y * this.scaleFactorY, w * this.scaleFactorX, h * this.scaleFactorY);
  }

  clearAll() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
