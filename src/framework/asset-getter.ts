export default interface AssetGetter {
  getImage: (id: string) => HTMLImageElement | undefined;
}
