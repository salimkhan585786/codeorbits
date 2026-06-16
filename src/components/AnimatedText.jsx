import { useEffect, useRef, useState } from 'react';

export default function AnimatedText({ text, type = 'words', delay = 0, stagger = 60, className = '' }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setPlay(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const animClass = play ? 'animate-text-unit' : '';

  const split = () => {
    if (type === 'chars') {
      return [...text].map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className={`inline-block ${animClass}`}
            style={play ? { animationDelay: `${i * stagger}ms` } : undefined}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ));
    }
    const words = text.split(' ');
    return words.map((word, i) => (
      <span key={i} className="inline-block overflow-hidden">
        <span
          className={`inline-block ${animClass}`}
          style={play ? { animationDelay: `${i * stagger}ms` } : undefined}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      </span>
    ));
  };

  return (
    <span ref={ref} className={`inline ${className}`}>
      {split()}
    </span>
  );
}
