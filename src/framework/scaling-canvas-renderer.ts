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

  clearRect(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x, y, w, h);
  }
}
