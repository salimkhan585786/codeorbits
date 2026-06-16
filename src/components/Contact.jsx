import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ParallaxLayer from './ParallaxLayer';

const projectTypes = ['Web App', 'Mobile App', 'Android App', 'iOS App', 'Backend / API', 'Full-Stack', 'Other'];
const budgets = ['Under $5K', '$5K - $10K', '$10K - $25K', '$25K - $50K', '$50K+', 'Not Sure'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', type: '', budget: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setForm({ name: '', email: '', type: '', budget: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-[#050810]">
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[#050810]/80 to-[#050810]" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left - Invitation */}
          <div>
            <p className="font-mono text-xs text-[#00D4FF] tracking-[0.2em] mb-4">// LET'S TALK</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to orbit something{' '}
              <span className="text-gradient-cyber">great?</span>
            </h2>
            <p className="text-lg text-[#F0F4FF]/60 mb-10 leading-relaxed">
              Tell us your idea. We'll tell you how to build it.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border border-[#00D4FF]/20 flex items-center justify-center group-hover:border-[#00D4FF]/60 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="text-xs text-[#F0F4FF]/40">Email us</p>
                  <p className="font-mono text-sm text-[#F0F4FF]/80">hello@codeorbits.in</p>
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

            {/* Social links */}
            <div className="flex gap-4">
              {['LinkedIn', 'GitHub', 'Twitter'].map((s) => (
                <a key={s} href="#" className="px-5 py-2.5 border border-[#F0F4FF]/10 rounded-full text-xs text-[#F0F4FF]/60 hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all font-medium">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-[#0A1628]/60 backdrop-blur-sm border border-[#F0F4FF]/5 rounded-3xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name *"
                  required
                  className="w-full px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF] placeholder-[#F0F4FF]/30 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  required
                  className="w-full px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF] placeholder-[#F0F4FF]/30 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF]/60 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                >
                  <option value="">Project Type</option>
                  {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF]/60 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                >
                  <option value="">Budget Range</option>
                  {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project *"
                  required
                  rows={4}
                  className="w-full px-5 py-3.5 bg-[#050810] border border-[#F0F4FF]/10 rounded-xl text-sm text-[#F0F4FF] placeholder-[#F0F4FF]/30 focus:outline-none focus:border-[#00D4FF]/50 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Launch the Project 🚀'}
              </button>

              {success && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-3 text-[#00D4FF]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span className="font-display font-bold">Orbit initiated! We'll be in touch.</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
