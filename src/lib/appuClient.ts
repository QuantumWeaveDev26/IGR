/**
 * Dedicated APPU AI Mentor Client for IGR Academy
 *
 * Communicates with the IGR server gateway endpoint (POST /api/appu/message)
 * configured via VITE_IGR_API_BASE_URL (defaults to https://api.igr.academy).
 *
 * ARCHITECTURAL INVARIANTS:
 * - NO APPU product guest-token / 3-turn limit / login gating.
 * - Persistent anonymous session ID via localStorage['igr_session_id'].
 * - Receives direct inline audioSource (data:audio/mpeg;base64,...) for both English and ElevenLabs v3 Kannada.
 * - Zero browser / system SpeechSynthesis fallback.
 * - Zero direct n8n or ElevenLabs credentials in the frontend.
 */

const IGR_API_BASE = (
  (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_IGR_API_BASE_URL) ||
  'https://api.igr.academy'
).replace(/\/+$/, '');

const SESSION_KEY = 'igr_session_id';

export interface AppuMessageResponse {
  output: string | null;
  audioSource: string | null;
  audioDurationMs: number | null;
}

export interface PlayAudioOptions {
  audioSource?: string | null;
  onStart?: () => void;
  onEnded?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Retrieve or generate a stable anonymous conversation session identifier.
 */
export function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]{8,128}$/.test(id.trim())) {
      id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id.trim();
  } catch {
    return 'sess_fallback_default';
  }
}

let currentAudioElement: HTMLAudioElement | null = null;

export function stopAllAudio(): void {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch {}
    currentAudioElement = null;
  }
}

/**
 * Send a learning query to the IGR server gateway.
 * Zero APPU guest limits or login gates.
 */
export async function sendMessage(
  message: string,
  language: string = 'en'
): Promise<AppuMessageResponse> {
  const sessionId = getOrCreateSessionId();

  const body = {
    message,
    language,
    includeAudio: true,
    sessionId
  };

  try {
    const response = await fetch(`${IGR_API_BASE}/api/appu/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.warn('[IGR APPU Client] Gateway returned error status:', response.status);
      return {
        output: null,
        audioSource: null,
        audioDurationMs: null
      };
    }

    const json = await response.json();

    return {
      output: json?.text || json?.output || json?.message || null,
      audioSource: json?.audioSource && typeof json.audioSource === 'string' && json.audioSource.startsWith('data:audio/')
        ? json.audioSource
        : null,
      audioDurationMs: json?.audioDurationMs ?? null
    };
  } catch (err) {
    console.warn('[IGR APPU Client] Gateway connection error:', err);
    return {
      output: null,
      audioSource: null,
      audioDurationMs: null
    };
  }
}

/**
 * Play server-provided inline audio (English or ElevenLabs v3 Kannada).
 * Fails gracefully without falling back to browser/system TTS.
 */
export async function playAudio(options: PlayAudioOptions): Promise<boolean> {
  const { audioSource, onStart, onEnded, onError } = options;

  stopAllAudio();

  if (!audioSource || typeof audioSource !== 'string' || !audioSource.trim()) {
    return false;
  }

  try {
    const audio = new Audio(audioSource.trim());
    currentAudioElement = audio;
    audio.volume = 1.0;
    audio.muted = false;

    audio.addEventListener('play', () => onStart?.(), { once: true });
    audio.addEventListener('ended', () => {
      stopAllAudio();
      onEnded?.();
    }, { once: true });
    audio.addEventListener('error', (e) => {
      console.warn('[IGR APPU Audio] Audio element playback error:', e);
      stopAllAudio();
      onError?.(e);
    }, { once: true });

    await audio.play();
    return true;
  } catch (err) {
    console.warn('[IGR APPU Audio] Direct audio play error (graceful):', err);
    onError?.(err);
    return false;
  }
}

export const appuClient = {
  sendMessage,
  playAudio,
  stopAllAudio,
  getOrCreateSessionId
};

export default appuClient;
