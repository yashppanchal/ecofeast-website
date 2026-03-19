import { useInView } from '../hooks/useAnimations';
import WorldMap, { REGIONS } from './WorldMap';

export default function GlobalReachSection() {
  const [mapRef, mapInView] = useInView(0.2);

  return (
    <section
      id="global"
      ref={mapRef}
      className="bg-gradient-to-b from-transparent to-eco-green/[0.12]"
      style={{ padding: '100px clamp(20px, 5vw, 60px)' }}
    >
      <div className="max-w-[900px] mx-auto text-center">
        <div className="text-[0.9rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
          Our Reach
        </div>
        <h2
          className="font-display font-semibold text-eco-cream mb-4 leading-tight"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Connecting Indian Farms to{' '}
          <span className="text-eco-gold">Global Tables</span>
        </h2>
        <p className="text-[0.95rem] text-eco-cream/50 mb-12 max-w-[550px] mx-auto">
          Currently serving domestic markets with active expansion into Africa, the Middle East, Europe, USA, South America, and Asia.
        </p>

        <div
          className="p-4"
          style={{
            animation: mapInView ? 'fadeSlideUp 0.8s both' : 'none',
            opacity: 0,
          }}
        >
          <WorldMap />
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {REGIONS.filter(r => !r.home).map(r => (
            <div key={r.name} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-eco-gold/60" />
              <span className="text-[0.8rem] text-eco-cream/50 tracking-wide">{r.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-eco-gold" />
            <span className="text-[0.8rem] text-eco-gold font-semibold tracking-wide">India (Home)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
