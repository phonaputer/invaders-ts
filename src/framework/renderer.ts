export default interface Renderer {
  drawImage: (
    image: CanvasImageSource,
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

  clearAll: () => void;
}
