import "@src/style.css";

import { Game } from "@src/framework/game";
import { initializeTestScene } from "@src/scenes/test-scene";

window.addEventListener("load", () => {
  const game = new Game();
  game.setScene(initializeTestScene);
  game.run("game-canvas");
});
