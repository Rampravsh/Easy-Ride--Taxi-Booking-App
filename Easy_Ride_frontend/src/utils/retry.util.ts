/**
 * Enterprise-grade retry helper utilizing exponential backoff and randomized jitter.
 */
interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  jitter?: boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
  shouldRetry?: (error: any) => boolean;
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    backoffFactor = 2,
    jitter = true,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (attempt > maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate exponential backoff delay: baseDelay = initialDelay * (factor ^ (attempt - 1))
      let delay = initialDelayMs * Math.pow(backoffFactor, attempt - 1);

      // Add randomized jitter to avoid thundering herd problem
      if (jitter) {
        const jitterAmount = Math.random() * 0.3 * delay; // Up to 30% randomization
        delay += jitterAmount;
      }

      delay = Math.round(delay);

      if (onRetry) {
        onRetry(error, attempt, delay);
      }

      await wait(delay);
    }
  }
}
