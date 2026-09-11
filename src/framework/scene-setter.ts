import type { SceneInitializationCallback } from "@src/framework/scene";

export default interface SceneSetter {
  setScene: (initializeScene: SceneInitializationCallback) => void;
}
