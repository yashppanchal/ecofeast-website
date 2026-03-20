import { useState, useEffect, useCallback } from 'react';


const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Products', id: 'products' },
  { label: 'Strengths', id: 'strengths' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Global Reach', id: 'global' },
  { label: 'Contact', id: 'contact' },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src="/logo.svg" alt="EcoFeast" className="w-10 h-10" />
      <div>
        <div className="text-[0.95rem] font-semibold text-eco-cream leading-tight font-display">EcoFeast</div>
        <div className="text-[0.6rem] tracking-[0.2em] text-eco-gold/70 uppercase">Nutrients Pvt. Ltd.</div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  }, []);

  const scrolled = scrollY > 60;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? 'rgba(12,26,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,169,110,0.1)' : 'none',
        padding: '0 clamp(16px, 4vw, 60px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[70px]">
        {/* Logo */}
        <div
          className="cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Logo />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <span
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-[0.85rem] text-eco-cream/70 cursor-pointer tracking-wide font-medium
                         hover:text-eco-gold transition-colors duration-300"
            >
              {l.label}
            </span>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="bg-gradient-to-br from-eco-gold to-eco-gold-dark text-eco-dark
                       border-none rounded-lg px-6 py-2.5 text-[0.82rem] font-semibold
                       cursor-pointer tracking-wide transition-all duration-200
                       hover:scale-105 hover:shadow-[0_4px_20px_rgba(201,169,110,0.4)]"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile hamburger */}
        <div
          className="md:hidden cursor-pointer p-2"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <div
            className="w-6 h-0.5 bg-eco-gold mb-1.5 transition-all duration-300"
            style={{ transform: mobileMenu ? 'rotate(45deg) translateY(7px)' : 'none' }}
          />
          <div
            className="w-6 h-0.5 bg-eco-gold mb-1.5 transition-all duration-300"
            style={{ opacity: mobileMenu ? 0 : 1 }}
          />
          <div
            className="w-6 h-0.5 bg-eco-gold transition-all duration-300"
            style={{ transform: mobileMenu ? 'rotate(-45deg) translateY(-7px)' : 'none' }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="absolute top-[70px] left-0 right-0 bg-eco-dark/[0.98] backdrop-blur-xl
                        px-8 py-5 border-b border-eco-gold/15">
          {NAV_LINKS.map(l => (
            <div
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="py-3.5 text-base text-eco-cream/80 cursor-pointer
                         border-b border-white/5"
            >
              {l.label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
