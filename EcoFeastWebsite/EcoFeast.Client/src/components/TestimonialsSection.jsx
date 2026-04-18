import { useState, useEffect, useRef } from 'react';
import { useInView } from '../hooks/useAnimations';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIAL LAYOUT — change this value to swap the presentation
// Options:
//   'marquee' — infinite auto-scrolling row, pauses on hover (compact)
//   'slider'  — single featured testimonial at a time with arrows + dots (focused)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const TESTIMONIAL_LAYOUT = 'marquee'; // 'slider' or 'marquee'

const initials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

/* ─── Shared: stars row ──────────────────────────────────────── */
function Stars({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#C9A96E">
          <path d="M12 2l2.6 6.9L22 10l-5.6 4.7L18 22l-6-3.7-6 3.7 1.6-7.3L2 10l7.4-1.1z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── MARQUEE layout ─────────────────────────────────────────── */
function MarqueeLayout({ items }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden max-w-[1400px] mx-auto">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-eco-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-eco-dark to-transparent z-10 pointer-events-none" />

      <div className="flex gap-5 testimonial-marquee-track" style={{ width: 'max-content' }}>
        {doubled.map((t, idx) => (
          <div
            key={`${t.id}-${idx}`}
            className="w-[320px] md:w-[360px] shrink-0 bg-white/[0.03] border border-eco-gold/[0.12] rounded-2xl p-6
                       hover:border-eco-gold/30 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#C9A96E" className="mb-3 opacity-60">
              <path d="M4.6 11.3L3 12.9v3.7l4.4-4.4V5.7H1v5.6zm13 0l-1.6 1.6v3.7l4.4-4.4V5.7H14v5.6z" />
            </svg>
            <p className="text-eco-cream/75 text-sm leading-relaxed mb-5 line-clamp-4">
              {t.quote}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-eco-gold/30 to-eco-gold/10
                              border border-eco-gold/25 flex items-center justify-center
                              text-eco-gold font-semibold text-xs shrink-0">
                {initials(t.name)}
              </div>
              <div className="min-w-0">
                <div className="text-eco-cream text-sm font-medium truncate">{t.name}</div>
                <div className="text-eco-cream/40 text-[0.68rem] truncate">
                  {[t.company, t.country].filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .testimonial-marquee-track { animation: testimonialMarquee 45s linear infinite; }
        .testimonial-marquee-track:hover { animation-play-state: paused; }
        @keyframes testimonialMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ─── SLIDER layout ──────────────────────────────────────────── */
function SliderLayout({ items }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const start = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(x => (x + 1) % items.length), 5500);
  };

  useEffect(() => {
    if (items.length > 1) start();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (items.length === 0) return null;
  const t = items[idx % items.length];

  const go = (next) => {
    setIdx((next + items.length) % items.length);
    if (items.length > 1) start();
  };

  return (
    <div className="max-w-[900px] mx-auto relative">
      <div className="relative bg-gradient-to-br from-white/[0.04] to-transparent
                      border border-eco-gold/15 rounded-[2rem] p-10 md:p-14 min-h-[360px]
                      flex flex-col items-center text-center overflow-hidden">
        {/* Corner quote decoration */}
        <div className="absolute -top-6 -right-2 text-[10rem] font-display text-eco-gold/[0.05] leading-none select-none pointer-events-none">
          &ldquo;
        </div>

        {/* Top quote icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#C9A96E" className="mb-5 opacity-70 relative z-10">
          <path d="M4.6 11.3L3 12.9v3.7l4.4-4.4V5.7H1v5.6zm13 0l-1.6 1.6v3.7l4.4-4.4V5.7H14v5.6z" />
        </svg>

        <div key={t.id} className="testimonial-fade flex-1 flex flex-col items-center relative z-10">
          <div className="mb-4">
            <Stars rating={t.rating} size={16} />
          </div>

          <p className="font-display text-eco-cream text-lg md:text-xl leading-relaxed italic max-w-[720px] mb-8">
            &ldquo;{t.quote}&rdquo;
          </p>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-eco-gold/40 to-eco-gold/10
                            border-2 border-eco-gold/30 flex items-center justify-center
                            text-eco-gold font-bold">
              {initials(t.name)}
            </div>
            <div className="text-left">
              <div className="text-eco-cream text-sm font-semibold">{t.name}</div>
              {(t.title || t.company) && (
                <div className="text-eco-cream/50 text-[0.72rem]">
                  {[t.title, t.company].filter(Boolean).join(', ')}
                </div>
              )}
              {t.country && (
                <div className="text-eco-gold/70 text-[0.65rem] uppercase tracking-wider">{t.country}</div>
              )}
            </div>
          </div>
        </div>

        {/* Arrows (only if multiple) */}
        {items.length > 1 && (
          <>
            <button onClick={() => go(idx - 1)} aria-label="Previous testimonial"
                    className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                               bg-eco-dark/60 border border-eco-gold/20 text-eco-gold hover:bg-eco-gold/10
                               hover:border-eco-gold/40 transition-all flex items-center justify-center z-20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => go(idx + 1)} aria-label="Next testimonial"
                    className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                               bg-eco-dark/60 border border-eco-gold/20 text-eco-gold hover:bg-eco-gold/10
                               hover:border-eco-gold/40 transition-all flex items-center justify-center z-20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === idx ? 'w-8 bg-eco-gold' : 'w-1.5 bg-eco-gold/25 hover:bg-eco-gold/50'
                    }`} />
          ))}
        </div>
      )}

      <style>{`
        .testimonial-fade { animation: testimonialFade 0.5s ease-out; }
        @keyframes testimonialFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────── */
export default function TestimonialsSection({ testimonials = [] }) {
  const [ref, inView] = useInView(0.15);
  const active = testimonials.filter(t => t.isActive !== false);

  if (active.length === 0) return null;

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative"
      style={{ padding: '100px clamp(20px, 5vw, 60px)' }}
    >
      <div className="max-w-[1200px] mx-auto text-center mb-12">
        <div className="text-[0.9rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
          Client Voices
        </div>
        <h2
          className="font-display font-semibold text-eco-cream mb-4 leading-tight"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Trusted by Buyers{' '}
          <span className="text-eco-gold">Across the Globe</span>
        </h2>
        <p className="text-[0.95rem] text-eco-cream/50 max-w-[600px] mx-auto">
          What our international partners say about working with EcoFeast Nutrients.
        </p>
      </div>

      <div
        style={{
          animation: inView ? 'fadeSlideUp 0.8s both' : 'none',
          opacity: 0,
        }}
      >
        {TESTIMONIAL_LAYOUT === 'marquee'
          ? <MarqueeLayout items={active} />
          : <SliderLayout items={active} />}
      </div>
    </section>
  );
}
