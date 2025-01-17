import { onUnmounted } from "vue";

export const useEvent = <K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K], ...args: any[]) => void
): void => {
  const _innerHandler = (e: WindowEventMap[K], ...args: any[]) => {
    handler(e, ...args);
  }

  window.addEventListener(event, _innerHandler);
  onUnmounted(() => {
    window.removeEventListener(event, _innerHandler);
  });
} 