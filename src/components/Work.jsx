import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { projects as defaultProjects } from '../data/projects';
import ParallaxLayer from './ParallaxLayer';
import useSiteImages from '../hooks/useSiteImages';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  const numberRef = useRef(null);
  const expandWrapRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [expandHeight, setExpandHeight] = useState(0);

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

  useEffect(() => {
    if (!expanded || !expandWrapRef.current) return;
    setExpandHeight(expandWrapRef.current.scrollHeight);
    const lines = expandWrapRef.current.querySelectorAll('[data-line]');
    if (!lines.length) return;
    const timer = setTimeout(() => {
      gsap.fromTo(lines,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [expanded]);

  const handleToggleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      const el = expandWrapRef.current;
      if (el) setExpandHeight(el.scrollHeight);
      setExpanded(false);
    }
  };

  const descLong = project.desc && project.desc.length > 120;
  const descLines = project.desc ? project.desc.match(/[^.!?]+[.!?]+[\s]*/g) || [project.desc] : [];

  return (
    <div
      ref={cardRef}
      className="group relative rounded-3xl overflow-hidden border border-[#F0F4FF]/5 hover:border-[#00D4FF]/20 transition-all duration-500 flex flex-col md:flex-row"
    >
      <div
        ref={numberRef}
        className="absolute -top-10 -right-10 font-display font-bold text-[300px] text-white/5 pointer-events-none select-none z-0"
        style={{ lineHeight: 0.8 }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      <div ref={wrapperRef} className="relative w-full md:w-[60%] shrink-0 h-64 md:h-auto overflow-hidden"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        <div
          ref={imageRef}
          className="w-full h-full transition-transform duration-300"
          style={{ transform: 'scale(1.3)' }}
        >
          <img src={project.img} alt={`${project.title} - built by CodeOrbits Mumbai`} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center p-8 md:p-12 min-w-0">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#7B2FBE] uppercase mb-3">
          {project.category}
        </span>
        <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[#F0F4FF]">
          {project.title}
        </h3>
        <div className="mb-6">
          {descLong ? (
            <>
              {!expanded && (
                <p className="text-[#F0F4FF]/60 text-sm leading-relaxed line-clamp-3">{project.desc}</p>
              )}
              <div
                ref={expandWrapRef}
                className="overflow-hidden"
                style={{
                  maxHeight: expanded ? expandHeight + 'px' : '0px',
                  transition: 'max-height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <p className="text-[#F0F4FF]/60 text-sm leading-relaxed">
                  {descLines.map((line, i) => (
                    <span key={i} data-line className="inline">{line}</span>
                  ))}
                </p>
              </div>
              <button onClick={handleToggleExpand} className="text-[10px] font-mono text-[#00D4FF] mt-1 hover:underline">
                {expanded ? 'See less' : 'See more'}
              </button>
            </>
          ) : (
            <p className="text-[#F0F4FF]/60 text-sm leading-relaxed">{project.desc}</p>
          )}
        </div>
        {project.metric && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full text-[#00D4FF] text-sm font-mono w-fit mb-5">
            {project.metric}
          </div>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#00D4FF] text-[#050810] hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all w-fit">
            Visit
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
            </svg>
          </a>
        )}
      </div>

      <ClipReveal wrapperRef={wrapperRef} imageRef={imageRef} cardRef={cardRef} index={index} />
    </div>
  );
}

function ClipReveal({ wrapperRef, imageRef, cardRef, index }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    const trigger = cardRef.current;
    if (!wrapper || !image || !trigger) return;

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        delay: index * 0.3,
        scrollTrigger: {
          trigger,
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
          trigger,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [wrapperRef, imageRef, cardRef, index]);

  return null;
}

const projectImgMap = { paysphere: 'project-paysphere', quickhire: 'project-quickhire', shoporbit: 'project-shaborbit', mediconnect: 'project-mediconnect' };

export default function Work() {
  const images = useSiteImages();
  const [firestoreProjects, setFirestoreProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'selected-work'));
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const visible = items.filter(i => i.visible !== false);
        visible.sort((a, b) => (a.order || 0) - (b.order || 0));
        setFirestoreProjects(visible);
      } catch (err) {
        console.error('Failed to load selected work:', err);
      }
    })();
  }, []);

  const projects = firestoreProjects.length > 0
    ? firestoreProjects
    : defaultProjects.map(p => ({ ...p, img: images[projectImgMap[p.id]] || p.img }));

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
