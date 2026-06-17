import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { services as defaultServices } from '../data/services';
import ParallaxLayer from './ParallaxLayer';
import AnimatedText from './AnimatedText';
import useSiteImages from '../hooks/useSiteImages';

function ServiceCard({ service, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const imageRef = useRef(null);
  const underlineRef = useRef(null);

  // Item 7: 3D tilt + inner parallax + glow
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.04)`;
    if (imageRef.current) {
      imageRef.current.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px) scale(1.1)`;
    }
    if (glowRef.current) {
      const gx = e.clientX - rect.left;
      const gy = e.clientY - rect.top;
      glowRef.current.style.left = `${gx}px`;
      glowRef.current.style.top = `${gy}px`;
      glowRef.current.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    if (imageRef.current) {
      imageRef.current.style.transform = 'translate(0, 0) scale(1)';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
    if (underlineRef.current) {
      underlineRef.current.style.transform = 'scaleX(0)';
      underlineRef.current.style.transformOrigin = 'right';
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.1s ease-out';
    if (underlineRef.current) {
      underlineRef.current.style.transform = 'scaleX(1)';
      underlineRef.current.style.transformOrigin = 'left';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="group relative h-72 rounded-2xl overflow-hidden border border-[#F0F4FF]/5 hover:border-[#00D4FF]/30 transition-all duration-500 cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Glow follower */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-20 w-40 h-40 rounded-full opacity-0 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }}
      />

      <div ref={imageRef} className="absolute inset-0 transition-transform duration-300">
        <img src={service.img} alt={`${service.title} services Mumbai`} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-[#050810]/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-8">
        <div className="mb-4 [&_svg]:relative [&_svg]:z-10" dangerouslySetInnerHTML={{ __html: service.icon }} />
        <h3 className="font-display text-xl font-bold mb-2 text-[#F0F4FF] group-hover:text-[#00D4FF] transition-colors relative inline-block">
          {service.title}
          {/* Item 8: Underline draw */}
          <span
            ref={underlineRef}
            className="absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-[#00D4FF] to-[#7B2FBE] transition-transform duration-400 ease-out"
            style={{ transform: 'scaleX(0)', transformOrigin: 'left', width: '100%' }}
          />
        </h3>
        <p className="text-sm text-[#F0F4FF]/50">{service.desc}</p>
      </div>
    </div>
  );
}

const serviceImgMap = { web: 'service-web', mobile: 'service-mobile', android: 'service-android', ios: 'service-ios', 'white-label': 'service-agency', api: 'service-api' };

export default function Services() {
  const gridRef = useRef(null);
  const images = useSiteImages();
  const services = defaultServices.map(s => ({ ...s, img: images[serviceImgMap[s.id]] || s.img }));

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = gridRef.current?.querySelectorAll('.service-card');
    if (!cards || !cards.length) return;

    const ctx = gsap.context(() => {
      // Item 6: Alternating entrance
      cards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -80 : 80;
        const fromRotateY = i % 2 === 0 ? 15 : -15;
        gsap.fromTo(
          card,
          { x: fromX, opacity: 0, rotateY: fromRotateY, y: 60 },
          {
            x: 0, opacity: 1, rotateY: 0, y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.15} className="absolute inset-0">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${images['services-bg-1']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.4} className="absolute inset-0">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${images['services-bg-2']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4"><AnimatedText text="// WHAT WE BUILD" type="chars" stagger={40} /></p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Web &amp; Mobile Development <span className="text-gradient-cyber">Services in Mumbai</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {services.map((s, i) => (
            <div key={s.id} className="service-card" style={{ transformStyle: 'preserve-3d' }}>
                <ServiceCard service={s} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
