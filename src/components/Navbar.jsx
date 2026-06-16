import { useState, useEffect } from 'react';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050810]/80 backdrop-blur-xl border-b border-[#00D4FF]/10 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6"/>
              <circle cx="18" cy="18" r="10" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.3"/>
              <circle cx="18" cy="2" r="3" fill="#00D4FF">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="4s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Code<span className="text-[#00D4FF]">Orbits</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[#F0F4FF]/60 hover:text-[#00D4FF] transition-colors font-medium tracking-wide">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-300">
            Start a Project
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-[#F0F4FF] p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0A1628]/95 backdrop-blur-xl border-t border-[#00D4FF]/10">
          <div className="flex flex-col p-6 gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg text-[#F0F4FF]/80 hover:text-[#00D4FF] transition-colors py-2">
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="mt-2 px-5 py-3 bg-[#FF6B35] text-white text-center font-bold rounded-full">
              Start a Project
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
