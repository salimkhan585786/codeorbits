import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import { testimonialsData as defaultTestimonials } from '../data/testimonials';
import ParallaxLayer from './ParallaxLayer';
import AnimatedText from './AnimatedText';
import useSiteImages from '../hooks/useSiteImages';

const rotations = ['rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[0.5deg]'];

const avatarMap = { 1: 'avatar-rahul', 2: 'avatar-priya', 3: 'avatar-arun', 4: 'avatar-sneha', 5: 'avatar-vikram', 6: 'avatar-neha' };

export default function Testimonials() {
  const sectionRef = useRef(null);
  const images = useSiteImages();
  const testimonialsData = defaultTestimonials.map(t => ({ ...t, avatar: images[avatarMap[t.id]] || t.avatar }));
  const cardsRef = useRef([]);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  // Item 14: Staggered float-in
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { x: -100, y: 60, rotate: -8, opacity: 0 },
        {
          x: 0, y: 0, rotate: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Item 15: Floating orb mouse parallax
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(pointer: coarse)').matches) return;

    const handleMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${dx * 30}px, ${dy * 30}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-dx * 20}px, ${-dy * 20}px)`;
      }
    };

    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.1} className="absolute inset-0">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${images['testimonials-bg']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.8} className="absolute inset-0 pointer-events-none">
        <div ref={orb1Ref} className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00D4FF]/10 blur-[100px] transition-transform duration-300" />
        <div ref={orb2Ref} className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#7B2FBE]/10 blur-[120px] transition-transform duration-300" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4"><AnimatedText text="// TESTIMONIALS" type="chars" stagger={40} /></p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            What Clients <span className="text-gradient-cyber">Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {testimonialsData.map((t, index) => {
            const rotClass = rotations[index % rotations.length];

            return (
              <div
                key={t.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`group relative p-8 sm:p-10 bg-[#0A1628]/30 border border-slate-900 rounded-[2.5rem] backdrop-blur-md transition-all duration-500 select-text shadow-xl hover:border-cyan-400/20 hover:-translate-y-2 hover:bg-[#0A1628]/45 hover:rotate-0 ${rotClass}`}
              >
                <span className="absolute top-6 right-8 text-cyan-500/10 group-hover:text-cyan-500/25 transition-all duration-500">
                  <Quote size={52} className="stroke-[1.5]" />
                </span>

                <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed mb-8 italic font-light relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-800/60">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-12 h-12 rounded-full ring-2 ring-cyan-500/10 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-display font-semibold text-white text-sm sm:text-base">
                      {t.author}
                    </h4>
                    <p className="font-mono text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      {t.company}
                    </p>
                  </div>
                </div>

                <span className="absolute bottom-0 left-12 right-12 h-[2px] bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
