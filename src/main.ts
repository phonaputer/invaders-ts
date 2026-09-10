import "./style.css";

window.addEventListener("load", () => {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  ctx = canvas.getContext("2d")!;

  requestAnimationFrame(animate);
});

const CANVAS_WIDTH = 448;
const CANVAS_HEIGHT = 567;

var ctx: CanvasRenderingContext2D;
var previousTimestampMs: number = 0;
var unprocessedMs: number = 0;
var msPerTick: number = 1000 / 60;

const SQUARE_WH: number = 75;
const SQUARE_X: number = CANVAS_WIDTH / 2 - SQUARE_WH / 2;
var squareY: number = 10;
const BASE_Y_SPEED: number = 1;
var direction: number = 1;
var ySpeed: number = 1;

function animate(timestampMs: number) {
  const elapsedMs = timestampMs - previousTimestampMs;
  previousTimestampMs = timestampMs;
  unprocessedMs += elapsedMs;

  while (unprocessedMs >= msPerTick) {
    unprocessedMs -= msPerTick;

    let newY = squareY + ySpeed * direction;
    if (newY + SQUARE_WH > CANVAS_HEIGHT || newY < 0) {
      direction = -direction;
      ySpeed = BASE_Y_SPEED;
    } else {
      squareY = newY;
      ySpeed += 0.3;
    }
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.fillRect(SQUARE_X, squareY, SQUARE_WH, SQUARE_WH);

  requestAnimationFrame(animate);
}
