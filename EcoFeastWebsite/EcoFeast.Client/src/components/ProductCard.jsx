const CURRENCY_SYMBOLS = { USD: '$', EUR: '\u20AC', GBP: '\u00A3', INR: '\u20B9', AED: 'AED ' };

const CATEGORY_COLORS = {
  'Fresh Vegetables': { bg: '#1a3a1a', border: '#2d5a2d', accent: '#4a8a4a' },
  'Fresh Fruits':     { bg: '#3a2a1a', border: '#5a4a2a', accent: '#c9a96e' },
  'Cereals':          { bg: '#2a2a1a', border: '#4a4a2a', accent: '#b8a860' },
  'Spices':           { bg: '#3a1a1a', border: '#5a2a2a', accent: '#c97a4a' },
  'Processed Foods':  { bg: '#2a1a2a', border: '#4a2a4a', accent: '#b07ab0' },
  'Frozen':           { bg: '#1a2a3a', border: '#2a4a5a', accent: '#6a9ab0' },
};

// Elegant minimal SVG icons per category
const CATEGORY_ICONS = {
  'Fresh Vegetables': (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 28c-6-3-10-9-10-16C10 8 14 6 16 4c2 2 6 4 10 8 0 7-4 13-10 16z" />
      <path d="M16 4v24" />
      <path d="M12 14c2 1 4 1 6 0" opacity="0.5" />
    </svg>
  ),
  'Fresh Fruits': (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="18" r="10" />
      <path d="M16 8c-1-3 1-5 3-6" />
      <path d="M14 9c-2-1-2-4-1-5" opacity="0.5" />
    </svg>
  ),
  'Cereals': (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 30V10" />
      <path d="M16 10c-4-2-6-6-5-9 3 1 6 4 5 9z" />
      <path d="M16 15c4-2 6-6 5-9-3 1-6 4-5 9z" />
      <path d="M16 20c-4-2-6-6-5-9 3 1 6 4 5 9z" />
    </svg>
  ),
  'Spices': (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20h16v4c0 2-3 4-8 4s-8-2-8-4v-4z" />
      <path d="M8 20c0-6 3-10 8-14 5 4 8 8 8 14" />
      <ellipse cx="16" cy="20" rx="8" ry="2" opacity="0.4" />
    </svg>
  ),
  'Processed Foods': (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="20" height="18" rx="2" />
      <path d="M6 14h20" />
      <path d="M12 4v4M20 4v4" />
      <circle cx="16" cy="20" r="2" opacity="0.4" />
    </svg>
  ),
  'Frozen': (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2v28M2 16h28" />
      <path d="M8 8l16 16M24 8L8 24" />
      <path d="M16 6l-3 3M16 6l3 3" opacity="0.6" />
      <path d="M16 26l-3-3M16 26l3-3" opacity="0.6" />
      <path d="M6 16l3-3M6 16l3 3" opacity="0.6" />
      <path d="M26 16l-3-3M26 16l-3 3" opacity="0.6" />
    </svg>
  ),
};

function formatPrice(price, currency) {
  if (!price || price === 0) return null;
  const sym = CURRENCY_SYMBOLS[currency] || '$';
  return `${sym}${price.toLocaleString()}`;
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD — supports 'scrollable' and 'grid-card' variants
   ═══════════════════════════════════════════════════════════════════ */
export default function ProductCard({ product, index, inView, variant = 'scrollable', featured = false }) {
  if (variant === 'grid-card') {
    return <BentoCard product={product} index={index} inView={inView} featured={featured} />;
  }
  return <ScrollCard product={product} index={index} inView={inView} />;
}

/* ─── SCROLLABLE CARD (Option A) ──────────────────────────────── */
function ScrollCard({ product, index, inView }) {
  const colors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Fresh Vegetables'];
  const IconRenderer = CATEGORY_ICONS[product.category] || CATEGORY_ICONS['Fresh Vegetables'];
  const price = formatPrice(product.price, product.currency);
  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300
                 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
                 group cursor-default"
      style={{
        border: `1px solid ${colors.border}`,
        animation: inView ? `fadeSlideUp 0.6s ${0.05 * index}s both` : 'none',
        opacity: 0,
      }}
    >
      {/* Image area */}
      <div
        className="h-[150px] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, #0C1A0A 60%, rgba(201,169,110,0.1) 100%)` }}
      >
        {hasImage ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Light translucent overlay — clears on hover */}
            <div className="absolute inset-0 bg-eco-dark/30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
            <div
              className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${colors.bg}44 0%, rgba(201,169,110,0.06) 100%)` }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            {IconRenderer(colors.accent)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4" style={{ background: colors.bg }}>
        <div className="font-display text-[1rem] font-semibold text-eco-cream mb-1 leading-tight">
          {product.name}
        </div>
        <div className="text-[0.65rem] text-eco-gold tracking-[0.12em] uppercase mb-2 font-medium">
          {product.category}
        </div>
        {product.description && (
          <div className="text-[0.72rem] text-eco-cream/40 mb-2 leading-relaxed line-clamp-2">
            {product.description}
          </div>
        )}
        <div className="flex items-center justify-between">
          {price && (
            <div className="text-[0.88rem] font-semibold text-eco-gold">
              {price}{product.priceUnit && <span className="text-[0.65rem] opacity-50">{product.priceUnit}</span>}
            </div>
          )}
          <div className="text-[0.65rem] text-eco-cream/25 font-mono">
            HS: {product.hsCode}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── BENTO GRID CARD (Option B) ──────────────────────────────── */
function BentoCard({ product, index, inView, featured }) {
  const colors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Fresh Vegetables'];
  const IconRenderer = CATEGORY_ICONS[product.category] || CATEGORY_ICONS['Fresh Vegetables'];
  const price = formatPrice(product.price, product.currency);
  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';

  return (
    <div
      className={`rounded-2xl overflow-hidden relative cursor-default group
                  transition-all duration-500 hover:scale-[1.02] hover:z-10
                  hover:shadow-[0_16px_50px_rgba(0,0,0,0.6)]
                  ${featured ? 'col-span-2 row-span-2' : ''}`}
      style={{
        border: `1px solid rgba(201,169,110,0.08)`,
        animation: inView ? `fadeSlideUp 0.5s ${0.04 * index}s both` : 'none',
        opacity: 0,
      }}
    >
      {/* Background image or gradient */}
      {hasImage ? (
        <>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Light translucent overlay — clears on hover */}
          <div className="absolute inset-0 bg-eco-dark/25 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
          <div
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${colors.bg}33, rgba(201,169,110,0.05))` }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${colors.bg}, #0C1A0A)` }}
        />
      )}

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-eco-dark/95 via-eco-dark/20 to-transparent" />

      {/* Icon fallback when no image */}
      {!hasImage && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div style={{ transform: featured ? 'scale(2.5)' : 'scale(1.5)' }}>
            {IconRenderer(colors.accent)}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <div
          className="inline-block bg-eco-gold/15 border border-eco-gold/25 px-2 py-0.5 rounded-full
                     text-[0.6rem] tracking-[0.1em] uppercase text-eco-gold mb-1.5"
        >
          {product.category}
        </div>
        <div className={`font-display font-semibold text-eco-cream ${featured ? 'text-[1.3rem] md:text-[1.5rem]' : 'text-[0.95rem]'}`}>
          {product.name}
        </div>
        {price && (
          <div className="text-[0.85rem] text-eco-gold font-semibold mt-1">
            {price}{product.priceUnit && <span className="text-[0.6rem] opacity-50">{product.priceUnit}</span>}
          </div>
        )}
        {/* Details expand on hover */}
        <div className="max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-[50px]">
          <div className="text-[0.68rem] text-eco-cream/40 mt-1">
            HS: {product.hsCode}
            {product.description && <> &mdash; {product.description}</>}
          </div>
        </div>
      </div>
    </div>
  );
}
