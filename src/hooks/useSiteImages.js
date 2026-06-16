import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaults = {
  'hero-planet': 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80',
  'hero-galaxy': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
  'hero-nebula': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  'about-bg': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
  'about-1': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
  'about-2': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  'about-3': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
  'services-bg-1': 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1920&q=80',
  'services-bg-2': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
  'service-web': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
  'service-mobile': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  'service-android': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
  'service-ios': 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80',
  'service-agency': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
  'service-api': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  'work-bg': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80',
  'project-paysphere': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'project-quickhire': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
  'project-shaborbit': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  'project-mediconnect': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
  'process-bg-left': 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=960&q=80',
  'process-bg-right': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=960&q=80',
  'testimonials-bg': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  'avatar-rahul': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  'avatar-priya': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  'avatar-arun': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
  'avatar-sneha': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  'avatar-vikram': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  'avatar-neha': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  'contact-bg': 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80',
  'success-bg': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
};

let cache = null;

export default function useSiteImages() {
  const [images, setImages] = useState(cache || defaults);

  useEffect(() => {
    if (cache) {
      setImages(cache);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'site-images', 'main'));
        if (snap.exists()) {
          const arr = snap.data().images;
          if (Array.isArray(arr)) {
            const merged = { ...defaults };
            arr.forEach(img => {
              if (img.id && img.url) merged[img.id] = img.url;
            });
            cache = merged;
            setImages(merged);
          }
        }
      } catch (err) {
        console.error('Failed to load site images:', err);
      }
    })();
  }, []);

  return images;
}
