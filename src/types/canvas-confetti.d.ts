declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  function confetti(options?: ConfettiOptions): Promise<null>;
  function create(globalOptions?: ConfettiOptions): (options?: ConfettiOptions) => Promise<null>;
  function reset(): void;
  function create(globalOptions?: ConfettiOptions): (options?: ConfettiOptions) => Promise<null>;
  function addShape(shapeName: string, shapePath: string): void;
  function addPreset(presetName: string, presetOptions: ConfettiOptions): void;

  export = confetti;
}
