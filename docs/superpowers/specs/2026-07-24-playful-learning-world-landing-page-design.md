# Playful Learning-World Landing Page Design

## Goal

Refresh the IGr landing page into a playful, premium learning-world experience inspired by high-end editorial and Awwwards-style sites. The page must make the existing **Book Free Call** conversion path visually dominant.

## Scope and preservation rules

- Preserve the current `index.html` section order, content flow, IDs, forms, modal markup, outbound links, n8n integration, tabs, FAQ, and grade selector behavior.
- Preserve the existing Three.js canvas integration, while allowing presentation and performance adjustments that do not change its role.
- Do not add or remove product features, alter lead payloads, or change copy strategy. Work is limited to design, layout styling, asset presentation, and GSAP animation refactoring.

## Visual direction

### Brand world

Use a bright, tactile "Playful Learning-World" rather than a corporate tutor aesthetic:

- A warm cream base with a deep violet anchor and teal, coral, and gold as expressive accents.
- Rounded, layered surfaces that read as islands, quests, progress cards, and learning artifacts.
- Large, optimistic typography with intentional whitespace and stronger page rhythm.
- Do not add APPU or any agent character/illustration to the hero. Existing APPU artwork may remain available only in its current non-hero uses; no new character placement is part of this redesign.
- The primary CTA is a high-contrast violet button; WhatsApp remains visually secondary but accessible.

### Section treatment

- The hero becomes an immersive first scene with clearer headline hierarchy, APPU artwork, decorative world layers, benefits, and the primary CTA in the first viewport.
- Existing feature, parent-impact, gamification, process, testimonial, FAQ, and final-CTA sections remain in place but receive distinct background changes, richer card hierarchy, and intentional spacing.
- Cards become tactile quest tiles using color-coded icons, softer radii, layered shadows, and restrained hover depth.
- Existing WebGL objects remain ambient and are visually subordinated to readability.

## Motion design

- Use GSAP for a staged hero entrance, section reveals, quest-card staggers, stat count-ups, and button feedback.
- Motion supports hierarchy and progression; it must not block reading or create a long pinned-scroll interruption.
- Replace duplicate navbar scroll ownership with a single initializer.
- Guard all animation setup against missing DOM elements and unavailable animation libraries.
- Use `prefers-reduced-motion` to remove nonessential motion; limit cursor and WebGL-dependent effects to capable devices and fine pointers.

## Refactor boundaries

- Consolidate design tokens and section styling in `style.css`; eliminate presentation-only inline declarations where this can be done without changing behavior.
- Keep `js/app.js` responsible for functional interactions and `js/animations.js` dedicated to motion.
- Break animation setup into focused, independently guarded initializers.
- Fix existing animation syntax/initialization issues and remove conflicting navbar logic without changing interactive behavior.

## Verification

- Test desktop and mobile layouts.
- Confirm no JavaScript syntax or console errors.
- Confirm Book Free Call, WhatsApp links, discovery modal, early-access form, FAQ accordion, quest tabs, grade selector, and video modal still work.
- Confirm reduced-motion behavior and that the animation layer degrades safely when libraries are unavailable.
