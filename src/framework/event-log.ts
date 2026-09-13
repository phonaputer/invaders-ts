export default interface EventLog {
  /**
   * Tick events are cleared at the end of each tick.
   */
  pushTick: (eventType: string, event: unknown) => void;
  getTick: (eventType: string) => unknown[];

  /**
   * Tick events are cleared at the end of each render.
   *
   * It should be noted that any events pushed by a tick system will be available to render systems
   * at the next render.
   */
  pushRender: (eventType: string, event: unknown) => void;
  getRender: (eventType: string) => unknown[];
}
