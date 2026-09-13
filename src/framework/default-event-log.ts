export default class DefaultEventLog {
  private readonly tickEvents = new Map<string, unknown[]>();
  private readonly renderEvents = new Map<string, unknown[]>();

  pushTick(eventType: string, event: unknown): void {
    if (!this.tickEvents.has(eventType)) {
      this.tickEvents.set(eventType, []);
    }

    this.tickEvents.get(eventType)?.push(event);
  }

  getTick(eventType: string): unknown[] {
    return this.tickEvents.get(eventType) ?? [];
  }

  clearTick(): void {
    this.tickEvents.clear();
  }

  pushRender(eventType: string, event: unknown): void {
    if (!this.renderEvents.has(eventType)) {
      this.renderEvents.set(eventType, []);
    }

    this.renderEvents.get(eventType)?.push(event);
  }

  getRender(eventType: string): unknown[] {
    return this.renderEvents.get(eventType) ?? [];
  }

  clearRender(): void {
    this.renderEvents.clear();
  }
}
