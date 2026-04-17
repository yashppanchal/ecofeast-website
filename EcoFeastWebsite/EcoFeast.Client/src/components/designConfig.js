// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE DESIGN TEMPLATE — change this value to switch the entire site theme
// Options: 'Default' | 'DesignA' | 'DesignB' | 'DesignC' | 'DesignD'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Default  — Original dark theme, plain sections
// DesignA  — Botanical hero (Design2 leaves) + plain sections
// DesignB  — Emerald & Gold Split hero + warmer gold-tinted sections
// DesignC  — Botanical hero + warmer gold-tinted sections (A + B combined)
// DesignD  — Alternating green-heavy / gold-heavy sections
//
export const SITE_DESIGN = 'DesignA';

// Hero design mapping (which hero variant each template uses)
export function getHeroDesign() {
  switch (SITE_DESIGN) {
    case 'DesignA':
    case 'DesignC':
      return 'Design2'; // Botanical leaves
    case 'DesignB':
      return 'DesignB'; // Emerald & Gold Split
    case 'DesignD':
      return 'DesignB'; // D uses the emerald hero too
    default:
      return 'Design1'; // Original
  }
}

// Section background styles for each template
// sectionIndex: 0-based order of sections after hero
// Even = first kind, Odd = second kind (for DesignD alternating)
export function getSectionStyle(sectionIndex) {
  switch (SITE_DESIGN) {
    case 'DesignB':
    case 'DesignC':
      return goldWashStyle();
    case 'DesignD':
      return sectionIndex % 2 === 0 ? goldHeavyStyle() : greenHeavyStyle();
    default:
      return {}; // Default + DesignA = no extra section styling
  }
}

export function getSectionClass(sectionIndex) {
  switch (SITE_DESIGN) {
    case 'DesignD':
      return sectionIndex % 2 === 0 ? 'sec-gold-heavy' : 'sec-green-heavy';
    default:
      return '';
  }
}

// Whether design uses warmer tones throughout (affects card borders, etc.)
export function isWarmDesign() {
  return ['DesignB', 'DesignC', 'DesignD'].includes(SITE_DESIGN);
}

// ─── Style helpers ───────────────────────────────────────────

function goldWashStyle() {
  return {
    background: 'linear-gradient(180deg, rgba(12,26,10,0) 0%, rgba(201,169,110,0.03) 50%, rgba(12,26,10,0) 100%)',
  };
}

function goldHeavyStyle() {
  return {
    background: 'linear-gradient(180deg, #0f1a0a 0%, #1c1710 50%, #0f1a0a 100%)',
  };
}

function greenHeavyStyle() {
  return {
    background: 'linear-gradient(180deg, #0d1f0a 0%, #0C1A0A 50%, #0e200b 100%)',
  };
}
