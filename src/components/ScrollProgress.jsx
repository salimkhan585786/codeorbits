import { useEffect, useRef, useState } from 'react';

const sections = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(p);

      // Determine active section
      let active = -1;
      sections.forEach((s, i) => {
        const el = document.querySelector(s.href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            active = i;
          }
        }
      });
      setActiveIdx(active);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {/* Track */}
      <div className="relative w-[2px] h-[40vh] bg-[#F0F4FF]/10 rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#00D4FF] to-[#7B2FBE] rounded-full transition-all duration-150"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {/* Dots */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[40vh] flex flex-col justify-between">
        {sections.map((s, i) => (
          <div
            key={s.href}
            className="relative flex items-center"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              onClick={() => scrollTo(s.href)}
              className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                background: i === activeIdx ? '#00D4FF' : '#F0F4FF',
                opacity: i === activeIdx ? 1 : 0.3,
                boxShadow: i === activeIdx ? '0 0 10px #00D4FF' : 'none',
                transform: i === activeIdx ? 'scale(1.5)' : 'scale(1)',
              }}
            />
            {hovered === i && (
              <span className="absolute right-4 whitespace-nowrap text-[10px] font-mono text-[#00D4FF] bg-[#050810]/80 px-2 py-1 rounded border border-[#00D4FF]/20 transition-opacity">
                {s.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
