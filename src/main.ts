import "@src/style.css";

import { Game } from "@src/framework/game";
import StartScreenScene from "@src/scenes/start-screen/start-screen-scene";

window.addEventListener("load", () => {
  const game = new Game();
  game.run("game-canvas", StartScreenScene);
});
