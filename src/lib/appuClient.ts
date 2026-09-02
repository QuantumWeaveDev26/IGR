/**
 * Secure APPU Backend Client for IGR
 *
 * Communicates with the production APPU gateway at https://api.appuai.online.
 * Follows the same contract as the appuai.online frontend's AppuBackendClient.
 *
 * SECURITY INVARIANTS:
 * - Browser sends ONLY: message, language, guestToken
 * - Browser NEVER sends: n8n webhook URLs, HMAC secrets, ElevenLabs keys, Supabase keys
 * - Guest token is stored in localStorage as 'appu_guest_token'
 * - Audio URLs are validated against the trusted API origin before playback
 * - Authorization headers are NEVER attached to non-APPU origins
 */

const APPU_API_BASE = 'https://api.appuai.online';
const GUEST_TOKEN_KEY = 'appu_guest_token';

export interface AppuMessageResponse {
  output: string | null;
  audioSource: string | null;
  audioDurationMs: number | null;
  guestToken: string | null;
  guestRemaining: number | null;
}

function getStoredGuestToken(): string | null {
  try {
    const tok = localStorage.getItem(GUEST_TOKEN_KEY);
    if (tok && typeof tok === 'string' && tok.trim()) return tok.trim();
  } catch {}
  return null;
}

function setStoredGuestToken(token: string): void {
  if (!token || typeof token !== 'string' || !token.trim()) return;
  try {
    localStorage.setItem(GUEST_TOKEN_KEY, token.trim());
  } catch {}
}

/**
 * Resolve an audio URL against the trusted APPU API base.
 * Rejects untrusted external origins to prevent credential leakage.
 */
export function resolveAudioUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Data URIs (base64 audio) are always safe — no network request
  if (trimmed.startsWith('data:audio/')) return trimmed;

  // Blob URLs are local
  if (trimmed.startsWith('blob:')) return trimmed;

  // Relative URL: resolve against API base
  if (trimmed.startsWith('/')) {
    return `${APPU_API_BASE}${trimmed}`;
  }

  // Absolute URL: verify origin matches trusted APPU backend
  try {
    const parsed = new URL(trimmed);
    const trustedOrigin = new URL(APPU_API_BASE).origin;
    if (parsed.origin === trustedOrigin) {
      return parsed.toString();
    }
    console.warn('[APPU Client] Blocked audio URL from untrusted origin:', parsed.origin);
    return null;
  } catch {
    return null;
  }
}

/**
 * Send a message to the APPU backend.
 * Uses the guest session flow (no authentication required for IGR landing page).
 */
export async function sendMessage(
  message: string,
  language: string = 'en'
): Promise<AppuMessageResponse> {
  const guestToken = getStoredGuestToken();

  const body: Record<string, unknown> = {
    message,
    language,
  };

  if (guestToken) {
    body.guestToken = guestToken;
  }

  try {
    const response = await fetch(`${APPU_API_BASE}/api/appu/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    // Persist guest token from response
    const newToken =
      json?.guest?.token ||
      json?.guestSession?.token ||
      json?.guestToken ||
      null;
    if (newToken) {
      setStoredGuestToken(newToken);
    }

    return {
      output: json?.output || json?.text || json?.message || null,
      audioSource: resolveAudioUrl(json?.audioSource || json?.audioStreamUrl || null),
      audioDurationMs: json?.audioDurationMs ?? null,
      guestToken: newToken,
      guestRemaining: json?.guest?.remaining ?? json?.guestSession?.remaining ?? null,
    };
  } catch (err) {
    console.warn('[APPU Client] Message request failed:', err);
    return {
      output: null,
      audioSource: null,
      audioDurationMs: null,
      guestToken: null,
      guestRemaining: null,
    };
  }
}

export const appuClient = {
  sendMessage,
  resolveAudioUrl,
};

export default appuClient;
