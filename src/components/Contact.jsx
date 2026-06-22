import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ParallaxLayer from './ParallaxLayer';
import AnimatedText from './AnimatedText';
import useSiteImages from '../hooks/useSiteImages';
import SuccessOverlay from './SuccessOverlay';

const projectTypes = ['Web App', 'Mobile App', 'Android App', 'iOS App', 'Backend / API', 'Full-Stack', 'Other'];
const budgets = ['Under \u20B95K', '\u20B95K - \u20B910K', '\u20B910K - \u20B925K', '\u20B925K - \u20B950K', '\u20B950K+', 'Not Sure'];

function ScrambleText({ text }) {
  const ref = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done) return;

    const chars = '!@#$%^&*<>?/|{}[]ABCDEFabcdef0123456789';
    const original = text;
    const len = original.length;
    let frame;
    let resolved = 0;
    const totalFrames = 40;

    const scramble = () => {
      const arr = original.split('').map((char, i) => {
        if (i < resolved) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      });
      el.textContent = arr.join('');
    };

    let count = 0;
    const interval = setInterval(() => {
      scramble();
      count++;
      if (count % 5 === 0 && resolved < len) {
        resolved++;
      }
      if (resolved >= len) {
        el.textContent = original;
        clearInterval(interval);
        setDone(true);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [text, done]);

  return <span ref={ref}>{text}</span>;
}

export default function Contact() {
  const images = useSiteImages();
  const [form, setForm] = useState({ name: '', email: '', type: '', budget: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scrambleDone, setScrambleDone] = useState(false);
  const formRef = useRef(null);
  const btnRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrambleActive, setScrambleActive] = useState(false);

  // Item 16: Trigger scramble on section enter
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrambleActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...form,
        createdAt: serverTimestamp(),
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          title: form.type || 'New Enquiry',
          name: form.name,
          email: form.email,
          message: `${form.message}\n\nBudget: ${form.budget || 'Not specified'}\nEmail: ${form.email}`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setForm({ name: '', email: '', type: '', budget: '', message: '' });
      setSuccess(true);
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetSuccess = () => {
    setSuccess(false);
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${images['contact-bg']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[#050810]/80 to-[#050810]" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {success ? (
          <SuccessOverlay onDismiss={resetSuccess} />
        ) : (
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4">
                <AnimatedText text="// LET'S TALK" type="chars" stagger={40} />
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {scrambleActive ? (
                  <>
                    <ScrambleText text="Hire a Web Developer in Mumbai" />{' '}
                    <span className="text-gradient-cyber"><ScrambleText text="today?" /></span>
                  </>
                ) : (
                  <>
                    Hire a Web Developer in Mumbai{' '}
                    <span className="text-gradient-cyber">today?</span>
                  </>
                )}
              </h2>
              <p className="text-lg text-[#F0F4FF]/60 mb-10 leading-relaxed">
                Looking for a reliable development partner in Mumbai? Let&apos;s talk.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-[#00D4FF]/20 flex items-center justify-center group-hover:border-[#00D4FF]/60 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#F0F4FF]/40 mb-1">Email us at</p>
                    <div className="flex flex-col gap-1">
                      <a href="mailto:contact@codeorbits.in" className="font-mono text-sm text-[#F0F4FF]/80 hover:text-[#00D4FF] transition-colors">contact@codeorbits.in</a>
                      <a href="mailto:support@codeorbits.in" className="font-mono text-sm text-[#F0F4FF]/80 hover:text-[#00D4FF] transition-colors">support@codeorbits.in</a>
                      <a href="mailto:salim@codeorbits.in" className="font-mono text-sm text-[#F0F4FF]/80 hover:text-[#00D4FF] transition-colors">salim@codeorbits.in</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-[#00D4FF]/20 flex items-center justify-center group-hover:border-[#00D4FF]/60 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#F0F4FF]/40">Visit us</p>
                    <p className="font-mono text-sm text-[#F0F4FF]/80">codeorbits.in</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/salim-khan-41906b286/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[#F0F4FF]/10 rounded-full text-xs text-[#F0F4FF]/60 hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all font-medium">
                  LinkedIn
                </a>
                <a href="https://github.com/salimkhan585786" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[#F0F4FF]/10 rounded-full text-xs text-[#F0F4FF]/60 hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all font-medium">
                  GitHub
                </a>
                <a href="https://wa.me/917021414700" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[#F0F4FF]/10 rounded-full text-xs text-[#F0F4FF]/60 hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all font-medium">
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-[#0A1628]/60 backdrop-blur-sm border border-[#F0F4FF]/5 rounded-3xl p-8 md:p-10">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <InputField name="name" value={form.name} onChange={handleChange} placeholder="Your Name *" required />
                <InputField name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *" required />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF]/60 focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300"
                  >
                    <option value="">Project Type</option>
                    {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF]/60 focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300"
                  >
                    <option value="">Budget Range</option>
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project *"
                  required
                  rows={4}
                  className="w-full px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF] placeholder-[#F0F4FF]/30 focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300 resize-none"
                />
                <button
                  ref={btnRef}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 36 36" className="animate-spin">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="2" opacity="0.4"/>
                        <circle cx="18" cy="2" r="3" fill="white"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Launch the Project'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InputField({ name, type = 'text', value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={focused ? '' : placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF] placeholder-[#F0F4FF]/30 focus:outline-none transition-all duration-300"
        style={{
          borderColor: focused ? '#00D4FF' : 'rgba(240,244,255,0.1)',
          boxShadow: focused ? '0 0 0 1px rgba(0,212,255,0.3)' : 'none',
        }}
      />
      {focused && (
        <span className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
          style={{
            border: '1px solid rgba(0,212,255,0.5)',
            animation: 'border-draw 0.4s ease-out forwards',
          }}
        />
      )}
      {focused && (
        <label className="absolute -top-2.5 left-3 px-1 text-[10px] text-[#00D4FF] bg-[#050810] font-mono transition-all duration-200">
          {placeholder.replace(' *', '')}
        </label>
      )}
    </div>
  );
}
