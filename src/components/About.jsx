import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ParallaxLayer from './ParallaxLayer';
import AnimatedText from './AnimatedText';
import useSiteImages from '../hooks/useSiteImages';

export default function About() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const images = useSiteImages();
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Item 5: Enhanced stacked image parallax
      const imgs = [img1Ref.current, img2Ref.current, img3Ref.current].filter(Boolean);
      if (imgs.length === 3) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(imgs[0], { y: -120 * p, rotation: -2 + 2 * p, overwrite: 'auto' });
            gsap.set(imgs[1], { y: -60 * p, scale: 0.95 + 0.05 * p, overwrite: 'auto' });
            gsap.set(imgs[2], { y: -180 * p, rotation: 2 - 2 * p, overwrite: 'auto' });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [hovered, setHovered] = useState(null);

  const handleImgHover = (idx) => {
    setHovered(idx);
  };

  const handleImgLeave = () => {
    setHovered(null);
  };

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#0A1628' }}>
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${images['about-bg']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-transparent to-[#0A1628]" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4">
              <AnimatedText text="// WHAT WE DO" type="chars" stagger={40} />
            </p>
            <h2 ref={headlineRef} className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight flex flex-wrap items-baseline gap-x-1">
              <AnimatedText text="We exist for one reason — to make your" type="words" stagger={80} />
              <span className="text-gradient-cyber">
                software unstoppable
              </span>.
            </h2>
            <p className="text-[#F0F4FF]/60 leading-relaxed mb-6 text-lg">
              <AnimatedText text="CodeOrbits brings together design, engineering, and strategy under one roof. From concept to deployment, across web, mobile, Android, and iOS — we build products that move businesses forward." type="words" stagger={30} delay={800} />
            </p>
          </div>

          <div className="relative h-[600px] hidden md:block">
            {[
              { ref: img1Ref, src: images['about-1'], alt: 'Developer', cls: 'top-0 right-0 w-64 h-80', border: '#00D4FF', idx: 0 },
              { ref: img2Ref, src: images['about-2'], alt: 'Team meeting', cls: 'top-20 left-0 w-72 h-80 z-10', border: '#7B2FBE', idx: 1 },
              { ref: img3Ref, src: images['about-3'], alt: 'Modern office', cls: 'bottom-0 right-10 w-80 h-64', border: '#00D4FF', idx: 2 },
            ].map((img) => (
              <div
                key={img.idx}
                ref={img.ref}
                onMouseEnter={() => handleImgHover(img.idx)}
                onMouseLeave={handleImgLeave}
                className={`absolute ${img.cls} rounded-2xl overflow-hidden shadow-2xl border transition-all duration-500`}
                style={{
                  borderColor: hovered === img.idx ? '#00D4FF' : `${img.border}/10`,
                  zIndex: hovered === img.idx ? 20 : img.idx === 1 ? 10 : 0,
                  transform: `scale(${hovered === img.idx ? 1.05 : 1})`,
                  opacity: hovered !== null && hovered !== img.idx ? 0.6 : 1,
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
