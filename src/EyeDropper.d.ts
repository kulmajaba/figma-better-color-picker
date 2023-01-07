declare class EyeDropper {
  constructor();
  open: () => Promise<{ sRGBHex: string }>;
}
