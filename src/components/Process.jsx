import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ParallaxLayer from './ParallaxLayer';
import AnimatedText from './AnimatedText';
import useSiteImages from '../hooks/useSiteImages';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', title: 'Discovery', desc: 'We learn your business deeply before writing a single line of code.' },
  { num: '02', title: 'Architecture', desc: 'System design, tech stack decisions, and scalability planning.' },
  { num: '03', title: 'Build', desc: 'Agile sprints, weekly demos, and real transparency throughout.' },
  { num: '04', title: 'QA & Polish', desc: 'Cross-device testing, performance audits, and UX refinements.' },
  { num: '05', title: 'Deploy', desc: 'Launch, monitor, iterate. We stay with you post-launch.' },
];

function rectThresholds(trackEl, dotRefs) {
  if (!trackEl) return steps.map((_, i) => i / (steps.length - 1));
  const trackRect = trackEl.getBoundingClientRect();
  const trackH = trackRect.height;
  if (!trackH) return steps.map((_, i) => i / (steps.length - 1));
  return steps.map((_, i) => {
    const dot = dotRefs.current[i];
    if (!dot) return i / (steps.length - 1);
    const r = dot.getBoundingClientRect();
    return Math.min(1, Math.max(0, (r.top - trackRect.top + r.height / 2) / trackH));
  });
}

function renderStepStyles(progress, thresholds, dotRefs, numberRefs, contentRefs) {
  const p = progress;
  steps.forEach((_, i) => {
    const threshold = thresholds[i];
    const active = p >= threshold;

    const dot = dotRefs.current[i];
    if (dot) {
      gsap.to(dot, {
        scale: active ? 1.6 : 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
      dot.style.background = active
        ? 'linear-gradient(135deg, #00D4FF, #7B2FBE, #FF6B9D)'
        : '#0A1628';
      dot.style.boxShadow = active
        ? '0 0 14px rgba(0,212,255,0.7), 0 0 28px rgba(123,47,190,0.35), 0 0 46px rgba(255,107,157,0.2)'
        : '0 0 0px transparent';
      dot.style.borderColor = active ? '#00D4FF' : 'rgba(0,212,255,0.25)';
    }

    const num = numberRefs.current[i];
    if (num) {
      num.style.opacity = active ? '1' : '0.15';
      num.style.filter = active
        ? 'drop-shadow(0 0 18px rgba(0,212,255,0.45))'
        : 'none';
      num.style.textShadow = active
        ? '0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1)'
        : 'none';
      num.style.webkitTextStroke = active ? '2px #00D4FF' : '1.5px rgba(240,244,255,0.3)';
    }

    const content = contentRefs.current[i];
    if (content) {
      const title = content.querySelector('h3');
      const desc = content.querySelector('p');
      if (title) {
        title.style.color = active ? '#F0F4FF' : 'rgba(240,244,255,0.35)';
        title.style.textShadow = active
          ? '0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1)'
          : 'none';
      }
      if (desc) {
        desc.style.color = active ? 'rgba(240,244,255,0.75)' : 'rgba(240,244,255,0.2)';
      }
    }
  });
}

export default function Process() {
  const sectionRef = useRef(null);
  const images = useSiteImages();

  const desktopLineRef = useRef(null);
  const desktopTrackRef = useRef(null);
  const dDotRefs = useRef([]);
  const dNumberRefs = useRef([]);
  const dContentRefs = useRef([]);

  const mobileLineRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const mDotRefs = useRef([]);
  const mNumberRefs = useRef([]);
  const mContentRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const desktopThresholds = rectThresholds(desktopTrackRef.current, dDotRefs);
    const mobileThresholds = rectThresholds(mobileTrackRef.current, mDotRefs);

    const ctx = gsap.context(() => {
      const lines = [desktopLineRef.current, mobileLineRef.current].filter(Boolean);
      gsap.to(lines, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress;
            renderStepStyles(p, desktopThresholds, dDotRefs, dNumberRefs, dContentRefs);
            renderStepStyles(p, mobileThresholds, mDotRefs, mNumberRefs, mContentRefs);
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const timelineHeight = `${(steps.length - 1) * 220 + 40}px`;

  return (
    <section id="process" ref={sectionRef} className="relative py-32 overflow-hidden bg-[#0A1628]">
      <div className="absolute inset-0 flex">
        <ParallaxLayer speed={0.2} className="w-1/2">
          <div
            className="h-full opacity-30"
            style={{
              backgroundImage: `url(${images['process-bg-left']})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.15} className="w-1/2">
          <div
            className="h-full opacity-20"
            style={{
              backgroundImage: `url(${images['process-bg-right']})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </ParallaxLayer>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#0A1628]/70 to-[#0A1628]/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4">
            <AnimatedText text="// OUR PROCESS" type="chars" stagger={40} />
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            How We <span className="text-gradient-cyber">Orbit</span>
          </h2>
        </div>

        {/* Desktop vertical timeline */}
        <div className="hidden md:block relative max-w-2xl mx-auto">
          <div ref={desktopTrackRef} className="relative mx-auto" style={{ width: '2px' }}>
            {/* Inactive track background */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-px"
              style={{ height: timelineHeight, background: 'rgba(0,212,255,0.1)' }}
            />
            {/* Animated gradient progress line */}
            <div
              ref={desktopLineRef}
              className="absolute left-1/2 -translate-x-1/2 top-0 w-px"
              style={{
                height: '0%',
                background: 'linear-gradient(180deg, #00D4FF 0%, #7B2FBE 50%, #FF6B9D 100%)',
                boxShadow:
                  '0 0 10px rgba(0,212,255,0.5), 0 0 20px rgba(123,47,190,0.25), 0 0 40px rgba(255,107,157,0.1)',
              }}
            />

            {/* Step items */}
            <div className="relative">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className="relative flex items-center"
                  style={{ height: i === steps.length - 1 ? 'auto' : '220px' }}
                >
                  {/* Dot indicator */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      ref={(el) => (dDotRefs.current[i] = el)}
                      className="w-5 h-5 rounded-full border-2"
                      style={{ background: '#0A1628', borderColor: 'rgba(0,212,255,0.25)' }}
                    />
                  </div>

                  {/* Content - alternating left/right */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      i % 2 === 0
                        ? 'right-[calc(50%+40px)] text-right'
                        : 'left-[calc(50%+40px)] text-left'
                    }`}
                    style={{ width: '260px' }}
                  >
                    <div
                      ref={(el) => (dNumberRefs.current[i] = el)}
                      className="font-display text-[80px] font-bold leading-none mb-2"
                      style={{
                        opacity: 0.15,
                        WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1.5px rgba(240,244,255,0.3)',
                      }}
                    >
                      {s.num}
                    </div>
                    <div ref={(el) => (dContentRefs.current[i] = el)}>
                      <h3
                        className="font-display text-xl font-bold mb-2"
                        style={{ color: 'rgba(240,244,255,0.35)' }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: 'rgba(240,244,255,0.2)' }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden relative pl-10">
          <div
            className="absolute left-4 top-0 w-px"
            style={{ height: '100%', background: 'rgba(0,212,255,0.1)' }}
          />
          <div
            ref={mobileLineRef}
            className="absolute left-4 top-0 w-px"
            style={{
              height: '0%',
              background: 'linear-gradient(180deg, #00D4FF 0%, #7B2FBE 50%, #FF6B9D 100%)',
              boxShadow:
                '0 0 10px rgba(0,212,255,0.5), 0 0 20px rgba(123,47,190,0.25)',
            }}
          />

          <div ref={mobileTrackRef} className="space-y-16">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="absolute -left-6 top-2 z-10">
                  <div
                    ref={(el) => (mDotRefs.current[i] = el)}
                    className="w-4 h-4 rounded-full border-2"
                    style={{ background: '#0A1628', borderColor: 'rgba(0,212,255,0.25)' }}
                  />
                </div>

                <div
                  ref={(el) => (mNumberRefs.current[i] = el)}
                  className="font-display text-5xl font-bold leading-none mb-3"
                  style={{
                    opacity: 0.15,
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '1.5px rgba(240,244,255,0.3)',
                  }}
                >
                  {s.num}
                </div>
                <div ref={(el) => (mContentRefs.current[i] = el)}>
                  <h3
                    className="font-display text-lg font-bold mb-2"
                    style={{ color: 'rgba(240,244,255,0.35)' }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(240,244,255,0.2)' }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
