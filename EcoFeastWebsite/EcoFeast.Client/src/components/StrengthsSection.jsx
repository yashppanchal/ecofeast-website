import { useInView } from '../hooks/useAnimations';

export default function StrengthsSection({ strengths }) {
  const [strRef, strInView] = useInView(0.15);

  return (
    <section
      id="strengths"
      ref={strRef}
      className="bg-gradient-to-b from-eco-green/15 to-transparent"
      style={{ padding: '100px clamp(20px, 5vw, 60px)' }}
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <div className="text-[0.75rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
            Why EcoFeast
          </div>
          <h2
            className="font-display font-semibold text-eco-cream leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Our Competitive{' '}
            <span className="text-eco-gold">Edge</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {strengths.map((s, i) => (
            <div
              key={s.id || s.title}
              className="bg-white/[0.03] border border-eco-gold/10 rounded-[14px] p-7
                         transition-colors duration-300 hover:border-eco-gold/30"
              style={{
                animation: strInView ? `fadeSlideUp 0.6s ${i * 0.08}s both` : 'none',
                opacity: 0,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-eco-gold mb-4 shadow-[0_0_12px_rgba(201,169,110,0.4)]" />
              <div className="font-display text-[1.1rem] font-semibold text-eco-cream mb-2">
                {s.title}
              </div>
              <div className="text-[0.88rem] text-eco-cream/50 leading-relaxed">
                {s.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
