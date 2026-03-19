const CATEGORY_COLORS = {
  'Fresh Vegetables': { bg: '#1a3a1a', border: '#2d5a2d', accent: '#4a8a4a' },
  'Fresh Fruits':     { bg: '#3a2a1a', border: '#5a4a2a', accent: '#c9a96e' },
  'Cereals':          { bg: '#2a2a1a', border: '#4a4a2a', accent: '#b8a860' },
  'Spices':           { bg: '#3a1a1a', border: '#5a2a2a', accent: '#c97a4a' },
  'Processed Foods':  { bg: '#2a1a2a', border: '#4a2a4a', accent: '#b07ab0' },
  'Frozen':           { bg: '#1a2a3a', border: '#2a4a5a', accent: '#6a9ab0' },
};

// Elegant minimal SVG icons per category — professional line-art style
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

export default function ProductCard({ product, index, inView }) {
  const colors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Fresh Vegetables'];
  const IconRenderer = CATEGORY_ICONS[product.category] || CATEGORY_ICONS['Fresh Vegetables'];

  return (
    <div
      className="rounded-2xl cursor-default transition-all duration-300
                 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        padding: '24px 20px',
        animation: inView ? `fadeSlideUp 0.6s ${0.05 * index}s both` : 'none',
        opacity: 0,
      }}
    >
      {/* Product image if available, otherwise category icon */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 object-contain mb-2.5 rounded-lg"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
        />
      ) : null}
      <div
        className="mb-2.5 opacity-80"
        style={{ display: product.imageUrl ? 'none' : 'block' }}
      >
        {IconRenderer(colors.accent)}
      </div>

      <div className="font-display text-[1.15rem] font-semibold text-eco-cream mb-1">
        {product.name}
      </div>
      <div className="text-[0.75rem] text-eco-gold tracking-[0.1em] uppercase mb-2.5 font-medium">
        {product.category}
      </div>
      <div
        className="inline-block bg-eco-gold/10 border border-eco-gold/25 rounded-lg
                   px-2.5 py-1 text-[0.75rem] text-eco-gold font-mono"
      >
        HS: {product.hsCode}
      </div>
    </div>
  );
}
