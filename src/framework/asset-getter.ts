export interface Audio {
  currentTime: number;
  play: () => Promise<void>;
  pause: () => void;
}

export default interface AssetGetter {
  getImage: (id: string) => HTMLImageElement | undefined;
  getAudio: (id: string) => Audio | undefined;
}
