import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ParallaxLayer from './ParallaxLayer';
import useMouseParallax from '../hooks/useMouseParallax';
import useSiteImages from '../hooks/useSiteImages';

function animateCounter(el, target, duration, suffix) {
  let startTime = null;
  el.classList.add('counting');

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.classList.remove('counting');
    }
  };

  el.textContent = '0' + suffix;
  requestAnimationFrame(step);
}

export default function Hero() {
  const mouseRef = useMouseParallax(20);
  const [mounted, setMounted] = useState(false);
  const images = useSiteImages();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const weRef = useRef(null);
  const digitalRef = useRef(null);
  const universesRef = useRef(null);
  const planetRef = useRef(null);
  const galaxyRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counters = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const all = Array.from(counters);
            all.forEach((el, index) => {
              const target = parseInt(el.dataset.counter);
              const suffix = el.dataset.suffix || '';
              const duration = parseInt(el.dataset.duration) || 2000;
              if (prefersReduced) {
                el.textContent = target + suffix;
                return;
              }
              setTimeout(() => {
                animateCounter(el, target, duration, suffix);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Item 1: Letter split — "We Build Digital Universes"
      const h1 = headlineRef.current;
      if (h1) {
        const letters = h1.querySelectorAll('.hero-letter');
        tl.fromTo(
          letters,
          { opacity: 0, y: 80, rotateX: -90, filter: 'blur(8px)' },
          { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.025, ease: 'back.out(1.7)' }
        );
      }

      // Item 2: Hero text splits apart on scroll
      const hero = heroRef.current;
      if (hero && weRef.current && digitalRef.current && universesRef.current) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (weRef.current) {
              weRef.current.style.transform = `translateX(${-p * 200}px)`;
              weRef.current.style.opacity = 1 - p;
            }
            if (digitalRef.current) {
              digitalRef.current.style.transform = `translateY(${-p * 150}px)`;
              digitalRef.current.style.opacity = 1 - p;
            }
            if (universesRef.current) {
              universesRef.current.style.transform = `translateX(${p * 200}px)`;
              universesRef.current.style.opacity = 1 - p;
            }
          },
        });
      }

      // Planet scales and moves right
      if (planetRef.current) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
          onUpdate: (self) => {
            const p = self.progress;
            planetRef.current.style.transform = `scale(${1 + p * 0.8}) translateX(${p * 100}px)`;
          },
        });
      }

      // Galaxy zoom
      if (galaxyRef.current) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
          onUpdate: (self) => {
            const p = self.progress;
            galaxyRef.current.style.transform = `scale(${1 + p * 0.15})`;
          },
        });
      }
    });

    return () => ctx.revert();
  }, [mounted]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#050810]">
      <div className="absolute inset-0 bg-grid opacity-50" />

      <ParallaxLayer speed={0.1} className="absolute inset-0">
        <div ref={galaxyRef} className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${images['hero-galaxy']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.3} className="absolute inset-0">
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${images['hero-nebula']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.6} className="absolute inset-0 flex items-center justify-end overflow-hidden">
        <div ref={planetRef} className="relative w-[500px] md:w-[600px] h-[500px] md:h-[600px] -mr-48 md:-mr-32 opacity-40">
          <img
            src={images['hero-planet']}
            alt=""
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.5} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] orbit-ring" style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] orbit-ring" style={{ animationDuration: '14s', borderColor: 'rgba(123,47,190,0.2)' }}>
          <span className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-[#7B2FBE] rounded-full shadow-[0_0_10px_#7B2FBE]" />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={1.4} className="absolute top-24 right-6 md:right-12 z-10">
        <div ref={badgeRef} className="hidden md:block px-4 py-2 border border-[#00D4FF]/20 rounded-full bg-[#050810]/60 backdrop-blur-sm">
          <span className="font-mono text-xs text-[#00D4FF]">codeorbits.in</span>
        </div>
      </ParallaxLayer>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-24 pb-8" ref={mouseRef}>
        <div className="max-w-4xl">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-sm text-[#00D4FF] mb-6 tracking-widest">
              <span className="text-[#7B2FBE]">&gt;</span> FULL-STACK DIGITAL AGENCY
            </p>
            <h1 ref={headlineRef} className="font-display font-bold leading-[0.95] mb-8" style={{ perspective: '800px' }}>
              <span ref={weRef} className="text-6xl md:text-8xl lg:text-[96px] text-[#F0F4FF] block">
                {'We Build'.split('').map((c, i) => <span key={i} className="hero-letter inline-block">{c === ' ' ? '\u00A0' : c}</span>)}
              </span>
              <span ref={digitalRef} className="text-6xl md:text-8xl lg:text-[96px] text-outline block">
                {'Digital'.split('').map((c, i) => <span key={i} className="hero-letter inline-block">{c}</span>)}
              </span>
              <span ref={universesRef} className="text-6xl md:text-8xl lg:text-[96px] text-gradient-cyber block">
                Universes
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#F0F4FF]/60 mb-10 max-w-xl font-light leading-relaxed">
              Web • Mobile • Android • iOS — Delivered end-to-end.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-[#FF6B35] text-white font-bold rounded-full text-sm hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-300 glow-orange inline-flex items-center gap-2"
              >
                Start a Project <span className="text-lg">→</span>
              </a>
              <a
                href="#work"
                className="px-8 py-4 border border-[#F0F4FF]/20 text-[#F0F4FF]/80 font-medium rounded-full text-sm hover:border-[#00D4FF]/50 hover:text-[#00D4FF] transition-all duration-300"
              >
                See Our Work
              </a>
            </div>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-20 pt-10 border-t border-[#F0F4FF]/10 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-[#F0F4FF]">
                <span data-counter="50" data-suffix="+" data-duration="2000">0+</span>
              </div>
              <div className="text-xs md:text-sm text-[#F0F4FF]/50 mt-1 uppercase tracking-widest font-medium">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-[#F0F4FF]">
                <span data-counter="30" data-suffix="+" data-duration="1800">0+</span>
              </div>
              <div className="text-xs md:text-sm text-[#F0F4FF]/50 mt-1 uppercase tracking-widest font-medium">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-[#F0F4FF]">
                <span data-counter="5" data-suffix="+" data-duration="1500">0+</span>
              </div>
              <div className="text-xs md:text-sm text-[#F0F4FF]/50 mt-1 uppercase tracking-widest font-medium">Years in Orbit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-[#F0F4FF]">
                <span data-counter="4" data-suffix="" data-duration="1200">0</span>
              </div>
              <div className="text-xs md:text-sm text-[#F0F4FF]/50 mt-1 uppercase tracking-widest font-medium">Platforms</div>
            </div>
          </div>
        </div>
      </div>

      <ParallaxLayer speed={1.2} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#00D4FF] animate-pulse-glow" />
          <span className="font-mono text-[10px] text-[#F0F4FF]/30 tracking-widest uppercase">Scroll to explore</span>
        </div>
      </ParallaxLayer>
    </section>
  );
}
