import crypto from 'node:crypto';

/**
 * Generate an HMAC-SHA256 signature for authenticating outbound requests to n8n.
 * Header format: v1=<hex-digest>
 */
export function createAppuHmacSignature(
  payload: string,
  timestamp: string,
  secret: string
): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${timestamp}.${payload}`);
  return `v1=${hmac.digest('hex')}`;
}
