# Playful Learning-World Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing IGr landing page into a playful learning-world with reliable, accessible GSAP animation while preserving its structure and functionality.

**Architecture:** `index.html` remains the functional source of markup and integrations. `style.css` owns visual tokens, responsive layout, and presentation; `js/animations.js` owns guarded GSAP behavior; `js/app.js` keeps existing interaction handlers only.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, GSAP/ScrollTrigger, Lenis, Three.js.

## Global Constraints

- Preserve current HTML section order, IDs, forms, modal markup, links, n8n payloads, tabs, FAQ, and grade-selector behavior.
- Do not add APPU or any agent character/illustration to the hero.
- Do not add dependencies or product features.
- Support `prefers-reduced-motion` and mobile devices.

---

### Task 1: Establish safe animation ownership

**Files:**
- Modify: `js/animations.js`
- Modify: `js/app.js`

**Interfaces:**
- Produces: `window.IGrAnimations` initialized only when `window.gsap` and `window.ScrollTrigger` are present.
- Consumes: existing `.navbar`, `.hero-section`, `.feature-card`, `.stat-number`, `.step-card`, `.faq-item`, and `.btn` markup.

- [ ] **Step 1: Capture the current syntax baseline**

Run: `node --check js/animations.js`

Expected: failure identifies the malformed duplicate `mouseup` listener.

- [ ] **Step 2: Replace the animation initializer with guarded modules**

Implement the following public shape, keeping each method a no-op when its targets are absent:

```js
class IGrAnimations {
  constructor() {
    if (!window.gsap || !window.ScrollTrigger) return;
    this.gsap = window.gsap;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.gsap.registerPlugin(window.ScrollTrigger);
    this.initNavbar();
    if (!this.reduceMotion) {
      this.initHeroReveal();
      this.initSectionReveals();
      this.initMagneticButtons();
    }
  }
}
```

Remove the pinned hero timeline, duplicate listener, grain animation, and duplicate navbar ownership from `js/app.js`. Keep buttons, modals, tabs, FAQ, and grade logic unchanged.

- [ ] **Step 3: Verify JavaScript parses**

Run: `node --check js/animations.js; node --check js/app.js`

Expected: both commands exit with code 0.

### Task 2: Apply the learning-world design system

**Files:**
- Modify: `style.css`

**Interfaces:**
- Consumes: existing classes and IDs from `index.html`.
- Produces: responsive visual styling without requiring HTML structure changes.

- [ ] **Step 1: Define root tokens and responsive foundations**

Add and use variables for `--ink`, `--cream`, `--violet`, `--teal`, `--coral`, `--gold`, `--surface`, `--radius-lg`, and `--shadow-lift`. Apply a cream base, layered radial gradients, a 1200px content width, and `clamp()` typography.

- [ ] **Step 2: Restyle existing sections and controls**

Restyle `.navbar`, `.hero-section`, `.section-tag`, `.section-title`, `.btn-primary`, `.btn-whatsapp`, `.feature-card`, `.stat-card`, `.tab-content`, `.step-card`, `.testimonial-card`, `.faq-item`, and `.site-footer`. Use rounded tactile surfaces, violet primary CTA treatment, color-coded cards, and mobile-safe grids. Keep the hero abstract: decorative CSS shapes only; no APPU image or agent graphic.

- [ ] **Step 3: Add reduced-motion and touch fallbacks**

Add:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
@media (max-width: 720px) { .hero-grid, .parents-grid { grid-template-columns: 1fr; } }
```

### Task 3: Validate the full experience

**Files:**
- Verify: `index.html`, `style.css`, `js/app.js`, `js/animations.js`

- [ ] **Step 1: Run static checks**

Run: `node --check js/animations.js; node --check js/app.js`

Expected: both commands exit with code 0.

- [ ] **Step 2: Browser smoke-test existing flows**

At desktop and mobile widths, verify Book Free Call opens and closes its modal; WhatsApp links retain URLs; FAQ, quest tabs, grade chips, video modal, and early-access form remain interactive.

- [ ] **Step 3: Review accessibility and motion**

With reduced motion enabled, verify no scroll-pinned or hover-dependent behavior prevents use. Verify visible keyboard focus on buttons, links, FAQ questions, and modal close controls.

- [ ] **Step 4: Commit the focused change set**

Run: `git add index.html style.css js/app.js js/animations.js docs/superpowers && git commit -m "feat: redesign IGr landing page"

Expected: one commit containing only the landing-page redesign and its design documents.
