import type Scene from "@src/framework/scene";

export default interface SceneSetter {
  setScene: (scene: Scene) => void;
}
