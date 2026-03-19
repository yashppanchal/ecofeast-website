import { useInView } from '../hooks/useAnimations';
import ProductCard from './ProductCard';

const MARQUEE_ITEMS = [
  'Fresh Onions', 'Basmati Rice', 'Alphonso Mangoes', 'Pomegranates',
  'Chilly Powder', 'Green Chilly', 'Grapes', 'Ladoos', 'Bananas',
];

export default function ProductsSection({ products }) {
  const [prodRef, prodInView] = useInView(0.15);

  return (
    <>
      {/* Marquee Divider */}
      <div className="overflow-hidden border-t border-b border-eco-gold/[0.08] py-3.5">
        <div className="flex w-max" style={{ animation: 'marquee 30s linear infinite' }}>
          {[0, 1].map(k => (
            <div key={k} className="flex gap-12 whitespace-nowrap pr-12">
              {MARQUEE_ITEMS.map(p => (
                <span
                  key={p + k}
                  className="text-[0.8rem] tracking-[0.15em] uppercase text-eco-gold/25 font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <section id="products" ref={prodRef} style={{ padding: '100px clamp(20px, 5vw, 60px)' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <div className="text-[0.75rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
              Our Portfolio
            </div>
            <h2
              className="font-display font-semibold text-eco-cream leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
            >
              From India's Farms to{' '}
              <span className="text-eco-gold">Your Markets</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCard key={p.id || p.name} product={p} index={i} inView={prodInView} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
