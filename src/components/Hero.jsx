import { useEffect, useState } from 'react';
import ParallaxLayer from './ParallaxLayer';
import useMouseParallax from '../hooks/useMouseParallax';

const Counter = ({ label, target, prefix = '', suffix = '' }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-display font-bold text-[#00D4FF]">
      {prefix}{target}{suffix}
    </div>
    <div className="text-xs md:text-sm text-[#F0F4FF]/50 mt-1 uppercase tracking-widest font-medium">{label}</div>
  </div>
);

export default function Hero() {
  const mouseRef = useMouseParallax(20);
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const counters = [
    { label: 'Projects Delivered', target: 50, suffix: '+' },
    { label: 'Happy Clients', target: 30, suffix: '+' },
    { label: 'Years in Orbit', target: 5, suffix: '+' },
    { label: 'Platforms', target: 4, prefix: '' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050810]">
      {/* Layer 0 - Static BG */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Layer 1 - Deep star field */}
      <ParallaxLayer speed={0.1} className="absolute inset-0">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      {/* Layer 2 - Blue light streaks */}
      <ParallaxLayer speed={0.3} className="absolute inset-0">
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      {/* Layer 3 - Planet sphere */}
      <ParallaxLayer speed={0.6} className="absolute inset-0 flex items-center justify-end overflow-hidden">
        <div className="relative w-[500px] md:w-[600px] h-[500px] md:h-[600px] -mr-48 md:-mr-32 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80"
            alt=""
            className="w-full h-full object-cover rounded-full animate-float"
            loading="lazy"
          />
        </div>
      </ParallaxLayer>

      {/* Layer 3b - Orbit rings */}
      <ParallaxLayer speed={0.5} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] orbit-ring" style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] orbit-ring" style={{ animationDuration: '14s', borderColor: 'rgba(123,47,190,0.2)' }}>
          <span className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-[#7B2FBE] rounded-full shadow-[0_0_10px_#7B2FBE]" />
        </div>
      </ParallaxLayer>

      {/* Floating badge */}
      <ParallaxLayer speed={1.4} className="absolute top-24 right-6 md:right-12 z-10">
        <div className="hidden md:block px-4 py-2 border border-[#00D4FF]/20 rounded-full bg-[#050810]/60 backdrop-blur-sm">
          <span className="font-mono text-xs text-[#00D4FF]">codeorbits.in</span>
        </div>
      </ParallaxLayer>

      {/* Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-24 pb-8" ref={mouseRef}>
        <div className="max-w-4xl">
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="font-mono text-sm text-[#00D4FF] mb-6 tracking-widest">
              <span className="text-[#7B2FBE]">&gt;</span> FULL-STACK DIGITAL AGENCY
            </p>
            <h1 className="font-display font-bold leading-[0.95] mb-8">
              <span className="text-6xl md:text-8xl lg:text-[96px] text-[#F0F4FF] block">We Build</span>
              <span className="text-6xl md:text-8xl lg:text-[96px] text-outline block">Digital</span>
              <span className="text-6xl md:text-8xl lg:text-[96px] text-gradient-cyber block">Universes</span>
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

          {/* Counter Row */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-20 pt-10 border-t border-[#F0F4FF]/10 transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {counters.map((c) => (
              <Counter key={c.label} {...c} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ParallaxLayer speed={1.2} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#00D4FF] animate-pulse-glow" />
          <span className="font-mono text-[10px] text-[#F0F4FF]/30 tracking-widest uppercase">Scroll to explore</span>
        </div>
      </ParallaxLayer>
    </section>
  );
}
