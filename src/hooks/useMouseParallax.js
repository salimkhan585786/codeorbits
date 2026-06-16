import { useEffect, useRef } from 'react';

export default function useMouseParallax(intensity = 30) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouse = (e) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * intensity;
      const y = ((e.clientY / window.innerHeight) - 0.5) * intensity * 0.66;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [intensity]);

  return ref;
}
