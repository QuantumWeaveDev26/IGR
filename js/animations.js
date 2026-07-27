/* Motion layer: decorative only; app.js retains all functional interactions. */
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

  initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.ScrollTrigger.create({
      start: 40,
      onToggle: ({ isActive }) => nav.classList.toggle('scrolled', isActive),
    });
  }

  initHeroReveal() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const parts = hero.querySelectorAll('.section-tag, h1, .hero-sub, .hero-checkmarks, .hero-cta-group');
    this.gsap.from(parts, { y: 28, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'all' });
  }

  initSectionReveals() {
    document.querySelectorAll('.feature-card, .stat-card, .step-card, .testimonial-card, .faq-item').forEach((item) => {
      this.gsap.from(item, {
        y: 30, opacity: 0, duration: 0.55, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      });
    });
    document.querySelectorAll('.stat-number').forEach((stat) => this.animateStat(stat));
  }

  animateStat(stat) {
    const text = stat.textContent.trim();
    const match = text.match(/-?\d+(?:\.\d+)?/);
    if (!match) return;
    const value = Number(match[0]);
    const prefix = text.slice(0, match.index);
    const suffix = text.slice((match.index || 0) + match[0].length);
    window.ScrollTrigger.create({
      trigger: stat, start: 'top 85%', once: true,
      onEnter: () => this.gsap.to({ value: 0 }, { value, duration: 1.1, ease: 'power2.out', onUpdate() { stat.textContent = `${prefix}${Math.round(this.targets()[0].value)}${suffix}`; } }),
    });
  }

  initMagneticButtons() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.btn').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const box = button.getBoundingClientRect();
        this.gsap.to(button, { x: (event.clientX - box.left - box.width / 2) * 0.12, y: (event.clientY - box.top - box.height / 2) * 0.12, duration: 0.25, ease: 'power2.out' });
      });
      button.addEventListener('pointerleave', () => this.gsap.to(button, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' }));
    });
  }
}

window.IGrAnimations = IGrAnimations;
document.addEventListener('DOMContentLoaded', () => new IGrAnimations());
