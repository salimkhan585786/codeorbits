import { useRef } from 'react';
import { services } from '../data/services';
import ParallaxLayer from './ParallaxLayer';

export default function Services() {
  return (
    <section id="services" className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.15} className="absolute inset-0">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.4} className="absolute inset-0">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4">// WHAT WE BUILD</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Our <span className="text-gradient-cyber">Services</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <a
              key={s.id}
              href="#contact"
              className="group relative h-72 rounded-2xl overflow-hidden border border-[#F0F4FF]/5 hover:border-[#00D4FF]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img src={s.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-[#050810]/40" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: s.icon }} />
                <h3 className="font-display text-xl font-bold mb-2 text-[#F0F4FF] group-hover:text-[#00D4FF] transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-[#F0F4FF]/50">{s.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
