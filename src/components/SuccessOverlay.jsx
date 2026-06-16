import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useSiteImages from '../hooks/useSiteImages';

export default function SuccessOverlay({ onDismiss }) {
  const allImages = useSiteImages();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  const bgUrl = allImages['success-bg'] || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#050810]/85" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Orbit rings */}
      {[200, 320, 440].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-[#00D4FF]/10"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: '50%',
            left: '50%',
            marginTop: `-${size / 2}px`,
            marginLeft: `-${size / 2}px`,
            animation: `co-spin ${12 + i * 6}s linear infinite`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00D4FF]/40"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `co-float ${3 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Content */}
      <div
        className="relative z-10 text-center px-8"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
          transition: 'transform 500ms ease 200ms',
        }}
      >
        {/* Checkmark circle */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full border-2 border-[#00D4FF] flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-2 border-[#00D4FF]/20 animate-ping" />
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
          Message <span className="text-gradient-cyber">Launched</span>
        </h2>

        <p className="text-lg text-[#F0F4FF]/60 max-w-md mx-auto mb-10 leading-relaxed">
          Your signal is orbiting our servers. We'll intercept it and get back to you within 24 hours.
        </p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="font-mono text-xs text-[#00D4FF]/80 tracking-wider">
            SIGNAL CONFIRMED
          </span>
          <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
        </div>

        <button
          onClick={handleDismiss}
          className="px-8 py-3.5 border border-[#F0F4FF]/20 rounded-xl text-sm text-[#F0F4FF]/80 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-all duration-300 font-medium"
        >
          Send Another Message
        </button>
      </div>

      <style>{`
        @keyframes co-float {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
        @keyframes co-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
}
