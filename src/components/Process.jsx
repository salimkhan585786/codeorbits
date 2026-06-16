import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ParallaxLayer from './ParallaxLayer';
import AnimatedText from './AnimatedText';

const steps = [
  { num: '01', title: 'Discovery', desc: 'We learn your business deeply before writing a single line of code.' },
  { num: '02', title: 'Architecture', desc: 'System design, tech stack decisions, and scalability planning.' },
  { num: '03', title: 'Build', desc: 'Agile sprints, weekly demos, and real transparency throughout.' },
  { num: '04', title: 'QA & Polish', desc: 'Cross-device testing, performance audits, and UX refinements.' },
  { num: '05', title: 'Deploy', desc: 'Launch, monitor, iterate. We stay with you post-launch.' },
];

export default function Process() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const dotRefs = useRef([]);
  const contentRefs = useRef([]);
  const numberRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const ctx = gsap.context(() => {
      // Item 12: Line draw
      gsap.fromTo(line, { width: '0%' }, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      // Item 13: Dot/circle activation + number fade
      const numSteps = steps.length;
      const sectionHeight = section.offsetHeight;
      const dotStart = 0.1;
      const dotRange = 0.8 / numSteps;

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const start = dotStart + i * dotRange;
        const end = start + dotRange;

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${sectionHeight * start} bottom`,
          end: `top+=${sectionHeight * end} bottom`,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const active = p > 0.3;
            dot.style.background = active ? '#00D4FF' : '#050810';
            dot.style.boxShadow = active ? '0 0 15px #00D4FF' : 'none';
            dot.style.transform = active ? 'scale(1.5)' : 'scale(1)';
          },
        });
      });

      numberRefs.current.forEach((num, i) => {
        if (!num) return;
        const start = dotStart + i * dotRange;
        const end = start + dotRange;

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${sectionHeight * start} bottom`,
          end: `top+=${sectionHeight * end} bottom`,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.3) {
              num.style.opacity = '0.25';
              num.style.transform = 'scale(1.05)';
            } else {
              num.style.opacity = '0.05';
              num.style.transform = 'scale(1)';
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative py-32 overflow-hidden bg-[#0A1628]">
      <div className="absolute inset-0 flex">
        <ParallaxLayer speed={0.2} className="w-1/2">
          <div className="h-full opacity-30"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=960&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.15} className="w-1/2">
          <div className="h-full opacity-20"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=960&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </ParallaxLayer>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/80 via-[#0A1628]/60 to-[#0A1628]/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4"><AnimatedText text="// OUR PROCESS" type="chars" stagger={40} /></p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            How We <span className="text-gradient-cyber">Orbit</span>
          </h2>
        </div>

        <div className="hidden lg:block relative">
          <div
            ref={lineRef}
            className="absolute top-16 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#00D4FF]/20 via-[#7B2FBE]/40 to-[#00D4FF]/20"
            style={{ width: '0%' }}
          />

          <div className="grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center group">
                <div
                  ref={(el) => (dotRefs.current[i] = el)}
                  className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050810] border-2 border-[#00D4FF] transition-all duration-300 z-10"
                />
                <div
                  ref={(el) => (numberRefs.current[i] = el)}
                  className="font-display text-[120px] font-bold text-outline opacity-[0.05] leading-none mb-4 transition-all duration-300"
                >
                  {s.num}
                </div>
                <div ref={(el) => (contentRefs.current[i] = el)}>
                  <h3 className="font-display text-xl font-bold mb-3 text-[#F0F4FF]">{s.title}</h3>
                  <p className="text-sm text-[#F0F4FF]/50 leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden space-y-12">
          {steps.map((s, i) => (
            <div key={s.num} className="relative pl-10 border-l border-[#00D4FF]/20 group">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-[#050810] border-2 border-[#00D4FF] group-hover:shadow-[0_0_10px_#00D4FF] transition-shadow" />
              <div className="font-display text-5xl font-bold text-outline opacity-30 mb-2">{s.num}</div>
              <h3 className="font-display text-xl font-bold mb-2 text-[#F0F4FF]">{s.title}</h3>
              <p className="text-sm text-[#F0F4FF]/50 max-w-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
