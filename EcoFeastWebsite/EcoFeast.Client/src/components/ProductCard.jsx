const CATEGORY_COLORS = {
  'Fresh Vegetables': { bg: '#1a3a1a', border: '#2d5a2d' },
  'Fresh Fruits':     { bg: '#3a2a1a', border: '#5a4a2a' },
  'Cereals':          { bg: '#2a2a1a', border: '#4a4a2a' },
  'Spices':           { bg: '#3a1a1a', border: '#5a2a2a' },
  'Processed Foods':  { bg: '#2a1a2a', border: '#4a2a4a' },
  'Frozen':           { bg: '#1a2a3a', border: '#2a4a5a' },
};

export default function ProductCard({ product, index, inView }) {
  const colors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Fresh Vegetables'];

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
      <div className="text-[2.4rem] mb-2.5">{product.emoji}</div>
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
