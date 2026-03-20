import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import ProductCard from './ProductCard';

// ─── Change product layout here — 'scrollable' | 'grid-card' ───
const PRODUCT_LAYOUT = 'scrollable';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '\u20AC', GBP: '\u00A3', INR: '\u20B9', AED: 'AED ' };

export default function ProductsSection({ products }) {
  const [prodRef, prodInView] = useInView(0.1);
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const [activeCat, setActiveCat] = useState('All');

  const filtered = activeCat === 'All' ? products : products.filter(p => p.category === activeCat);

  // Build marquee from actual product names
  const marqueeItems = products.map(p => p.name);

  return (
    <>
      {/* Marquee Divider */}
      <div className="overflow-hidden border-t border-b border-eco-gold/[0.08] py-3.5">
        <div className="flex w-max" style={{ animation: 'marquee 30s linear infinite' }}>
          {[0, 1].map(k => (
            <div key={k} className="flex gap-12 whitespace-nowrap pr-12">
              {marqueeItems.map(p => (
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

      {/* Products Section */}
      <section id="products" ref={prodRef} style={{ padding: '100px clamp(20px, 5vw, 60px)' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <div className="text-[0.9rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
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

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-[0.8rem] font-medium border whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                  activeCat === cat
                    ? 'bg-eco-gold/15 text-eco-gold border-eco-gold/40'
                    : 'text-eco-cream/50 border-eco-gold/15 hover:border-eco-gold/30 hover:text-eco-cream/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Layout Switch */}
          {PRODUCT_LAYOUT === 'scrollable' ? (
            <ScrollableLayout products={filtered} inView={prodInView} />
          ) : (
            <BentoGridLayout products={filtered} inView={prodInView} />
          )}
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCROLLABLE — horizontal scroll with snap (Option A)
   ═══════════════════════════════════════════════════════════════════ */
function ScrollableLayout({ products, inView }) {
  return (
    <div
      className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
      style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
    >
      {products.map((p, i) => (
        <div key={p.id || p.name} className="flex-shrink-0 scroll-snap-start" style={{ width: 'clamp(200px, 40vw, 240px)' }}>
          <ProductCard product={p} index={i} inView={inView} variant="scrollable" />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GRID-CARD — bento/masonry grid (Option B)
   ═══════════════════════════════════════════════════════════════════ */
function BentoGridLayout({ products, inView }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" style={{ gridAutoRows: '200px' }}>
      {products.map((p, i) => (
        <ProductCard
          key={p.id || p.name}
          product={p}
          index={i}
          inView={inView}
          variant="grid-card"
          featured={i === 0 || i === 5}
        />
      ))}
    </div>
  );
}
