interface LightTip {
  success: (message: string) => void;
  error: (message: string) => void;
};

interface Woff2Module {
  decompress: (buffer: ArrayBuffer) => Uint8Array;
}

declare global {
  interface Window {
    LightTip: LightTip;

    Module: Woff2Module;
  }
};

export { };