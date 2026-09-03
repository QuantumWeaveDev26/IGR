/**
 * Sliding Window In-Memory IP Rate Limiter
 * Protects public landing page widget from flood/abuse without requiring DB storage.
 */

const ipRequestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute per IP

export class RateLimitError extends Error {
  public statusCode = 429;
  constructor(message = 'Too many requests. Please slow down and try again shortly.') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export function checkIpRateLimit(clientIp: string, maxRequests = MAX_REQUESTS_PER_WINDOW): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history = ipRequestHistory.get(clientIp) || [];
  const activeHistory = history.filter((t) => t > windowStart);

  if (activeHistory.length >= maxRequests) {
    throw new RateLimitError();
  }

  activeHistory.push(now);
  ipRequestHistory.set(clientIp, activeHistory);

  // Periodic pruning of stale IPs
  if (ipRequestHistory.size > 5000) {
    for (const [ip, timestamps] of ipRequestHistory.entries()) {
      const valid = timestamps.filter((t) => t > windowStart);
      if (valid.length === 0) ipRequestHistory.delete(ip);
      else ipRequestHistory.set(ip, valid);
    }
  }
}

export function resetRateLimits(): void {
  ipRequestHistory.clear();
}
