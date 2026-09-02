import { createAppuHmacSignature } from '../security/signature.js';

export interface N8nMentorContext {
  mode: 'guest';
  primaryLanguage: string;
  personalizationEnabled: false;
}

export interface N8nMessageEnvelope {
  requestId: string;
  action: 'sendMessage';
  channel: 'website';
  sessionId: string;
  chatInput: string;
  message: string;
  language: string;
  includeAudio: boolean;
  clientApp: 'igr';
  mentorContext: N8nMentorContext;
}

export interface N8nMessageResponse {
  text: string;
  audioSource: string | null;
  audioDurationMs: number | null;
}

export interface N8nClientOptions {
  webhookUrl: string;
  webhookSecret?: string;
  timeoutMs?: number;
}

function toAudioSource(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const audio = value.trim();
  if (!audio) return null;

  if (/^(data:audio\/|https?:\/\/|blob:)/i.test(audio)) {
    return audio;
  }

  return `data:audio/mpeg;base64,${audio}`;
}

export class N8nClient {
  private readonly webhookUrl: string;
  private readonly webhookSecret: string | null;
  private readonly timeoutMs: number;

  constructor(options: N8nClientOptions) {
    this.webhookUrl = options.webhookUrl;
    this.webhookSecret = options.webhookSecret?.trim() || null;
    this.timeoutMs = options.timeoutMs ?? 20000;
  }

  public async sendMessage(envelope: N8nMessageEnvelope): Promise<N8nMessageResponse> {
    const rawBody = JSON.stringify(envelope);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.webhookSecret) {
      const timestamp = String(Math.floor(Date.now() / 1000));
      headers['X-APPU-Timestamp'] = timestamp;
      headers['X-APPU-Signature'] = createAppuHmacSignature(rawBody, timestamp, this.webhookSecret);
    }

    let response: Response;
    try {
      response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: rawBody,
        signal: AbortSignal.timeout(this.timeoutMs)
      });
    } catch (err: any) {
      console.error('[N8nClient] Request failed:', err);
      throw new Error('AI mentor service timed out or was unreachable.');
    }

    if (!response.ok) {
      console.error('[N8nClient] Webhook returned status:', response.status);
      throw new Error(`AI mentor service returned error (${response.status})`);
    }

    const rawText = await response.text();
    let parsed: any = null;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      return {
        text: rawText.replace(/\\n/g, '\n').trim(),
        audioSource: null,
        audioDurationMs: null
      };
    }

    const payload = Array.isArray(parsed) ? parsed[0] : parsed;
    const data = payload && typeof payload === 'object' ? payload : {};

    const rawMsg = data.output ?? data.text ?? data.response ?? data.message ?? '';
    const text = (typeof rawMsg === 'string' ? rawMsg.replace(/\\n/g, '\n') : String(rawMsg ?? '')).trim();

    const rawAudio =
      data.audio_base64 ??
      data.audioBase64 ??
      data.audioUrl ??
      data.audio_url ??
      data.audio ??
      data.voiceUrl;

    const audioSource = toAudioSource(rawAudio);

    return {
      text: text || 'Namaskara! I am listening.',
      audioSource,
      audioDurationMs: data.audioDurationMs ?? data.duration_ms ?? null
    };
  }
}
