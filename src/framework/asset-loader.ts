export default interface AssetLoader {
  loadImage: (id: string, src: string) => void;
  loadAudio: (id: string, src: string) => void;
}
