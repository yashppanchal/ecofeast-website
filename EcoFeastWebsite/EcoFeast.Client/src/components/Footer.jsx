export default function Footer({ settings }) {
  const tagline = settings?.tagline || 'Premium by Nature. Powerful by Supply.';

  return (
    <footer className="border-t border-eco-gold/[0.08] py-10 text-center"
            style={{ padding: '40px clamp(20px, 5vw, 60px)' }}>
      <div className="max-w-[600px] mx-auto">
        <div className="font-display text-[1.3rem] font-bold text-eco-gold mb-1.5">
          EcoFeast Nutrients
        </div>
        <div className="text-[0.72rem] tracking-[0.15em] text-eco-cream/30 uppercase mb-5">
          {tagline}
        </div>
        <div className="text-[0.78rem] text-eco-cream/25">
          &copy; {new Date().getFullYear()} EcoFeast Nutrients Pvt. Ltd. All rights reserved. &middot; Mumbai, India
        </div>
      </div>
    </footer>
  );
}
