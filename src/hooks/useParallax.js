import { useEffect } from 'react';

export default function useParallax() {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
          document.documentElement.style.setProperty('--scroll-y-px', `${scrollY}px`);
          // Per-section parallax offset
          document.querySelectorAll('[data-parallax-section]').forEach((section) => {
            const rect = section.getBoundingClientRect();
            const offset = rect.top + scrollY;
            section.style.setProperty('--section-scroll', `${scrollY - offset}px`);
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
