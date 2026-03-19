import { useInView } from '../hooks/useAnimations';

const CERTIFICATIONS = [
  'FSSAI Central License',
  'APEDA Registration (RCMC)',
  'Import Export Code (IEC)',
  'GST Registration',
  'PAN & Statutory Registrations',
];

export default function CertificationsSection() {
  const [certRef, certInView] = useInView(0.2);

  return (
    <section ref={certRef} style={{ padding: '80px clamp(20px, 5vw, 60px)' }}>
      <div className="max-w-[800px] mx-auto text-center">
        <div className="text-[0.75rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
          Compliance
        </div>
        <h2
          className="font-display font-semibold text-eco-cream mb-9"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          Quality & Regulatory Certifications
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CERTIFICATIONS.map((c, i) => (
            <div
              key={c}
              className="bg-eco-gold/[0.08] border border-eco-gold/15 rounded-[10px]
                         px-5 py-3 text-[0.85rem] text-eco-gold font-medium"
              style={{
                animation: certInView ? `fadeSlideUp 0.5s ${i * 0.1}s both` : 'none',
                opacity: 0,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
