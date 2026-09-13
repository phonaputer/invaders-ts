export default class AssetRegistry {
  private readonly imagesByID = new Map<string, HTMLImageElement>();
  private imagePromises: Promise<HTMLImageElement>[] = [];

  loadImage(id: string, src: string): void {
    const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.addEventListener("load", () => {
        this.imagesByID.set(id, img);
        resolve(img);
      });
      img.addEventListener("error", () => {
        reject(`Failed to load image id:"${id}, src:"${src}"`);
      });
    });

    this.imagePromises.push(imagePromise);
  }

  getImage(id: string): HTMLImageElement | undefined {
    return this.imagesByID.get(id);
  }

  async waitUntilAllAssetsAreLoaded(): Promise<void> {
    await Promise.all(this.imagePromises);
  }
}
