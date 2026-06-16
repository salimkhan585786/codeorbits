export default function ParallaxLayer({ speed = 0, children, className = '', style = {} }) {
  const speedClass =
    speed <= 0 ? '' :
    speed <= 0.15 ? 'parallax-slow' :
    speed <= 0.4  ? 'parallax-mid' :
    speed <= 0.7  ? 'parallax-fast' :
                    'parallax-turbo';

  return (
    <div
      className={`${speedClass} ${className}`}
      style={{
        transform: speed > 0 ? `translateY(calc(var(--scroll-y, 0px) * -${speed}))` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
