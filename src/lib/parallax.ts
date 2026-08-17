import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallaxEffects(lenisInstance?: any) {
  const sceneItems = document.querySelectorAll('.scene-item');
  const parallaxStars = document.getElementById('parallax-stars');

  const getScaleFactor = () => Math.max(0.5, Math.min(window.innerWidth / 1200, 1));

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Finsweet Lottieflow Roadmap 3D Scene Parallax Motion (will-change: transform; transform: translate3d(...))
    sceneItems.forEach((item, index) => {
      const speed = (index + 1) * 35;
      gsap.to(item, {
        y: () => -speed * getScaleFactor(),
        ease: 'none',
        scrollTrigger: {
          trigger: item.parentElement || '#hero-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    if (parallaxStars) {
      gsap.to(parallaxStars, {
        y: () => 90 * getScaleFactor(),
        rotation: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  } else {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    const lerpFactor = 0.08;

    if (typeof lenisInstance !== 'undefined' && lenisInstance) {
      lenisInstance.on('scroll', (e: any) => {
        targetScroll = e.scroll;
      });
    } else {
      window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
      });
    }

    function renderParallax() {
      currentScroll += (targetScroll - currentScroll) * lerpFactor;
      const sf = getScaleFactor();

      sceneItems.forEach((item: any, idx) => {
        const speed = (idx + 1) * 0.08;
        item.style.transform = `translate3d(0vw, ${currentScroll * -speed * sf}px, 0px)`;
      });

      if (parallaxStars) {
        parallaxStars.style.transform = `translate3d(0, ${currentScroll * 0.1 * sf}px, 0) rotate(${currentScroll * 0.02}deg)`;
      }

      requestAnimationFrame(renderParallax);
    }

    requestAnimationFrame(renderParallax);
  }
}
