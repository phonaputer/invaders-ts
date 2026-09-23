export default class AssetRegistry {
  private readonly imagesByID = new Map<string, HTMLImageElement>();
  private readonly audioByID = new Map<string, HTMLAudioElement>();

  private loadPromises: Promise<void>[] = [];

  loadImage(id: string, src: string): void {
    const imagePromise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.addEventListener("load", () => {
        this.imagesByID.set(id, img);
        resolve();
      });
      img.addEventListener("error", () => {
        reject(`Failed to load image id:"${id}, src:"${src}"`);
      });
    });

    this.loadPromises.push(imagePromise);
  }

  getImage(id: string): HTMLImageElement | undefined {
    return this.imagesByID.get(id);
  }

  loadAudio(id: string, src: string): void {
    const audioPromise = new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;
      audio.addEventListener("canplaythrough", () => {
        this.audioByID.set(id, audio);
        resolve();
      });
      audio.addEventListener("error", () => {
        reject(`Failed to load audio id:"${id}, src:"${src}"`);
      });
    });

    this.loadPromises.push(audioPromise);
  }

  getAudio(id: string): HTMLAudioElement | undefined {
    return this.audioByID.get(id);
  }

  async waitUntilAllAssetsAreLoaded(): Promise<void> {
    await Promise.all(this.loadPromises);
  }
}
