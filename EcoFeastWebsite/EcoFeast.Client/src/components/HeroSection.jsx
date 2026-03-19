import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useAnimations';
import StatCounter from './StatCounter';
import LeafDecoration from './LeafDecoration';

function HeroLogo() {
  return (
    <img
      src="/logo.svg"
      alt="EcoFeast Nutrients"
      className="w-20 h-20 object-contain mx-auto"
    />
  );
}

function HeroBackground() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <>
      {/* Try custom background image first */}
      {!imgFailed && (
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.15 }}
          onError={() => setImgFailed(true)}
        />
      )}
      {/* Always show gradient overlay (acts as sole background if no image) */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse at 20% 10%, rgba(43,58,27,0.5) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 90%, rgba(201,169,110,0.08) 0%, transparent 40%)',
            'radial-gradient(ellipse at 50% 50%, rgba(28,42,20,0.3) 0%, transparent 70%)',
            'linear-gradient(180deg, rgba(12,26,10,0) 0%, rgba(12,26,10,0.6) 100%)',
          ].join(', '),
        }}
      />
    </>
  );
}

export default function HeroSection({ stats }) {
  const [animate, setAnimate] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
      style={{ padding: '120px clamp(20px, 5vw, 60px) 80px' }}
    >
      <HeroBackground />
      <LeafDecoration style={{ top: '10%', left: '5%', transform: 'rotate(-30deg)' }} />
      <LeafDecoration style={{ bottom: '15%', right: '8%', transform: 'rotate(45deg)' }} />
      <LeafDecoration style={{ top: '40%', right: '3%', transform: 'rotate(15deg)', width: 80, height: 80 }} />

      <div className="relative z-10 max-w-[900px]">
        {/* Logo Mark */}
        <div
          style={{
            animation: animate ? 'fadeSlideUp 0.8s both' : 'none',
            opacity: 0,
            marginBottom: 24,
          }}
        >
          <HeroLogo />
        </div>

        {/* Company Name */}
        <div
          className="mb-4"
          style={{
            animation: animate ? 'fadeSlideUp 0.8s 0.15s both' : 'none',
            opacity: 0,
          }}
        >
          <div className="font-display text-eco-gold font-semibold tracking-wide" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
            EcoFeast Nutrients Pvt. Ltd.
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-eco-cream leading-tight mb-5"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            animation: animate ? 'fadeSlideUp 0.8s 0.3s both' : 'none',
            opacity: 0,
          }}
        >
          Premium by Nature.
          <br />
          <span className="text-eco-gold">Powerful by Supply.</span>
        </h1>

        {/* Subhead */}
        <p
          className="text-eco-cream/60 max-w-[600px] mx-auto mb-12"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            lineHeight: 1.7,
            animation: animate ? 'fadeSlideUp 0.8s 0.45s both' : 'none',
            opacity: 0,
          }}
        >
          India's trusted exporter of premium agricultural commodities and food products.
          From farm to port — quality, reliability, and consistency you can count on.
        </p>

        {/* Stats Counters */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-[700px] mx-auto
                     py-9 border-t border-b border-eco-gold/15"
        >
          {stats.map((s, i) => (
            <StatCounter
              key={s.label}
              label={s.label}
              value={s.value}
              suffix={s.suffix}
              delay={i * 0.15}
              trigger={statsInView}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-12"
          style={{
            animation: animate ? 'fadeIn 1s 1.5s both' : 'none',
            opacity: 0,
          }}
        >
          <div className="w-6 h-10 rounded-xl border border-eco-gold/30 flex justify-center pt-2 mx-auto">
            <div
              className="w-[3px] h-2 rounded bg-eco-gold"
              style={{ animation: 'float 2s ease-in-out infinite' }}
            />
          </div>
          <div className="text-[0.7rem] text-eco-gold/40 mt-2 tracking-[0.2em] uppercase">
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
