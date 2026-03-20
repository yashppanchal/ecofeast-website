import { SITE_DESIGN, getSectionStyle, getSectionClass } from './designConfig';

/**
 * Wraps a section with the appropriate background based on the active design template.
 * For DesignD, alternating sections get green/gold heavy backgrounds with glow orbs.
 */
export default function SectionWrapper({ index, children }) {
  const style = getSectionStyle(index);
  const cls = getSectionClass(index);
  const isD = SITE_DESIGN === 'DesignD';

  if (!isD && Object.keys(style).length === 0) {
    // Default / DesignA — no wrapper needed
    return children;
  }

  const isGold = isD && index % 2 === 0;

  return (
    <div className={`relative overflow-hidden ${cls}`} style={style}>
      {/* Subtle glow orbs for DesignD */}
      {isD && (
        <>
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500, height: 500,
              top: '15%',
              ...(isGold ? { right: '10%' } : { left: '5%' }),
              background: isGold
                ? 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(43,90,27,0.15) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 400, height: 400,
              bottom: '15%',
              ...(isGold ? { left: '5%' } : { right: '8%' }),
              background: isGold
                ? 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(43,70,27,0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          {/* Thin separator line at top */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: isGold
                ? 'linear-gradient(90deg, transparent, rgba(201,169,110,0.25), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(43,80,27,0.35), transparent)',
            }}
          />
        </>
      )}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}
