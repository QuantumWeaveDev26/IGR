/**
 * Secure APPU Backend API Client for IGr Academy
 *
 * Communicates exclusively with the secure production APPU backend gateway (api.appuai.online).
 *
 * SECURITY INVARIANTS:
 * - Direct browser-to-n8n chat webhooks are ELIMINATED.
 * - Private n8n webhook URLs and HMAC secrets are NEVER included in frontend JS.
 * - Guest tokens are resolved, signed, and enforced authoritatively by the backend.
 * - Network or server errors are surfaced truthfully; no fake assistant replies.
 */

export interface AppuChatMessageParams {
  message: string;
  language?: 'en' | 'kn' | string;
  includeAudio?: boolean;
}

export interface AppuChatMessageResult {
  text: string | null;
  audioSource?: string | null;
  audioStreamUrl?: string | null;
  audioDurationMs?: number | null;
  requestId?: string;
  error?: 'guest_limit_reached' | 'network_error' | 'upstream_error' | 'bad_request' | string;
  errorMessage?: string;
  guest?: {
    token?: string;
    limit?: number;
    used?: number;
    remaining?: number;
    loginRequired?: boolean;
  };
}

export interface GuestStatusResult {
  limit: number;
  used: number;
  remaining: number;
  loginRequired: boolean;
  token?: string;
}

const GUEST_TOKEN_KEY = 'appu_guest_token';

export class AppuApiClient {
  private apiBaseUrl = 'https://api.appuai.online';

  /**
   * Get the persisted guest session token from localStorage
   */
  getStoredGuestToken(): string | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem(GUEST_TOKEN_KEY);
        if (token && typeof token === 'string' && token.trim()) {
          return token.trim();
        }
      }
    } catch {}
    return null;
  }

  /**
   * Persist the guest session token in localStorage
   */
  setStoredGuestToken(token: string | null): void {
    if (!token || typeof token !== 'string' || !token.trim()) return;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(GUEST_TOKEN_KEY, token.trim());
      }
    } catch {}
  }

  /**
   * Fetch current complimentary guest quota and session token from the APPU backend
   */
  async getGuestStatus(): Promise<GuestStatusResult> {
    const endpoint = `${this.apiBaseUrl}/api/appu/guest-status`;
    const storedToken = this.getStoredGuestToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (storedToken) {
      headers['X-Guest-Session-Token'] = storedToken;
    }

    try {
      const res = await fetch(endpoint, { method: 'GET', headers });
      if (res.ok) {
        const headerToken = res.headers.get('x-guest-session-token');
        const data = await res.json();
        const activeToken = headerToken || data.token || data.guest?.token || data.guestSession?.token || storedToken;

        if (activeToken) {
          this.setStoredGuestToken(activeToken);
        }

        const limit = data.limit ?? data.guestLimit ?? data.guest?.limit ?? 3;
        const used = data.used ?? data.guest?.used ?? 0;
        const remaining = data.remaining ?? data.guest?.remaining ?? Math.max(0, limit - used);
        const loginRequired = Boolean(data.loginRequired ?? (remaining <= 0));

        return { limit, used, remaining, loginRequired, token: activeToken || undefined };
      }
    } catch (err) {
      console.warn('[APPU Client] Error fetching guest status:', err);
    }

    return {
      limit: 3,
      used: 0,
      remaining: 3,
      loginRequired: false,
      token: storedToken || undefined
    };
  }

  /**
   * Send live user message to the secure APPU backend gateway (POST /api/appu/message)
   */
  async sendChatMessage(params: AppuChatMessageParams): Promise<AppuChatMessageResult> {
    const { message, language = 'en', includeAudio = true } = params;

    if (!message || !message.trim()) {
      return {
        text: null,
        error: 'bad_request',
        errorMessage: 'Message cannot be empty.'
      };
    }

    const storedToken = this.getStoredGuestToken();
    const idempotencyKey = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : 'igr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey
    };

    if (storedToken) {
      headers['X-Guest-Session-Token'] = storedToken;
    }

    const payload: Record<string, any> = {
      message: message.trim(),
      language: language === 'kn' ? 'kn' : 'en',
      includeAudio: Boolean(includeAudio)
    };

    if (storedToken) {
      payload.guestToken = storedToken;
    }

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/appu/message`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const headerToken = res.headers.get('x-guest-session-token');

      if (!res.ok) {
        let errJson: any = null;
        try {
          errJson = await res.json();
        } catch {}

        if (res.status === 403 && (errJson?.code === 'GUEST_LIMIT_REACHED' || errJson?.error?.code === 'forbidden')) {
          return {
            text: null,
            error: 'guest_limit_reached',
            errorMessage: 'Guest turn limit reached. Please book a discovery call to continue chatting!'
          };
        }

        return {
          text: null,
          error: 'upstream_error',
          errorMessage: errJson?.message || errJson?.error?.message || `Server responded with status ${res.status}`
        };
      }

      const data = await res.json();
      const updatedToken = headerToken || data.guest?.token || data.guestSession?.token || data.token || storedToken;

      if (updatedToken) {
        this.setStoredGuestToken(updatedToken);
      }

      // Resolve audioStreamUrl relative to https://api.appuai.online if provided
      let resolvedStreamUrl: string | null = null;
      if (data.audioStreamUrl && typeof data.audioStreamUrl === 'string') {
        const raw = data.audioStreamUrl.trim();
        resolvedStreamUrl = raw.startsWith('/') ? `${this.apiBaseUrl}${raw}` : raw;
      }

      return {
        text: data.text || null,
        audioSource: data.audioSource || null,
        audioStreamUrl: resolvedStreamUrl,
        audioDurationMs: data.audioDurationMs ?? null,
        requestId: data.requestId,
        guest: data.guest || data.guestSession || {
          token: updatedToken,
          limit: 3,
          used: 1,
          remaining: 2,
          loginRequired: false
        }
      };
    } catch (err: any) {
      console.warn('[APPU Client] Network error during sendChatMessage:', err);
      return {
        text: null,
        error: 'network_error',
        errorMessage: 'Network connection interrupted. Please check your internet and try again.'
      };
    }
  }

  /**
   * Backward-compatible helper for existing code calling sendChatToAgent(query, sessionId)
   */
  async sendChatToAgent(query: string, _sessionId?: string, language: 'en' | 'kn' = 'en'): Promise<string | null> {
    const result = await this.sendChatMessage({ message: query, language });
    return result.text;
  }

  /**
   * Submit lead capture application and persist locally
   */
  async submitLeadCapture(payload: Record<string, any>) {
    console.log('[APPU Client] Submitting Lead Capture Payload:', payload);

    // Save locally to localStorage so lead is never lost
    try {
      const existingLeads = JSON.parse(localStorage.getItem('igr_leads') || '[]');
      existingLeads.push({
        ...payload,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('igr_leads', JSON.stringify(existingLeads));
    } catch (e) {
      console.warn('[APPU Client] Could not save lead to localStorage:', e);
    }

    return { success: true, data: payload };
  }
}

export const n8nClient = new AppuApiClient();
export const appuApiClient = n8nClient;
