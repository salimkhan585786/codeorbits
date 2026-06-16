import ParallaxLayer from './ParallaxLayer';

export default function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden" style={{ background: '#0A1628' }}>
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-transparent to-[#0A1628]" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4">// WHAT WE DO</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
              We exist for one reason — to make your{' '}
              <span className="text-gradient-cyber">software unstoppable</span>.
            </h2>
            <p className="text-[#F0F4FF]/60 leading-relaxed mb-6 text-lg">
              CodeOrbits brings together design, engineering, and strategy under one roof.
              From concept to deployment, across web, mobile, Android, and iOS — we build
              products that move businesses forward.
            </p>
          </div>

          <div className="relative h-[600px] hidden md:block">
            <div className="absolute top-0 right-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-[#00D4FF]/10 parallax-slow" style={{ transform: 'translateY(calc(var(--scroll-y,0px) * -0.08))' }}>
              <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80" alt="Developer" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute top-20 left-0 w-72 h-80 rounded-2xl overflow-hidden shadow-2xl border border-[#7B2FBE]/10 z-10 parallax-mid" style={{ transform: 'translateY(calc(var(--scroll-y,0px) * -0.15))' }}>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" alt="Team meeting" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute bottom-0 right-10 w-80 h-64 rounded-2xl overflow-hidden shadow-2xl border border-[#00D4FF]/10 parallax-fast" style={{ transform: 'translateY(calc(var(--scroll-y,0px) * -0.22))' }}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" alt="Modern office" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
