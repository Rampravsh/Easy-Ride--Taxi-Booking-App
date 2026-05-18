/**
 * Reusable type-safe throttle helper.
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}
