export default interface AssetLoader {
  loadImage: (id: string, src: string) => void;
}
