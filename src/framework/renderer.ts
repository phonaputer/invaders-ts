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

  clearRect: (x: number, y: number, w: number, h: number) => void;
}
