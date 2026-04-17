import { useInView } from '../hooks/useAnimations';
import WorldMap from './WorldMap';

export default function GlobalReachSection({ countries = [] }) {
  const [mapRef, mapInView] = useInView(0.2);

  const active = countries.filter(c => c.isActive !== false);
  const home = active.find(c => c.isHome);
  const targets = active.filter(c => !c.isHome);

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
          {targets.length > 0
            ? <>Currently serving domestic markets with active expansion into {targets.map(t => t.name).join(', ')}.</>
            : 'Currently serving domestic markets with active expansion across global destinations.'}
        </p>

        <div
          className="p-4"
          style={{
            animation: mapInView ? 'fadeSlideUp 0.8s both' : 'none',
            opacity: 0,
          }}
        >
          <WorldMap countries={countries} />
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {targets.map(r => (
            <div key={r.id ?? r.name} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-eco-gold/60" />
              <span className="text-[0.8rem] text-eco-cream/50 tracking-wide">{r.name}</span>
            </div>
          ))}
          {home && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-eco-gold" />
              <span className="text-[0.8rem] text-eco-gold font-semibold tracking-wide">{home.name} (Home)</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
