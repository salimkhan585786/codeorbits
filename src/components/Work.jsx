import { useRef, useState } from 'react';
import { projects } from '../data/projects';
import ParallaxLayer from './ParallaxLayer';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="group relative min-h-[450px] rounded-3xl overflow-hidden border border-[#F0F4FF]/5 hover:border-[#00D4FF]/20 transition-all duration-500"
    >
      {/* Image side - 60% */}
      <div className="absolute inset-0 md:right-[40%] overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)` }}
        >
          <img src={project.img} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/60 to-transparent md:bg-gradient-to-r md:from-[#050810] md:via-[#050810]/40 md:to-transparent" />
        </div>
      </div>

      {/* Content side - 40% */}
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
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#F0F4FF]/80 hover:text-[#00D4FF] transition-colors group/link"
        >
          View Case Study →
        </a>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80)`,
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
