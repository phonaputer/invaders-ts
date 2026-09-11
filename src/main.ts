import "@src/style.css";

import { Game } from "@src/framework/game";
import initializeStartScreenScene from "@src/scenes/start-screen/start-screen-scene";

window.addEventListener("load", () => {
  const game = new Game();
  game.setScene(initializeStartScreenScene);
  game.run("game-canvas");
});
