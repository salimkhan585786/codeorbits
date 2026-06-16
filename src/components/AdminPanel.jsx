import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultImages = [
  { id: 'hero-planet', label: 'Hero Planet', section: 'Hero', url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80' },
  { id: 'hero-galaxy', label: 'Hero Galaxy', section: 'Hero', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80' },
  { id: 'hero-nebula', label: 'Hero Nebula', section: 'Hero', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80' },
  { id: 'about-bg', label: 'About Background', section: 'About', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
  { id: 'about-1', label: 'About - Developer', section: 'About', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80' },
  { id: 'about-2', label: 'About - Team', section: 'About', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' },
  { id: 'about-3', label: 'About - Office', section: 'About', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
  { id: 'services-bg-1', label: 'Services Background 1', section: 'Services', url: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1920&q=80' },
  { id: 'services-bg-2', label: 'Services Background 2', section: 'Services', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80' },
  { id: 'service-web', label: 'Service - Web Apps', section: 'Services', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80' },
  { id: 'service-mobile', label: 'Service - Mobile Apps', section: 'Services', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80' },
  { id: 'service-android', label: 'Service - Android', section: 'Services', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80' },
  { id: 'service-ios', label: 'Service - iOS', section: 'Services', url: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80' },
  { id: 'service-agency', label: 'Service - White-Label', section: 'Services', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80' },
  { id: 'service-api', label: 'Service - API & Backend', section: 'Services', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80' },
  { id: 'work-bg', label: 'Work Background', section: 'Work', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80' },
  { id: 'project-paysphere', label: 'Project - PaySphere', section: 'Work', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' },
  { id: 'project-quickhire', label: 'Project - QuickHire', section: 'Work', url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80' },
  { id: 'project-shaborbit', label: 'Project - ShopOrbit', section: 'Work', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' },
  { id: 'project-mediconnect', label: 'Project - MediConnect', section: 'Work', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
  { id: 'process-bg-left', label: 'Process Background Left', section: 'Process', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=960&q=80' },
  { id: 'process-bg-right', label: 'Process Background Right', section: 'Process', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=960&q=80' },
  { id: 'testimonials-bg', label: 'Testimonials Background', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80' },
  { id: 'avatar-rahul', label: 'Avatar - Rahul Mehta', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { id: 'avatar-priya', label: 'Avatar - Priya Sharma', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: 'avatar-arun', label: 'Avatar - Arun Nair', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80' },
  { id: 'avatar-sneha', label: 'Avatar - Sneha Patel', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' },
  { id: 'avatar-vikram', label: 'Avatar - Vikram Joshi', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { id: 'avatar-neha', label: 'Avatar - Neha Kapoor', section: 'Testimonials', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
  { id: 'contact-bg', label: 'Contact Background', section: 'Contact', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80' },
  { id: 'success-bg', label: 'Success Overlay Background', section: 'Contact', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80' },
];

const sections = ['All', 'Hero', 'About', 'Services', 'Work', 'Process', 'Testimonials', 'Contact'];

export default function AdminPanel() {
  const [enquiries, setEnquiries] = useState([]);
  const [images, setImages] = useState(defaultImages);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('enquiries');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sectionFilter, setSectionFilter] = useState('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const snap = await getDocs(collection(db, 'enquiries'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
        setEnquiries(data);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
      }

      try {
        const imgDoc = await getDoc(doc(db, 'site-images', 'main'));
        if (imgDoc.exists()) {
          const stored = imgDoc.data().images;
          if (Array.isArray(stored)) {
            setImages(stored);
          }
        }
      } catch (err) {
        console.error('Error fetching images:', err);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleImageChange = (id, url) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, url } : img));
  };

  const saveImages = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site-images', 'main'), {
        images,
        updatedAt: serverTimestamp(),
      });
      alert('Images saved!');
    } catch (err) {
      console.error('Error saving images:', err);
      alert('Failed to save.');
    }
    setSaving(false);
  };

  const deleteEnquiry = async (id) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      setEnquiries(prev => prev.filter(e => e.id !== id));
      setSelectedEnquiry(null);
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const formatDate = (ts) => {
    if (!ts?.seconds) return 'N/A';
    return new Date(ts.seconds * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#F0F4FF]">
      <nav className="sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur-xl border-b border-[#00D4FF]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 36 36" className="w-8 h-8">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6"/>
              <circle cx="18" cy="18" r="10" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.3"/>
              <circle cx="18" cy="2" r="3" fill="#00D4FF">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="4s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <span className="font-display font-bold text-lg">CodeOrbits <span className="text-[#00D4FF]">Admin</span></span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('enquiries')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'enquiries' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-[#F0F4FF]/50 hover:text-[#F0F4FF]'}`}>
              Enquiries ({enquiries.length})
            </button>
            <button onClick={() => setTab('images')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'images' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-[#F0F4FF]/50 hover:text-[#F0F4FF]'}`}>
              Images
            </button>
            <a href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-[#F0F4FF]/50 hover:text-[#FF6B35] transition-all">
              Back to Site
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#F0F4FF]/40 text-sm">Loading...</p>
          </div>
        )}

        {!loading && tab === 'enquiries' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl font-bold">Project Enquiries</h1>
              <span className="text-sm text-[#F0F4FF]/40">{enquiries.length} total</span>
            </div>

            {enquiries.length === 0 && (
              <div className="text-center py-20 text-[#F0F4FF]/40">
                <p className="text-lg mb-2">No enquiries yet</p>
                <p className="text-sm">Submissions from your contact form will appear here.</p>
              </div>
            )}

            <div className="grid gap-4">
              {enquiries.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEnquiry(selectedEnquiry?.id === e.id ? null : e)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedEnquiry?.id === e.id ? 'border-[#00D4FF]/40 bg-[#0A1628]' : 'border-[#F0F4FF]/5 bg-[#0A1628]/40 hover:border-[#F0F4FF]/10'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display font-bold text-lg">{e.name}</h3>
                        <span className="font-mono text-xs text-[#F0F4FF]/30">{e.email}</span>
                      </div>
                      <p className="text-sm text-[#F0F4FF]/50 line-clamp-2">{e.message}</p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="font-mono text-xs text-[#F0F4FF]/30 mb-2">{formatDate(e.createdAt)}</div>
                      <div className="flex gap-2 justify-end">
                        {e.type && <span className="px-2 py-1 rounded-full text-[10px] font-mono bg-[#7B2FBE]/20 text-[#7B2FBE] border border-[#7B2FBE]/20">{e.type}</span>}
                        {e.budget && <span className="px-2 py-1 rounded-full text-[10px] font-mono bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/20">{e.budget}</span>}
                      </div>
                    </div>
                  </div>

                  {selectedEnquiry?.id === e.id && (
                    <div className="mt-6 pt-6 border-t border-[#F0F4FF]/5">
                      <p className="text-sm text-[#F0F4FF]/70 whitespace-pre-wrap mb-4">{e.message}</p>
                      <div className="flex items-center justify-between">
                        <a href={`mailto:${e.email}`} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-all">
                          Reply via Email
                        </a>
                        <button onClick={(ev) => { ev.stopPropagation(); deleteEnquiry(e.id); }} className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'images' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-3xl font-bold">Manage Images</h1>
              <button onClick={saveImages} disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#00D4FF] text-[#050810] hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <p className="text-sm text-[#F0F4FF]/40 mb-6">Paste Unsplash or direct image URLs below. Changes apply after saving.</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => setSectionFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sectionFilter === s ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#F0F4FF]/5 text-[#F0F4FF]/40 hover:text-[#F0F4FF]/60'}`}
                >
                  {s} {s !== 'All' && `(${images.filter(i => i.section === s).length})`}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {images
                .filter(img => sectionFilter === 'All' || img.section === sectionFilter)
                .map((img) => (
                <div key={img.id} className="rounded-2xl border border-[#F0F4FF]/5 bg-[#0A1628]/40 overflow-hidden">
                  <div className="h-36 bg-[#050810] overflow-hidden relative">
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.opacity = '0.15'; e.target.style.objectFit = 'contain'; }}
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono bg-[#050810]/80 text-[#00D4FF] border border-[#00D4FF]/20">
                      {img.section}
                    </span>
                  </div>
                  <div className="p-3">
                    <label className="block text-[11px] font-medium text-[#F0F4FF]/60 mb-1.5">{img.label}</label>
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => handleImageChange(img.id, e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#050810] border border-[#F0F4FF]/10 rounded-lg text-[10px] text-[#F0F4FF] font-mono focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button onClick={saveImages} disabled={saving} className="px-8 py-3 rounded-xl text-sm font-bold bg-[#00D4FF] text-[#050810] hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all disabled:opacity-50">
                {saving ? 'Saving...' : `Save All ${sectionFilter === 'All' ? images.length : images.filter(i => i.section === sectionFilter).length} Images`}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
