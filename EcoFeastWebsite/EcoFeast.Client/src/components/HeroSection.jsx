import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useAnimations';
import StatCounter from './StatCounter';
import LeafDecoration from './LeafDecoration';

import { getHeroDesign } from './designConfig';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hero design is now driven by designConfig.js SITE_DESIGN toggle
// Possible values: 'Design1' | 'Design2' | 'DesignB'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HERO_DESIGN = getHeroDesign();

// ─── Shared Logo ─────────────────────────────────────────────
function HeroLogo() {
  return (
    <img
      src="/logo.svg"
      alt="EcoFeast Nutrients"
      className="w-20 h-20 object-contain mx-auto"
    />
  );
}

// ═════════════════════════════════════════════════════════════
// DESIGN 1 — Original background + simple leaf decorations
// ═════════════════════════════════════════════════════════════
function HeroBackgroundV1() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <>
      {!imgFailed && (
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.15 }}
          onError={() => setImgFailed(true)}
        />
      )}
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

function HeroDecorationsV1() {
  return (
    <>
      <BotanicalLeaf size={240} opacity={0.07} rotation={-30} delay={0} style={{ top: '-2%', left: '-1%' }} />
      <BotanicalLeaf size={200} opacity={0.06} rotation={140} delay={1.5} style={{ bottom: '-1%', right: '-1%' }} />
      <BotanicalLeaf size={160} opacity={0.055} rotation={15} delay={3} style={{ top: '35%', right: '1%' }} />
      <BotanicalLeaf size={140} opacity={0.05} rotation={-55} delay={2} style={{ bottom: '25%', left: '4%' }} />
      <BotanicalLeaf size={120} opacity={0.045} rotation={95} delay={4.5} style={{ top: '15%', right: '18%' }} />
      <BotanicalBranch opacity={0.05} delay={1} style={{ top: '8%', right: '0%', transform: 'scaleX(-1)' }} />
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// DESIGN 2 — Botanical organic with breathing leaves + glow
// ═════════════════════════════════════════════════════════════

// Detailed botanical leaf SVG with veins
function BotanicalLeaf({ size = 180, opacity = 0.06, rotation = 0, style, delay = 0 }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        opacity,
        '--base-rotate': `rotate(${rotation}deg)`,
        animation: `sway ${8 + delay * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        ...style,
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main leaf shape */}
        <path
          d="M100,15 Q140,40 145,80 Q148,110 130,140 Q115,165 100,185 Q85,165 70,140 Q52,110 55,80 Q60,40 100,15Z"
          fill="rgba(201,169,110,0.3)"
          stroke="rgba(201,169,110,0.5)"
          strokeWidth="0.8"
        />
        {/* Center vein */}
        <path d="M100,20 L100,180" stroke="rgba(201,169,110,0.4)" strokeWidth="0.6" />
        {/* Side veins */}
        <path d="M100,50 Q120,55 135,48" stroke="rgba(201,169,110,0.25)" strokeWidth="0.5" fill="none" />
        <path d="M100,50 Q80,55 65,48" stroke="rgba(201,169,110,0.25)" strokeWidth="0.5" fill="none" />
        <path d="M100,75 Q125,82 140,72" stroke="rgba(201,169,110,0.2)" strokeWidth="0.5" fill="none" />
        <path d="M100,75 Q75,82 60,72" stroke="rgba(201,169,110,0.2)" strokeWidth="0.5" fill="none" />
        <path d="M100,100 Q128,108 142,96" stroke="rgba(201,169,110,0.18)" strokeWidth="0.5" fill="none" />
        <path d="M100,100 Q72,108 58,96" stroke="rgba(201,169,110,0.18)" strokeWidth="0.5" fill="none" />
        <path d="M100,125 Q122,132 135,122" stroke="rgba(201,169,110,0.15)" strokeWidth="0.4" fill="none" />
        <path d="M100,125 Q78,132 65,122" stroke="rgba(201,169,110,0.15)" strokeWidth="0.4" fill="none" />
        <path d="M100,150 Q115,155 125,148" stroke="rgba(201,169,110,0.12)" strokeWidth="0.4" fill="none" />
        <path d="M100,150 Q85,155 75,148" stroke="rgba(201,169,110,0.12)" strokeWidth="0.4" fill="none" />
      </svg>
    </div>
  );
}

// Branch with small leaves
function BotanicalBranch({ style, opacity = 0.05, delay = 0 }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: 250,
        height: 250,
        opacity,
        '--base-rotate': 'rotate(0deg)',
        animation: `sway ${10 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        ...style,
      }}
    >
      <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main stem */}
        <path d="M50,280 Q100,200 140,150 Q180,100 250,40" stroke="rgba(201,169,110,0.4)" strokeWidth="1.2" fill="none" />
        {/* Leaf 1 */}
        <path d="M120,180 Q140,160 135,145 Q125,155 120,180Z" fill="rgba(201,169,110,0.3)" stroke="rgba(201,169,110,0.35)" strokeWidth="0.5" />
        {/* Leaf 2 */}
        <path d="M155,140 Q180,125 175,108 Q162,118 155,140Z" fill="rgba(201,169,110,0.25)" stroke="rgba(201,169,110,0.3)" strokeWidth="0.5" />
        {/* Leaf 3 - other side */}
        <path d="M140,155 Q115,140 115,122 Q128,132 140,155Z" fill="rgba(201,169,110,0.25)" stroke="rgba(201,169,110,0.3)" strokeWidth="0.5" />
        {/* Leaf 4 */}
        <path d="M190,105 Q215,88 208,70 Q198,82 190,105Z" fill="rgba(201,169,110,0.2)" stroke="rgba(201,169,110,0.25)" strokeWidth="0.5" />
        {/* Leaf 5 */}
        <path d="M185,110 Q160,95 162,78 Q175,88 185,110Z" fill="rgba(201,169,110,0.2)" stroke="rgba(201,169,110,0.25)" strokeWidth="0.5" />
        {/* Small buds */}
        <circle cx="250" cy="42" r="3" fill="rgba(201,169,110,0.25)" />
        <circle cx="90" cy="215" r="2" fill="rgba(201,169,110,0.15)" />
      </svg>
    </div>
  );
}

// Floating mini leaf particle
function FloatingLeaf({ delay, left, size = 18 }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: '-5%',
        width: size,
        height: size,
        animation: `leafFall ${25 + delay * 3}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 40 50" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="leafGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(201,169,110,0.18)" />
            <stop offset="100%" stopColor="rgba(201,169,110,0.03)" />
          </radialGradient>
        </defs>
        <path
          d="M20,2 Q32,12 30,24 Q28,36 20,48 Q12,36 10,24 Q8,12 20,2Z"
          fill="url(#leafGrad)"
          stroke="rgba(201,169,110,0.12)"
          strokeWidth="0.4"
        />
        <path d="M20,6 L20,44" stroke="rgba(201,169,110,0.1)" strokeWidth="0.3" />
        <path d="M20,16 Q26,18 30,15" stroke="rgba(201,169,110,0.07)" strokeWidth="0.3" fill="none" />
        <path d="M20,16 Q14,18 10,15" stroke="rgba(201,169,110,0.07)" strokeWidth="0.3" fill="none" />
        <path d="M20,28 Q25,30 29,27" stroke="rgba(201,169,110,0.06)" strokeWidth="0.3" fill="none" />
        <path d="M20,28 Q15,30 11,27" stroke="rgba(201,169,110,0.06)" strokeWidth="0.3" fill="none" />
      </svg>
    </div>
  );
}

function HeroBackgroundV2() {
  return (
    <>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse at 15% 20%, rgba(43,58,27,0.6) 0%, transparent 50%)',
            'radial-gradient(ellipse at 85% 80%, rgba(43,58,27,0.4) 0%, transparent 45%)',
            'radial-gradient(ellipse at 50% 50%, rgba(28,42,20,0.25) 0%, transparent 60%)',
            'linear-gradient(180deg, rgba(12,26,10,0) 0%, rgba(12,26,10,0.7) 100%)',
          ].join(', '),
        }}
      />

      {/* Drifting warm glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          top: '10%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
          animation: 'driftGlow 20s ease-in-out infinite',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          bottom: '5%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(43,58,27,0.15) 0%, transparent 70%)',
          animation: 'driftGlow 25s ease-in-out infinite',
          animationDelay: '5s',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: '50%',
          right: '30%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)',
          animation: 'driftGlow 18s ease-in-out infinite',
          animationDelay: '10s',
          filter: 'blur(40px)',
        }}
      />
    </>
  );
}

function HeroDecorationsV2() {
  return (
    <>
      {/* Large botanical leaves at edges — breathing/swaying */}
      <BotanicalLeaf
        size={300} opacity={0.11} rotation={-35} delay={0}
        style={{ top: '-5%', left: '-3%' }}
      />
      <BotanicalLeaf
        size={240} opacity={0.09} rotation={140} delay={1.5}
        style={{ bottom: '-2%', right: '-2%' }}
      />
      <BotanicalLeaf
        size={180} opacity={0.08} rotation={25} delay={3}
        style={{ top: '28%', right: '-1%' }}
      />
      <BotanicalLeaf
        size={160} opacity={0.07} rotation={-70} delay={2}
        style={{ bottom: '18%', left: '2%' }}
      />
      {/* Extra leaves for richer look */}
      <BotanicalLeaf
        size={200} opacity={0.065} rotation={65} delay={4}
        style={{ top: '8%', right: '12%' }}
      />
      <BotanicalLeaf
        size={170} opacity={0.06} rotation={-110} delay={2.5}
        style={{ bottom: '35%', left: '8%' }}
      />
      <BotanicalLeaf
        size={150} opacity={0.055} rotation={170} delay={5}
        style={{ top: '55%', right: '6%' }}
      />

      {/* Additional nerve-detail leaves */}
      <BotanicalLeaf
        size={130} opacity={0.05} rotation={-150} delay={6}
        style={{ top: '65%', left: '0%' }}
      />
      <BotanicalLeaf
        size={110} opacity={0.045} rotation={45} delay={3.5}
        style={{ top: '5%', left: '20%' }}
      />

      {/* Branches */}
      <BotanicalBranch
        opacity={0.08} delay={0}
        style={{ top: '5%', right: '0%', transform: 'scaleX(-1)' }}
      />
      <BotanicalBranch
        opacity={0.065} delay={2}
        style={{ bottom: '0%', left: '-2%', transform: 'rotate(30deg)' }}
      />

    </>
  );
}

// ═════════════════════════════════════════════════════════════
// DESIGN B — Emerald & Gold Split hero
// ═════════════════════════════════════════════════════════════
function HeroBackgroundB() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0d1f0a 0%, #132a0f 35%, #1a1508 65%, #0C1A0A 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse at 0% 50%, rgba(43,80,27,0.35) 0%, transparent 50%)',
            'radial-gradient(ellipse at 100% 50%, rgba(201,169,110,0.12) 0%, transparent 45%)',
            'radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 40%)',
          ].join(', '),
        }}
      />
      {/* Drifting green glow left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, top: '10%', left: '-5%',
          background: 'radial-gradient(circle, rgba(43,90,27,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'driftGlow 15s ease-in-out infinite',
        }}
      />
      {/* Drifting gold glow right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400, bottom: '10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'driftGlow 18s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// DESIGN B — Static leaf decorations (fewer, subtler than V2)
// ═════════════════════════════════════════════════════════════
function HeroDecorationsB() {
  return (
    <>
      <BotanicalLeaf size={260} opacity={0.08} rotation={-30} delay={0} style={{ top: '-3%', left: '-2%' }} />
      <BotanicalLeaf size={220} opacity={0.07} rotation={135} delay={2} style={{ bottom: '-1%', right: '-1%' }} />
      <BotanicalLeaf size={170} opacity={0.06} rotation={20} delay={3.5} style={{ top: '30%', right: '0%' }} />
      <BotanicalLeaf size={150} opacity={0.055} rotation={-65} delay={1.5} style={{ bottom: '20%', left: '3%' }} />
      <BotanicalLeaf size={130} opacity={0.05} rotation={80} delay={4} style={{ top: '12%', right: '15%' }} />
      <BotanicalLeaf size={140} opacity={0.05} rotation={-120} delay={5} style={{ top: '60%', left: '1%' }} />
      <BotanicalLeaf size={110} opacity={0.045} rotation={50} delay={3} style={{ top: '8%', left: '18%' }} />
      <BotanicalLeaf size={120} opacity={0.04} rotation={160} delay={6} style={{ bottom: '40%', right: '5%' }} />
      <BotanicalBranch opacity={0.06} delay={1.5} style={{ bottom: '2%', left: '-1%', transform: 'rotate(25deg)' }} />
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// FALLING LEAVES — shown on ALL hero designs
// ═════════════════════════════════════════════════════════════
function FallingLeaves() {
  return (
    <>
      <FloatingLeaf delay={0} left={10} size={44} />
      <FloatingLeaf delay={6} left={35} size={36} />
      <FloatingLeaf delay={3} left={58} size={40} />
      <FloatingLeaf delay={9} left={78} size={34} />
      <FloatingLeaf delay={12} left={92} size={38} />
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// MAIN HERO SECTION
// ═════════════════════════════════════════════════════════════
export default function HeroSection({ stats }) {
  const [animate, setAnimate] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const isV2 = HERO_DESIGN === 'Design2';
  const isB = HERO_DESIGN === 'DesignB';

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
      style={{ padding: '120px clamp(20px, 5vw, 60px) 80px' }}
    >
      {isB ? <HeroBackgroundB /> : isV2 ? <HeroBackgroundV2 /> : <HeroBackgroundV1 />}
      {isV2 ? <HeroDecorationsV2 /> : isB ? <HeroDecorationsB /> : <HeroDecorationsV1 />}
      {/* Falling leaves — always present on all designs */}
      <FallingLeaves />

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
