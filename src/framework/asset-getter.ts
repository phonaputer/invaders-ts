export default interface AssetGetter {
  getImage: (id: string) => HTMLImageElement | undefined;
  getAudio: (id: string) => HTMLAudioElement | undefined;
}
