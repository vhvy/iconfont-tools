interface LightTip {
  success: (message: string) => void;
  error: (message: string) => void;
};

declare global {
  interface Window {
    LightTip: LightTip;
  }
};

export {};