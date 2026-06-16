import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { projects as defaultProjects } from '../data/projects';
import ParallaxLayer from './ParallaxLayer';
import useSiteImages from '../hooks/useSiteImages';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  const numberRef = useRef(null);
  const btnRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [mouseNear, setMouseNear] = useState(false);

  // Item 11: Magnetic button
  const handleBtnMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const pull = 1 - dist / 100;
      setBtnPos({ x: dx * pull * 0.4, y: dy * pull * 0.4 });
      setMouseNear(true);
    } else {
      setBtnPos({ x: 0, y: 0 });
      setMouseNear(false);
    }
  };

  // Item 10: Giant number scrub
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const num = numberRef.current;
    if (!num) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          num.style.transform = `translateY(${-p * 200}px)`;
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleBtnMove}
      onMouseLeave={() => { setBtnPos({ x: 0, y: 0 }); setMouseNear(false); }}
      className="group relative min-h-[450px] rounded-3xl overflow-hidden border border-[#F0F4FF]/5 hover:border-[#00D4FF]/20 transition-all duration-500"
    >
      {/* Item 10: Giant project number */}
      <div
        ref={numberRef}
        className="absolute -top-10 -right-10 font-display font-bold text-[300px] text-white/5 pointer-events-none select-none z-0"
        style={{ lineHeight: 0.8 }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Item 9: Clip-path curtain reveal */}
      <div ref={wrapperRef} className="absolute inset-0 md:right-[40%] overflow-hidden"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        <div
          ref={imageRef}
          className="w-full h-full transition-transform duration-300"
          style={{ transform: 'scale(1.3)' }}
        >
          <img src={project.img} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/60 to-transparent md:bg-gradient-to-r md:from-[#050810] md:via-[#050810]/40 md:to-transparent" />
        </div>
      </div>

      <div className="relative z-10 min-h-[450px] md:ml-[60%] flex flex-col justify-center p-8 md:p-12">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#7B2FBE] uppercase mb-3">
          {project.category}
        </span>
        <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[#F0F4FF]">
          {project.title}
        </h3>
        <p className="text-[#F0F4FF]/60 text-sm leading-relaxed mb-6">
          {project.desc}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full text-[#00D4FF] text-sm font-mono mb-8">
          {project.metric}
        </div>

        {/* Item 11: Magnetic circular button */}
        <div className="relative inline-block">
          <a
            ref={btnRef}
            href="#contact"
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF6B35] text-white text-xs font-bold transition-all duration-200"
            style={{
              transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
              boxShadow: mouseNear ? '0 0 30px rgba(255,107,53,0.5)' : 'none',
            }}
          >
            View →
          </a>
        </div>
      </div>

      {/* GSAP clip reveal trigger */}
      <ClipReveal wrapperRef={wrapperRef} imageRef={imageRef} index={index} />
    </div>
  );
}

function ClipReveal({ wrapperRef, imageRef, index }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    if (!wrapper || !image) return;

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        delay: index * 0.3,
        scrollTrigger: {
          trigger: wrapper.closest('[class*="min-h"]') || wrapper,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      gsap.to(image, {
        scale: 1,
        duration: 1.2,
        ease: 'power4.inOut',
        delay: index * 0.3,
        scrollTrigger: {
          trigger: wrapper.closest('[class*="min-h"]') || wrapper,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [wrapperRef, imageRef, index]);

  return null;
}

const projectImgMap = { paysphere: 'project-paysphere', quickhire: 'project-quickhire', shoporbit: 'project-shaborbit', mediconnect: 'project-mediconnect' };

export default function Work() {
  const images = useSiteImages();
  const projects = defaultProjects.map(p => ({ ...p, img: images[projectImgMap[p.id]] || p.img }));

  return (
    <section id="work" className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${images['work-bg']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-outline">
            Selected Work
          </h2>
        </div>

        <div className="space-y-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
