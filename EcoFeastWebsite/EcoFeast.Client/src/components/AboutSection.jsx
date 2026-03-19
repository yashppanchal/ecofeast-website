export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '100px clamp(20px, 5vw, 60px)' }}>
      <div className="max-w-[900px] mx-auto text-center">
        <div className="text-[0.75rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
          Who We Are
        </div>
        <h2
          className="font-display font-semibold text-eco-cream mb-8 leading-tight"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Built on Trust.{' '}
          <span className="text-eco-gold">Driven by Quality.</span>
        </h2>
        <p className="text-[1.05rem] text-eco-cream/60 leading-relaxed max-w-[700px] mx-auto">
          EcoFeast Nutrients is an export-focused food and agri-commodities company based in Mumbai, India.
          We specialize in sourcing, processing, and supplying high-quality agricultural and food products to
          domestic and international markets. With a strong foundation in the Indian agri-supply chain and an
          established presence in fresh onions, we are expanding our portfolio across spices, cereals, fresh
          fruits, and value-added food products to serve global buyers with confidence.
        </p>
      </div>
    </section>
  );
}
