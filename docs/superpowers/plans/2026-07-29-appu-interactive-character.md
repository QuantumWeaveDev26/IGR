# APPU Interactive Character Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive waist-up APPU character to the existing React chat that visibly listens, thinks, speaks, encourages, celebrates, and fails gracefully.

**Architecture:** Keep `AppuChatWidget` responsible for chat and connect it to three focused units: a pure character-state reducer, a voice lifecycle hook, and a visual character stage. The first renderer animates `appu_portrait.jpg`; the component boundary allows a custom Rive renderer to be introduced later without changing chat logic.

**Tech Stack:** React 18, TypeScript 5.7, Vite 6, Vitest, React Testing Library, CSS animations, existing n8n client and APPU voice endpoint

## Global Constraints

- Modify only `C:\Users\Naveen Reddy\Downloads\igr.academy`.
- Do not use files or code from `C:\Users\Naveen Reddy\Downloads\New folder\igr`.
- Do not use `public/images/appu_3d_avatar.png` or `public/images/appu_3d_avatar_clean.png`; they are page screenshots.
- Use `public/images/appu_portrait.jpg` as the character image.
- Do not load an unrelated public Rive character.
- Keep the existing n8n URLs, response flow, early-access modal, draggable launcher, Student/Parent mode, suggestions, XP, and voice fallback working.
- Do not add continuous microphone recording, camera tracking, free 3D rotation, or phoneme-perfect lip sync.
- Support 375 px mobile width with no horizontal overflow and touch targets of at least 44 px.
- Respect `prefers-reduced-motion`.
- Character or voice failure must never block text chat.
- The project currently has no `.git` directory. Do not initialize Git without user approval; use the test/build checkpoint at the end of each task.

---

## File Structure

### New files

- `src/components/appu-character/appuCharacterState.ts` — pure state types, reducer, status copy, and encouragement detection.
- `src/components/appu-character/appuCharacterState.test.ts` — reducer and helper tests.
- `src/components/appu-character/useAppuCharacter.ts` — React state wrapper and temporary-state timers.
- `src/components/appu-character/useAppuCharacter.test.tsx` — timer and lifecycle tests.
- `src/components/appu-character/useAppuVoice.ts` — generated-audio and speech-synthesis lifecycle.
- `src/components/appu-character/useAppuVoice.test.tsx` — audio lifecycle and fallback tests.
- `src/components/appu-character/AppuCharacterStage.tsx` — accessible character-stage markup and portrait renderer boundary.
- `src/components/appu-character/AppuCharacterStage.test.tsx` — state rendering and image-failure tests.
- `src/components/AppuChatWidget.test.tsx` — chat-to-character integration tests.
- `src/test/setup.ts` — DOM test setup.
- `vitest.config.ts` — Vitest browser-like test configuration.

### Modified files

- `package.json` — add test scripts and test-only dependencies.
- `package-lock.json` — generated dependency lock changes.
- `src/components/AppuChatWidget.tsx` — connect existing chat, input, role, XP, and voice events to the character controller.
- `src/index.css` — stage layout, state animation, mobile rules, and reduced-motion rules.

---

### Task 1: Install the Test Harness and Build the Character State Model

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/components/appu-character/appuCharacterState.ts`
- Create: `src/components/appu-character/appuCharacterState.test.ts`

**Interfaces:**

- Produces: `AppuCharacterState`, `AppuCharacterEvent`, `AppuCharacterSnapshot`, `initialAppuCharacterSnapshot`, `appuCharacterReducer`, `getAppuStatusText`, and `needsEncouragement`.

- [ ] **Step 1: Add the test dependencies and scripts**

Run:

```powershell
npm install --save-dev vitest@^3.2.4 jsdom@^26.1.0 @testing-library/react@^16.3.0 @testing-library/jest-dom@^6.6.3 @testing-library/user-event@^14.6.1
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    restoreMocks: true,
  },
});
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(window, 'speechSynthesis', {
  configurable: true,
  value: {
    cancel: vi.fn(),
    speak: vi.fn(),
  },
});

vi.stubGlobal(
  'SpeechSynthesisUtterance',
  class {
    text: string;
    rate = 1;
    pitch = 1;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor(text: string) {
      this.text = text;
    }
  },
);
```

- [ ] **Step 3: Write the failing reducer tests**

Create `src/components/appu-character/appuCharacterState.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  appuCharacterReducer,
  getAppuStatusText,
  initialAppuCharacterSnapshot,
  needsEncouragement,
} from './appuCharacterState';

describe('appuCharacterReducer', () => {
  it('welcomes on first open and idles when closed', () => {
    const welcomed = appuCharacterReducer(initialAppuCharacterSnapshot, { type: 'OPEN' });
    expect(welcomed.state).toBe('welcome');

    const closed = appuCharacterReducer(welcomed, { type: 'CLOSE' });
    expect(closed.state).toBe('idle');
  });

  it('moves through thinking and speaking without leaving stale states', () => {
    const thinking = appuCharacterReducer(initialAppuCharacterSnapshot, { type: 'THINKING_START' });
    const speaking = appuCharacterReducer(thinking, { type: 'SPEAKING_START' });
    const idle = appuCharacterReducer(speaking, { type: 'SPEAKING_END' });

    expect(thinking.state).toBe('thinking');
    expect(speaking.state).toBe('speaking');
    expect(idle.state).toBe('idle');
  });

  it('uses calm mode for parents', () => {
    const parent = appuCharacterReducer(initialAppuCharacterSnapshot, {
      type: 'SET_CALM_MODE',
      enabled: true,
    });
    expect(parent.calmMode).toBe(true);
  });
});

describe('character copy and encouragement', () => {
  it('provides concise status text for every public state', () => {
    expect(getAppuStatusText('idle')).toBe('Ready when you are');
    expect(getAppuStatusText('thinking')).toBe('Let me think');
    expect(getAppuStatusText('speaking')).toBe('Let’s learn together');
  });

  it('recognizes learner frustration without matching ordinary questions', () => {
    expect(needsEncouragement("I don't understand this")).toBe(true);
    expect(needsEncouragement('This is confusing and hard')).toBe(true);
    expect(needsEncouragement('Explain photosynthesis')).toBe(false);
  });
});
```

- [ ] **Step 4: Run the reducer test and verify failure**

Run:

```powershell
npm test -- src/components/appu-character/appuCharacterState.test.ts
```

Expected: FAIL because `appuCharacterState.ts` does not exist.

- [ ] **Step 5: Implement the pure state model**

Create `src/components/appu-character/appuCharacterState.ts`:

```ts
export type AppuCharacterState =
  | 'idle'
  | 'welcome'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'encourage'
  | 'celebrate'
  | 'error';

export interface AppuCharacterSnapshot {
  state: AppuCharacterState;
  calmMode: boolean;
}

export type AppuCharacterEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'IDLE' }
  | { type: 'LISTENING_START' }
  | { type: 'LISTENING_END' }
  | { type: 'THINKING_START' }
  | { type: 'THINKING_END' }
  | { type: 'SPEAKING_START' }
  | { type: 'SPEAKING_END' }
  | { type: 'ENCOURAGE' }
  | { type: 'CELEBRATE' }
  | { type: 'ERROR' }
  | { type: 'SET_CALM_MODE'; enabled: boolean };

export const initialAppuCharacterSnapshot: AppuCharacterSnapshot = {
  state: 'idle',
  calmMode: false,
};

export function appuCharacterReducer(
  snapshot: AppuCharacterSnapshot,
  event: AppuCharacterEvent,
): AppuCharacterSnapshot {
  if (event.type === 'SET_CALM_MODE') {
    return { ...snapshot, calmMode: event.enabled };
  }

  const stateByEvent: Partial<Record<AppuCharacterEvent['type'], AppuCharacterState>> = {
    OPEN: 'welcome',
    CLOSE: 'idle',
    IDLE: 'idle',
    LISTENING_START: 'listening',
    LISTENING_END: 'idle',
    THINKING_START: 'thinking',
    THINKING_END: 'idle',
    SPEAKING_START: 'speaking',
    SPEAKING_END: 'idle',
    ENCOURAGE: 'encourage',
    CELEBRATE: 'celebrate',
    ERROR: 'error',
  };

  return { ...snapshot, state: stateByEvent[event.type] ?? snapshot.state };
}

const statusText: Record<AppuCharacterState, string> = {
  idle: 'Ready when you are',
  welcome: 'Hi! Ready to learn?',
  listening: 'I’m listening',
  thinking: 'Let me think',
  speaking: 'Let’s learn together',
  encourage: 'We’ll solve it together',
  celebrate: 'Brilliant work!',
  error: 'Let’s try that again',
};

export const getAppuStatusText = (state: AppuCharacterState) => statusText[state];

const encouragementPattern = /\b(don't understand|do not understand|confus(?:ed|ing)|stuck|too hard|difficult)\b/i;

export const needsEncouragement = (text: string) => encouragementPattern.test(text);
```

- [ ] **Step 6: Run the focused test and the existing build**

Run:

```powershell
npm test -- src/components/appu-character/appuCharacterState.test.ts
npm run build
```

Expected: reducer tests PASS and the production build completes.

- [ ] **Step 7: Record checkpoint**

Confirm that only the test harness, lockfile, and character-state files changed. Do not initialize Git.

---

### Task 2: Build the Character Hook and Voice Lifecycle Hook

**Files:**

- Create: `src/components/appu-character/useAppuCharacter.ts`
- Create: `src/components/appu-character/useAppuCharacter.test.tsx`
- Create: `src/components/appu-character/useAppuVoice.ts`
- Create: `src/components/appu-character/useAppuVoice.test.tsx`

**Interfaces:**

- Consumes: `AppuCharacterEvent`, `AppuCharacterSnapshot`, and `appuCharacterReducer`.
- Produces:

```ts
useAppuCharacter(): {
  snapshot: AppuCharacterSnapshot;
  send: React.Dispatch<AppuCharacterEvent>;
  triggerTemporary: (event: 'ENCOURAGE' | 'CELEBRATE' | 'ERROR', duration?: number) => void;
}

useAppuVoice(options: {
  muted: boolean;
  generateAudioUrl: (text: string) => Promise<string | null>;
  onStart: () => void;
  onEnd: () => void;
  onError: () => void;
}): {
  speak: (text: string, forcePlay?: boolean) => Promise<void>;
  stop: () => void;
}
```

- [ ] **Step 1: Write failing character-hook tests**

Create `src/components/appu-character/useAppuCharacter.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppuCharacter } from './useAppuCharacter';

describe('useAppuCharacter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns temporary celebration to idle', () => {
    const { result } = renderHook(() => useAppuCharacter());

    act(() => result.current.triggerTemporary('CELEBRATE', 1500));
    expect(result.current.snapshot.state).toBe('celebrate');

    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.snapshot.state).toBe('idle');
  });

  it('cancels a temporary timer when a stronger state starts', () => {
    const { result } = renderHook(() => useAppuCharacter());

    act(() => result.current.triggerTemporary('ENCOURAGE', 1500));
    act(() => result.current.send({ type: 'THINKING_START' }));
    act(() => vi.advanceTimersByTime(1500));

    expect(result.current.snapshot.state).toBe('thinking');
  });

  it('returns the first-open welcome to idle', () => {
    const { result } = renderHook(() => useAppuCharacter());

    act(() => result.current.send({ type: 'OPEN' }));
    expect(result.current.snapshot.state).toBe('welcome');

    act(() => vi.advanceTimersByTime(1800));
    expect(result.current.snapshot.state).toBe('idle');
  });
});
```

- [ ] **Step 2: Write failing voice-hook tests**

Create `src/components/appu-character/useAppuVoice.test.tsx` with a fake audio element that records lifecycle listeners:

```tsx
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppuVoice } from './useAppuVoice';

class FakeAudio {
  currentTime = 0;
  listeners = new Map<string, () => void>();
  play = vi.fn(async () => {
    this.listeners.get('play')?.();
  });
  pause = vi.fn(() => {
    this.listeners.get('pause')?.();
  });
  addEventListener = vi.fn((name: string, listener: () => void) => {
    this.listeners.set(name, listener);
  });
  removeEventListener = vi.fn();
}

describe('useAppuVoice', () => {
  beforeEach(() => {
    vi.stubGlobal('Audio', FakeAudio);
    window.speechSynthesis.cancel = vi.fn();
  });

  it('reports generated audio start and end', async () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useAppuVoice({
        muted: false,
        generateAudioUrl: vi.fn().mockResolvedValue('/voice.mp3'),
        onStart,
        onEnd,
        onError,
      }),
    );

    await act(() => result.current.speak('Hello'));
    expect(onStart).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
  });

  it('does not generate audio while muted unless forced', async () => {
    const generateAudioUrl = vi.fn();
    const { result } = renderHook(() =>
      useAppuVoice({
        muted: true,
        generateAudioUrl,
        onStart: vi.fn(),
        onEnd: vi.fn(),
        onError: vi.fn(),
      }),
    );

    await act(() => result.current.speak('Muted'));
    expect(generateAudioUrl).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run both tests and verify failure**

Run:

```powershell
npm test -- src/components/appu-character/useAppuCharacter.test.tsx src/components/appu-character/useAppuVoice.test.tsx
```

Expected: FAIL because both hooks are absent.

- [ ] **Step 4: Implement `useAppuCharacter`**

Implement the hook with `useReducer`, a timer ref, cleanup on unmount, and a wrapped `send` function that clears temporary timers before dispatching non-temporary events:

```ts
import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  AppuCharacterEvent,
  appuCharacterReducer,
  initialAppuCharacterSnapshot,
} from './appuCharacterState';

type TemporaryEvent = 'ENCOURAGE' | 'CELEBRATE' | 'ERROR';

export function useAppuCharacter() {
  const [snapshot, dispatch] = useReducer(appuCharacterReducer, initialAppuCharacterSnapshot);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const send = useCallback((event: AppuCharacterEvent) => {
    clearTimer();
    dispatch(event);
  }, [clearTimer]);

  const triggerTemporary = useCallback((type: TemporaryEvent, duration = 1500) => {
    clearTimer();
    dispatch({ type });
    timerRef.current = window.setTimeout(() => {
      dispatch({ type: 'IDLE' });
      timerRef.current = null;
    }, duration);
  }, [clearTimer]);

  useEffect(() => {
    if (snapshot.state !== 'welcome') return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      dispatch({ type: 'IDLE' });
      timerRef.current = null;
    }, 1800);
    return clearTimer;
  }, [snapshot.state, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  return { snapshot, send, triggerTemporary };
}
```

- [ ] **Step 5: Implement `useAppuVoice`**

Implement these exact behaviours:

- Clean markdown symbols before playback.
- Stop prior HTML audio and speech synthesis before starting.
- Attach `play`, `ended`, `pause`, and `error` listeners before `audio.play()`.
- Call `onStart` only from actual audio or utterance start.
- Call `onEnd` on normal end, pause, mute, or explicit stop.
- Call `onError` when generated audio and browser synthesis cannot start.
- Fall back to `SpeechSynthesisUtterance` when `generateAudioUrl` returns `null` or throws.
- Remove audio listeners during stop and unmount.

Use stable callback refs so changing character state does not recreate the controller during playback.

Use this implementation shape:

```ts
import { useCallback, useEffect, useRef } from 'react';

interface UseAppuVoiceOptions {
  muted: boolean;
  generateAudioUrl: (text: string) => Promise<string | null>;
  onStart: () => void;
  onEnd: () => void;
  onError: () => void;
}

export function useAppuVoice(options: UseAppuVoiceOptions) {
  const optionsRef = useRef(options);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const finishRef = useRef<(() => void) | null>(null);
  optionsRef.current = options;

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    }
    const finish = finishRef.current;
    finishRef.current = null;
    finish?.();
  }, []);

  const speak = useCallback(async (text: string, forcePlay = false) => {
    const cleanText = text.replace(/[*_#`~✦✳•]/g, '').trim();
    if (!cleanText || (optionsRef.current.muted && !forcePlay)) return;

    stop();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      finishRef.current = null;
      optionsRef.current.onEnd();
    };
    finishRef.current = finish;

    try {
      const audioUrl = await optionsRef.current.generateAudioUrl(cleanText);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.addEventListener('play', optionsRef.current.onStart, { once: true });
        audio.addEventListener('ended', finish, { once: true });
        audio.addEventListener('pause', finish, { once: true });
        audio.addEventListener('error', optionsRef.current.onError, { once: true });

        await audio.play();
        return;
      }
    } catch {
      audioRef.current = null;
    }

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      optionsRef.current.onError();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1.05;
    utterance.onstart = optionsRef.current.onStart;
    utterance.onend = finish;
    utterance.onerror = optionsRef.current.onError;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  useEffect(() => {
    if (options.muted) stop();
  }, [options.muted, stop]);

  useEffect(() => stop, [stop]);

  return { speak, stop };
}
```

During implementation, guard `onEnd` so one playback session reports completion once even when `pause` is followed by explicit cleanup. The test must assert that duplicate browser events do not produce duplicate lifecycle callbacks.

- [ ] **Step 6: Run hook tests and the build**

Run:

```powershell
npm test -- src/components/appu-character/useAppuCharacter.test.tsx src/components/appu-character/useAppuVoice.test.tsx
npm run build
```

Expected: hook tests PASS and the build completes.

- [ ] **Step 7: Record checkpoint**

Confirm that the hooks depend only on the pure state module, React, browser audio APIs, and the injected voice generator.

---

### Task 3: Create the Accessible APPU Character Stage

**Files:**

- Create: `src/components/appu-character/AppuCharacterStage.tsx`
- Create: `src/components/appu-character/AppuCharacterStage.test.tsx`

**Interfaces:**

- Consumes:

```ts
interface AppuCharacterStageProps {
  snapshot: AppuCharacterSnapshot;
  imageSrc?: string;
  paused?: boolean;
  renderCharacter?: (snapshot: AppuCharacterSnapshot) => React.ReactNode;
}
```

- Produces: `AppuCharacterStage`, rendered with `data-state`, `data-calm-mode`, visible status text, portrait fallback, waveform, idea dots, and decorative effects.

- [ ] **Step 1: Write the failing component tests**

Create `src/components/appu-character/AppuCharacterStage.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppuCharacterStage } from './AppuCharacterStage';

describe('AppuCharacterStage', () => {
  it('renders semantic state and matching status copy', () => {
    render(
      <AppuCharacterStage
        snapshot={{ state: 'thinking', calmMode: false }}
      />,
    );

    const stage = screen.getByLabelText('APPU is thinking');
    expect(stage).toHaveAttribute('data-state', 'thinking');
    expect(screen.getByText('Let me think')).toBeVisible();
  });

  it('shows initials when the portrait fails', () => {
    render(
      <AppuCharacterStage
        snapshot={{ state: 'idle', calmMode: false }}
        imageSrc="/missing.jpg"
      />,
    );

    fireEvent.error(screen.getByAltText('APPU learning companion'));
    expect(screen.getByText('A')).toBeVisible();
  });

  it('marks Parent mode as calm', () => {
    render(
      <AppuCharacterStage
        snapshot={{ state: 'idle', calmMode: true }}
      />,
    );
    expect(screen.getByLabelText('APPU is idle')).toHaveAttribute('data-calm-mode', 'true');
  });

  it('exposes paused state without removing status information', () => {
    render(
      <AppuCharacterStage
        snapshot={{ state: 'speaking', calmMode: false }}
        paused
      />,
    );
    expect(screen.getByLabelText('APPU is speaking')).toHaveAttribute('data-paused', 'true');
    expect(screen.getByText('Let’s learn together')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the stage test and verify failure**

Run:

```powershell
npm test -- src/components/appu-character/AppuCharacterStage.test.tsx
```

Expected: FAIL because `AppuCharacterStage.tsx` does not exist.

- [ ] **Step 3: Implement the stage component**

Use this structure:

```tsx
import React, { useState } from 'react';
import {
  AppuCharacterSnapshot,
  getAppuStatusText,
} from './appuCharacterState';

interface AppuCharacterStageProps {
  snapshot: AppuCharacterSnapshot;
  imageSrc?: string;
  paused?: boolean;
  renderCharacter?: (snapshot: AppuCharacterSnapshot) => React.ReactNode;
}

export const AppuCharacterStage: React.FC<AppuCharacterStageProps> = ({
  snapshot,
  imageSrc = '/images/appu_portrait.jpg',
  paused = false,
  renderCharacter,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const status = getAppuStatusText(snapshot.state);

  return (
    <section
      className="appu-character-stage"
      data-state={snapshot.state}
      data-calm-mode={String(snapshot.calmMode)}
      data-paused={String(paused)}
      aria-label={`APPU is ${snapshot.state}`}
    >
      <div className="appu-character-backdrop" aria-hidden="true">
        <span className="appu-idea-dot" />
        <span className="appu-idea-dot" />
        <span className="appu-idea-dot" />
        <span className="appu-star appu-star-one">★</span>
        <span className="appu-star appu-star-two">✦</span>
      </div>

      <div className="appu-character-frame">
        {renderCharacter ? renderCharacter(snapshot) : imageFailed ? (
          <div className="appu-character-initials" aria-label="APPU image unavailable">A</div>
        ) : (
          <img
            src={imageSrc}
            alt="APPU learning companion"
            className="appu-character-image"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="appu-speaking-mask" aria-hidden="true" />
      </div>

      <div className="appu-character-copy">
        <span className="appu-character-kicker">APPU</span>
        <span className="appu-character-status">{status}</span>
        <span className="appu-character-wave" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Run the stage tests**

Run:

```powershell
npm test -- src/components/appu-character/AppuCharacterStage.test.tsx
```

Expected: all stage tests PASS. Visual polish comes in Task 5; unstyled markup is acceptable at this checkpoint.

- [ ] **Step 5: Record checkpoint**

Confirm the stage accepts state through props, exposes the optional renderer boundary for a future Rive component, and contains no chat, network, or audio logic.

---

### Task 4: Integrate Character and Voice States into the Existing Chat

**Files:**

- Modify: `src/components/AppuChatWidget.tsx:1-450`
- Create: `src/components/AppuChatWidget.test.tsx`

**Interfaces:**

- Consumes: `AppuCharacterStage`, `useAppuCharacter`, `useAppuVoice`, and `needsEncouragement`.
- Preserves: `AppuChatWidgetProps`, n8n calls, early-access callback, drag behaviour, message formatting, Student/Parent mode, suggestions, XP, and current UI controls.

- [ ] **Step 1: Write failing integration tests**

Mock `../lib/n8nClient` before importing the component:

```tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppuChatWidget } from './AppuChatWidget';

const {
  sendChatToAgent,
  generateAppuVoice,
} = vi.hoisted(() => ({
  sendChatToAgent: vi.fn(),
  generateAppuVoice: vi.fn(),
}));

vi.mock('../lib/n8nClient', () => ({
  n8nClient: {
    sendChatToAgent,
    generateAppuVoice,
  },
}));

describe('AppuChatWidget character integration', () => {
  beforeEach(() => {
    sendChatToAgent.mockResolvedValue('Here is your answer.');
    generateAppuVoice.mockResolvedValue(null);
    window.speechSynthesis.speak = vi.fn();
    window.speechSynthesis.cancel = vi.fn();
  });

  it('shows welcome, listening, and thinking states', async () => {
    const user = userEvent.setup();
    render(<AppuChatWidget onOpenEarlyAccess={vi.fn()} />);

    await user.click(screen.getByLabelText('Toggle APPU chat'));
    expect(screen.getByLabelText('APPU is welcome')).toBeVisible();

    const input = screen.getByPlaceholderText('Ask APPU anything about CBSE...');
    fireEvent.focus(input);
    expect(screen.getByLabelText('APPU is listening')).toBeVisible();

    await user.type(input, 'Explain gravity');
    await user.click(screen.getByLabelText('Send message'));
    expect(screen.getByLabelText('APPU is thinking')).toBeVisible();

    await waitFor(() => expect(screen.getByText('Here is your answer.')).toBeVisible());
  });

  it('returns to idle when muted or closed', async () => {
    const user = userEvent.setup();
    render(<AppuChatWidget onOpenEarlyAccess={vi.fn()} />);

    await user.click(screen.getByLabelText('Toggle APPU chat'));
    await user.click(screen.getByTitle('Mute Voice Audio'));
    expect(screen.getByLabelText('APPU is idle')).toBeVisible();
  });

  it('uses the gentle error state before the existing fallback answer', async () => {
    sendChatToAgent.mockResolvedValueOnce(null);
    const user = userEvent.setup();
    render(<AppuChatWidget onOpenEarlyAccess={vi.fn()} />);

    await user.click(screen.getByLabelText('Toggle APPU chat'));
    const input = screen.getByPlaceholderText('Ask APPU anything about CBSE...');
    await user.type(input, 'Explain algebra');
    await user.click(screen.getByLabelText('Send message'));

    await waitFor(() => expect(screen.getByLabelText('APPU is error')).toBeVisible());
    expect(screen.getByText('Let’s try that again')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the integration test and verify failure**

Run:

```powershell
npm test -- src/components/AppuChatWidget.test.tsx
```

Expected: FAIL because the character stage and state wiring are not in the widget.

- [ ] **Step 3: Add character and voice hooks**

At the top of `AppuChatWidget.tsx`, import:

```ts
import { AppuCharacterStage } from './appu-character/AppuCharacterStage';
import { needsEncouragement } from './appu-character/appuCharacterState';
import { useAppuCharacter } from './appu-character/useAppuCharacter';
import { useAppuVoice } from './appu-character/useAppuVoice';
```

Inside the component:

```ts
const character = useAppuCharacter();
const hasWelcomedRef = useRef(false);
const encourageAfterSpeechRef = useRef(false);
const [isPageHidden, setIsPageHidden] = useState(document.hidden);

const voice = useAppuVoice({
  muted: voiceMuted,
  generateAudioUrl: (text) => n8nClient.generateAppuVoice(text),
  onStart: () => character.send({ type: 'SPEAKING_START' }),
  onEnd: () => {
    character.send({ type: 'SPEAKING_END' });
    if (encourageAfterSpeechRef.current) {
      encourageAfterSpeechRef.current = false;
      character.triggerTemporary('ENCOURAGE', 1800);
    }
  },
  onError: () => character.triggerTemporary('ERROR', 1400),
});
```

Remove `currentAudioRef`, `stopAllAudio`, and the existing `speakText`. Replace call sites with `voice.speak`.

- [ ] **Step 4: Wire chat lifecycle**

Add effects:

```ts
useEffect(() => {
  character.send({ type: 'SET_CALM_MODE', enabled: role === 'Parent' });
}, [role]);

useEffect(() => {
  if (!isOpen) {
    voice.stop();
    character.send({ type: 'CLOSE' });
  }
}, [isOpen]);
```

When opening:

```ts
setIsOpen((current) => {
  const next = !current;
  if (next && !hasWelcomedRef.current) {
    hasWelcomedRef.current = true;
    character.send({ type: 'OPEN' });
  } else if (next) {
    character.send({ type: 'IDLE' });
  } else {
    voice.stop();
    character.send({ type: 'CLOSE' });
  }
  return next;
});
```

Add input handlers:

```tsx
onFocus={() => character.send({ type: 'LISTENING_START' })}
onBlur={() => {
  if (!inputValue.trim()) character.send({ type: 'LISTENING_END' });
}}
```

At the start of `handleSend`, after validating text:

```ts
voice.stop();
character.send({ type: 'THINKING_START' });
```

Before speaking a reply, remember whether the learner needs encouragement:

```ts
encourageAfterSpeechRef.current = needsEncouragement(text);

if (voiceMuted && encourageAfterSpeechRef.current) {
  encourageAfterSpeechRef.current = false;
  character.triggerTemporary('ENCOURAGE', 1800);
}
```

Award XP with a milestone check:

```ts
setXp((previous) => {
  const next = previous + 20;
  if (Math.floor(previous / 100) !== Math.floor(next / 100)) {
    character.triggerTemporary('CELEBRATE', 1500);
  }
  return next;
});
```

- [ ] **Step 5: Render the character stage**

Inside the open chat, insert this after `.chat-header` and before `.chat-xp-bar`:

```tsx
<AppuCharacterStage
  snapshot={character.snapshot}
  paused={isPageHidden}
/>
```

Update mute and close buttons so both call `voice.stop()` and send `IDLE`/`CLOSE`.

- [ ] **Step 6: Make the async flow resilient**

Wrap `sendChatToAgent` so `setIsTyping(false)` always occurs, then end thinking on success or trigger the temporary error state on failure:

```ts
let n8nResponse: string | null = null;
try {
  n8nResponse = await n8nClient.sendChatToAgent(fullQuery, sessionId);
} catch {
  n8nResponse = null;
} finally {
  setIsTyping(false);
}

if (n8nResponse) {
  character.send({ type: 'THINKING_END' });
} else {
  character.triggerTemporary('ERROR', 1400);
}
```

Ensure the fallback message is still created when `n8nResponse` is `null`.

For a null chat response, keep the gentle error state visible and do not auto-play the fallback response. The fallback text remains readable and its existing Listen button can still start voice manually. Auto-play continues for successful live responses.

- [ ] **Step 7: Run integration and regression tests**

Run:

```powershell
npm test -- src/components/AppuChatWidget.test.tsx
npm test
npm run build
```

Expected: integration tests PASS, the complete suite passes, and the production build completes.

- [ ] **Step 8: Record checkpoint**

Confirm that `AppuChatWidget` still exports the same component props and that no n8n endpoints or landing-page components changed.

---

### Task 5: Add Responsive State-Driven Visual Styling

**Files:**

- Modify: `src/index.css:1000-1560`
- Modify: `src/index.css:1749-1785`

**Interfaces:**

- Consumes: `.appu-character-stage`, `data-state`, `data-calm-mode`, and the child classes emitted by `AppuCharacterStage`.
- Produces: desktop/mobile layout, state animation, reduced-motion behaviour, and visual failure fallback.

- [ ] **Step 1: Add the base stage layout**

Add a block adjacent to the existing chat styles:

```css
.appu-character-stage {
  position: relative;
  min-height: 158px;
  display: grid;
  grid-template-columns: 142px minmax(0, 1fr);
  align-items: center;
  overflow: hidden;
  padding: 10px 18px 8px;
  color: var(--paper);
  background:
    radial-gradient(circle at 26% 26%, rgba(246, 185, 56, 0.32), transparent 34%),
    linear-gradient(135deg, #173f34 0%, #0d2e27 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.appu-character-frame {
  position: relative;
  align-self: stretch;
  min-width: 0;
  overflow: hidden;
  transform-origin: 50% 80%;
}

.appu-character-image {
  position: absolute;
  left: 50%;
  bottom: -24px;
  width: 132px;
  height: 156px;
  object-fit: cover;
  object-position: 50% 28%;
  border-radius: 70px 70px 26px 26px;
  transform: translateX(-50%);
  filter: saturate(0.95) contrast(1.03);
}

.appu-character-copy {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 4px;
  min-width: 0;
}

.appu-character-kicker {
  font: 700 11px/1 var(--mono);
  letter-spacing: 0.14em;
  color: var(--sun);
}

.appu-character-status {
  font: 600 17px/1.25 var(--sans);
  color: #fff;
}
```

- [ ] **Step 2: Add state-specific effects**

Use `transform` and `opacity` only for continuous motion:

```css
.appu-character-stage[data-state="idle"] .appu-character-frame {
  animation: appu-breathe 3.8s ease-in-out infinite;
}

.appu-character-stage[data-state="welcome"] .appu-character-frame {
  animation: appu-welcome 900ms cubic-bezier(.2,.9,.3,1) both;
}

.appu-character-stage[data-state="listening"] .appu-character-frame {
  transform: translate3d(4px, 2px, 0) scale(1.025);
}

.appu-character-stage[data-state="thinking"] .appu-idea-dot {
  animation: appu-think-dot 900ms ease-in-out infinite;
}

.appu-character-stage[data-state="speaking"] .appu-character-frame {
  animation: appu-speak-nod 700ms ease-in-out infinite alternate;
}

.appu-character-stage[data-state="speaking"] .appu-character-wave {
  display: inline-flex;
}

.appu-character-stage[data-state="encourage"] {
  background:
    radial-gradient(circle at 28% 30%, rgba(246, 185, 56, 0.4), transparent 36%),
    linear-gradient(135deg, #1f5a46 0%, #123b31 100%);
}

.appu-character-stage[data-state="celebrate"] .appu-star {
  animation: appu-star-pop 800ms cubic-bezier(.2,.9,.3,1) both;
}

.appu-character-stage[data-state="error"] {
  background: linear-gradient(135deg, #35564c, #173f34);
}

.appu-character-stage[data-calm-mode="true"] .appu-star,
.appu-character-stage[data-calm-mode="true"] .appu-character-wave {
  display: none;
}

.appu-character-stage[data-paused="true"] * {
  animation-play-state: paused !important;
}
```

Define the referenced keyframes and stagger the idea dots/wave bars:

```css
@keyframes appu-breathe {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, -3px, 0) scale(1.012); }
}

@keyframes appu-welcome {
  0% { transform: translate3d(-8px, 8px, 0) scale(0.96); opacity: 0; }
  65% { transform: translate3d(3px, -2px, 0) scale(1.025); opacity: 1; }
  100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
}

@keyframes appu-think-dot {
  0%, 100% { transform: translateY(0) scale(0.75); opacity: 0.35; }
  50% { transform: translateY(-6px) scale(1); opacity: 1; }
}

@keyframes appu-speak-nod {
  from { transform: rotate(-0.6deg) translateY(0); }
  to { transform: rotate(0.8deg) translateY(-2px); }
}

@keyframes appu-star-pop {
  0% { transform: scale(0.2) rotate(-20deg); opacity: 0; }
  55% { transform: scale(1.2) rotate(8deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 0.8; }
}

.appu-idea-dot:nth-child(2),
.appu-character-wave i:nth-child(2) { animation-delay: 120ms; }

.appu-idea-dot:nth-child(3),
.appu-character-wave i:nth-child(3) { animation-delay: 240ms; }

.appu-character-wave i:nth-child(4) { animation-delay: 360ms; }
```

- [ ] **Step 3: Add the initials and image-failure styling**

```css
.appu-character-initials {
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  transform: translateX(-50%);
  border-radius: 50%;
  color: #fff;
  background: var(--tomato);
  font: 700 38px/1 var(--serif);
  border: 3px solid var(--sun);
}
```

- [ ] **Step 4: Add mobile rules**

Inside the existing mobile media query:

```css
.appu-character-stage {
  min-height: 124px;
  grid-template-columns: 104px minmax(0, 1fr);
  padding: 8px 12px 6px;
}

.appu-character-image {
  width: 98px;
  height: 122px;
  bottom: -18px;
}

.appu-character-status {
  font-size: 14px;
}
```

Verify the resulting `.appu-chat-window` still fits within `100dvh` and its `.chat-body` keeps `min-height: 0`.

- [ ] **Step 5: Add reduced-motion and hidden-page safety**

```css
@media (prefers-reduced-motion: reduce) {
  .appu-character-stage *,
  .appu-float-bubble {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

In `AppuChatWidget`, add a `visibilitychange` effect that updates `isPageHidden`, calls `voice.stop()`, and sends `IDLE` when `document.hidden` is true:

```ts
useEffect(() => {
  const handleVisibilityChange = () => {
    setIsPageHidden(document.hidden);
    if (document.hidden) {
      encourageAfterSpeechRef.current = false;
      voice.stop();
      character.send({ type: 'IDLE' });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [voice.stop, character.send]);
```

Change the existing launcher pulse from infinite to a finite first-session cue:

```css
.appu-float-bubble::before {
  animation: float-pulse 2.5s 3;
}
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm test
npm run build
```

Expected: complete test suite PASS and production build completes.

- [ ] **Step 7: Record checkpoint**

Confirm that all new selectors are scoped to the APPU widget and no unrelated landing-page section changed visually.

---

### Task 6: Browser Verification and Final Regression Check

**Files:**

- Modify only files required to correct failures found during verification.

**Interfaces:**

- Consumes: the complete APPU character implementation.
- Produces: verified desktop/mobile behaviour and a passing production build.

- [ ] **Step 1: Start the local app**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite reports a local URL without TypeScript or startup errors.

- [ ] **Step 2: Verify desktop behaviour**

At a 1440 × 900 viewport:

1. Open the draggable APPU launcher.
2. Confirm APPU welcomes once and the stage does not cover header, XP, messages, suggestions, or input.
3. Focus the input and confirm listening state.
4. Send “Explain gravity” and confirm thinking state until the reply.
5. Play voice and confirm speaking begins only when audio starts.
6. Mute and close; confirm audio and speaking motion stop.
7. Switch to Parent mode and confirm calmer effects.
8. Drag the closed launcher and reopen it.

- [ ] **Step 3: Verify learner-support and failure behaviour**

1. Send “I’m confused, this is too hard” and confirm the encouragement reaction follows the answer.
2. Temporarily simulate a null chat response through the existing test mock or browser network blocking.
3. Confirm the gentle error reaction appears and the fallback text remains usable.
4. Block the portrait request and confirm the initials avatar appears.

- [ ] **Step 4: Verify mobile behaviour**

At 375 × 812 and 430 × 932:

1. Open the widget and confirm no horizontal scrolling.
2. Confirm all header buttons and the send button remain at least 44 px.
3. Confirm the character stage is visible without pushing the input off-screen.
4. Open the mobile keyboard and confirm the input remains reachable.
5. Close and reopen the widget.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm:

- No continuous breathing, bouncing, blinking, wave, or star animation.
- State copy still changes.
- Chat, voice, close, drag, role switch, and send controls still work.

- [ ] **Step 6: Run the final automated checks**

Run:

```powershell
npm test
npm run build
```

Expected: all tests PASS and `tsc && vite build` exits successfully.

- [ ] **Step 7: Confirm scope**

Review changed files and confirm:

- No file from the old project was read into or copied into `igr.academy`.
- No n8n or Hugging Face endpoint changed.
- No unrelated landing section changed.
- No Git repository was initialized.
- The custom Rive asset remains an optional future renderer, not a runtime requirement.
