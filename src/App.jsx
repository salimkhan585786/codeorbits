import { useEffect, useState } from 'react';
import useParallax from './hooks/useParallax';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  useParallax();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <div className={`loading-screen ${loading ? '' : 'hide'}`}>
        <div className="text-center">
          <svg width="60" height="60" viewBox="0 0 36 36" className="mx-auto mb-6">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="18" cy="18" r="10" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.2"/>
            <circle cx="18" cy="2" r="3" fill="#00D4FF">
              <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <p className="font-display text-xl font-bold text-[#F0F4FF]">CodeOrbits</p>
          <p className="font-mono text-xs text-[#F0F4FF]/40 mt-2">Initializing orbit...</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <CustomCursor />
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Work />
        <Process />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
