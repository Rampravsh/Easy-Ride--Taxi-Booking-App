/**
 * Reusable type-safe debounce helper.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  waitMs: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: any = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, waitMs);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
