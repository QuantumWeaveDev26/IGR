# APPU Interactive Character Design

**Date:** 2026-07-29  
**Project:** `C:\Users\Naveen Reddy\Downloads\igr.academy`  
**Status:** Approved design, ready for written-spec review

## Goal

Make APPU feel like a responsive learning companion inside the existing chat widget rather than a static portrait beside ordinary messages.

The first implementation will create a waist-up APPU stage that visibly listens, thinks, speaks, encourages, and celebrates. It will use the current APPU portrait as a reliable animated fallback and expose a clean adapter for a custom Rive `.riv` character when that production asset becomes available.

## Current Project Context

The implementation belongs only to the React and TypeScript project at `C:\Users\Naveen Reddy\Downloads\igr.academy`.

Relevant existing files:

- `src/components/AppuChatWidget.tsx` owns chat state, n8n responses, voice playback, XP, suggestions, Student/Parent mode, and the draggable launcher.
- `src/lib/n8nClient.ts` provides chat responses and APPU voice generation.
- `src/index.css` contains the current widget layout and responsive styles.
- `public/images/appu_portrait.jpg` is the usable APPU source image.

The existing `appu_3d_avatar.png` and `appu_3d_avatar_clean.png` files are page screenshots rather than isolated character assets and will not be used as character models.

## Approaches Considered

### 1. State-driven portrait with a Rive adapter — selected

Create the complete interaction system now using the existing portrait, lightweight motion, expression cues, status text, and visual effects. Keep the renderer behind a small interface so a custom `.riv` file can replace the portrait later.

This provides a working child-focused experience immediately without substituting an unrelated demo character.

### 2. Custom Rive character only

Wait until layered character artwork is rigged in Rive, then implement the widget.

This can provide better facial and gesture animation but blocks development because the repository contains no `.riv` asset.

### 3. Three.js or VRM character

Build a true rotatable 3D avatar.

This adds download size and rendering complexity, and a one-image reconstruction would be less faithful to APPU than the current portrait. Free rotation also does not improve the core listening and teaching experience inside the compact chat widget.

## Architecture

### `AppuCharacterStage`

A new focused React component displayed inside the open chat, below its header and above the XP bar.

Responsibilities:

- Render the waist-up APPU presentation.
- Display the current child-friendly status.
- Apply state-specific motion and visual effects.
- Render the existing portrait when no Rive asset is present.
- Preserve a static accessible fallback if animation fails or reduced motion is enabled.

It does not own messages, network calls, audio generation, or XP.

### `useAppuCharacter`

A small hook that resolves character state transitions.

Public states:

```text
idle
welcome
listening
thinking
speaking
encourage
celebrate
error
```

The hook prevents stale timers and defines which temporary states return to `idle`.

### `AppuRenderer`

A narrow rendering contract used by the character stage:

```text
setState(state)
setCalmMode(enabled)
pause()
resume()
destroy()
```

The first renderer uses the portrait and CSS motion. A later Rive renderer can map the same states to Rive state-machine inputs without changing chat logic.

### Existing `AppuChatWidget`

The existing component remains the source of interaction truth. It passes semantic state changes to `useAppuCharacter`:

- Opening for the first time triggers `welcome`.
- Input focus or non-empty composition triggers `listening`.
- Sending a message triggers `thinking`.
- Receiving a reply ends `thinking`.
- Audio start triggers `speaking`.
- Audio end, pause, mute, failure, or widget close ends `speaking`.
- XP milestones trigger `celebrate`.
- Recoverable chat or voice failure triggers `error`.
- Parent mode enables calm mode.

## Layout

### Desktop

- Add a character stage approximately 150–170 px tall beneath the chat header.
- Frame APPU from the chest or waist upward.
- Place a short status label beside or beneath the character.
- Keep the XP bar, message history, suggestions, and footer fully usable.
- Do not enlarge the overall widget beyond the current viewport-safe limits; reduce the message viewport instead.

### Mobile

- Reduce the stage to approximately 115–135 px.
- Keep the character centered and shorten status copy.
- Preserve touch targets of at least 44 px.
- Prevent horizontal overflow and keep the input visible above the mobile viewport edge.

### Closed launcher

- Keep the existing draggable circular launcher.
- Add a subtle idle float and a one-time greeting pulse.
- Pause decorative movement after the first interaction.

## Visual Behaviour

### `idle`

Subtle breathing, occasional blink cue, and minimal gaze movement. Motion remains calm so it does not compete with reading.

### `welcome`

One short wave/pulse and “Hi! Ready to learn?” status, then return to `idle`.

### `listening`

Slight forward movement with an attentive halo and “I’m listening” status.

### `thinking`

Gentle head tilt, moving idea dots, and “Let me think” status. This replaces the character’s static online presentation while the existing typing row remains in the conversation.

### `speaking`

Small mouth-area pulse, natural head emphasis, and audio waveform. This is a visual speech cue rather than phoneme-perfect lip sync.

### `encourage`

Warm green-gold glow, gentle nod, and reassuring copy. It must not use harsh red failure styling.

### `celebrate`

Short star burst or confetti, bright emphasis, and a congratulatory status. It lasts no longer than approximately 1.5 seconds.

### `error`

Calm pause with “Let’s try that again” status, followed by `idle`. Chat and fallback answers remain available.

## Voice Integration

The current Hugging Face APPU voice and browser speech-synthesis fallback remain unchanged.

The audio implementation will expose lifecycle callbacks:

```text
onVoiceStart
onVoiceEnd
onVoiceError
```

For generated audio, bind to `play`, `ended`, `pause`, and `error`. For browser speech synthesis, bind to the utterance `onstart`, `onend`, and `onerror` events.

Muting, closing the widget, or starting a new response stops current audio and returns the character to `idle`.

## Rive Upgrade Path

The implementation must not load an unrelated public Rive example.

When a production APPU `.riv` asset is supplied, it should expose equivalent inputs:

```text
stateNumber
welcomeTrigger
encourageTrigger
celebrateTrigger
errorTrigger
calmModeBoolean
```

The Rive runtime will be lazy-loaded only when the chat first opens. If loading fails, the portrait renderer remains active.

## Accessibility and Motion Safety

- Character animation is decorative and must not steal keyboard focus.
- The status label is visible text but will not repeatedly interrupt screen readers.
- `prefers-reduced-motion` disables breathing, floating, pulsing, and celebration movement.
- Closing the widget or hiding the browser tab pauses animation and audio.
- The portrait retains meaningful APPU alternative text.
- All current buttons retain keyboard and touch operation.

## Error Handling

- Character loading must never block chat.
- Voice API failure continues to browser speech synthesis.
- Complete voice failure returns the character to `idle` and leaves text responses usable.
- Chat API failure uses the existing fallback response and briefly shows the gentle `error` state.
- Missing character images fall back to the existing initials avatar.
- State timers are cleared when the component unmounts.

## Scope

### Included

- New character stage inside `AppuChatWidget`.
- State hook and renderer boundary.
- Portrait-based idle, welcome, listening, thinking, speaking, encouragement, celebration, and error behaviour.
- Voice lifecycle wiring.
- Responsive and reduced-motion styling.
- Tests for state transitions and fallback behaviour.

### Excluded

- Changes to `AppuSection` or unrelated landing-page sections.
- Changes to n8n workflow behaviour or message content.
- A freely rotatable 3D character.
- Continuous microphone recording or camera tracking.
- Phoneme-perfect lip sync.
- Creation of the final layered and rigged `.riv` character asset.

## Acceptance Criteria

1. The open chat presents APPU as a waist-up companion without covering its controls.
2. Input focus/composition, response waiting, and voice playback visibly produce listening, thinking, and speaking states.
3. Audio ending, muting, closing, and errors always return the character to a stable state.
4. The portrait fallback works without a `.riv` file or external animation runtime.
5. The widget remains responsive at 375 px and does not overflow horizontally.
6. Reduced-motion mode preserves all information without continuous animation.
7. Existing chat responses, voice generation, drag behaviour, Student/Parent mode, suggestions, XP, and early-access modal continue to work.
8. The build completes successfully after integration.

