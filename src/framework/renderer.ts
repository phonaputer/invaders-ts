export default interface Renderer {
  drawImage: (
    imageID: string,
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
