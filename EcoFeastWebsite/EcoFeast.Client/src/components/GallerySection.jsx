import { useState, useEffect, useCallback } from 'react';
import { useInView } from '../hooks/useAnimations';

const INITIAL_SHOW = 6;  // 3 full + 3 half-visible with fade
const LOAD_MORE = 9;

export default function GallerySection({ gallery }) {
  const [secRef, secInView] = useInView(0.1);
  const categories = ['All', ...new Set(gallery.map(g => g.category))];
  const [activeCat, setActiveCat] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_SHOW);
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeCat === 'All' ? gallery : gallery.filter(g => g.category === activeCat);
  const toShow = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;
  const isClipped = visibleCount <= INITIAL_SHOW && filtered.length > INITIAL_SHOW;

  // Reset on filter change
  useEffect(() => {
    setVisibleCount(INITIAL_SHOW);
  }, [activeCat]);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount(v => v + LOAD_MORE);
  }, []);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <section id="gallery" ref={secRef} style={{ padding: '100px clamp(20px, 5vw, 60px)' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-[0.9rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
              Gallery
            </div>
            <h2
              className="font-display font-semibold text-eco-cream leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
            >
              Our <span className="text-eco-gold">Gallery</span>
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap"
               style={{ WebkitOverflowScrolling: 'touch' }}>
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

          {/* Gallery Grid with clip wrapper */}
          <div className={`relative overflow-hidden transition-all duration-700 ease-out ${
            isClipped ? 'max-h-[480px] md:max-h-[520px]' : ''
          }`} style={!isClipped ? { maxHeight: 'none' } : undefined}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {toShow.map((img, i) => (
                <div
                  key={img.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3]
                             transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:z-10"
                  style={{
                    animation: secInView ? `fadeSlideUp 0.5s ${i * 0.05}s both` : 'none',
                    opacity: 0,
                  }}
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Translucent green-gold overlay — clears on hover */}
                  <div className="absolute inset-0 bg-eco-dark/30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
                  <div className="absolute inset-0 bg-gradient-to-br from-eco-green/20 to-eco-gold/10 transition-opacity duration-500 group-hover:opacity-0" />
                  {/* Info on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pt-10
                                  bg-gradient-to-t from-eco-dark/90 to-transparent
                                  opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <div className="inline-block bg-eco-gold/15 border border-eco-gold/25 px-2.5 py-0.5 rounded-full
                                    text-[0.6rem] tracking-wider uppercase text-eco-gold mb-1">
                      {img.category}
                    </div>
                    <div className="font-display text-sm text-eco-cream font-semibold">{img.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fade overlay when clipped */}
            {isClipped && (
              <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-10
                              bg-gradient-to-t from-eco-dark via-eco-dark/95 to-transparent" />
            )}
          </div>

          {/* Load More */}
          <div className="text-center mt-6 relative z-20" style={isClipped ? { marginTop: '-24px' } : undefined}>
            {remaining > 0 ? (
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-2 bg-transparent border border-eco-gold/25 text-eco-gold
                           px-8 py-3 rounded-full text-[0.8rem] tracking-wider uppercase font-medium
                           transition-all duration-300 hover:bg-eco-gold/10 hover:border-eco-gold group"
              >
                <span>Load More ({remaining} remaining)</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            ) : filtered.length > INITIAL_SHOW && (
              <div className="text-eco-cream/25 text-[0.75rem] tracking-wider">All {filtered.length} images loaded</div>
            )}
            <div className="text-eco-cream/20 text-[0.7rem] mt-2">
              Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] bg-eco-dark/95 backdrop-blur-xl flex items-center justify-center
                     animate-[fadeIn_0.3s_both]"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 w-11 h-11 rounded-full bg-eco-gold/10 border border-eco-gold/20
                       text-eco-gold text-xl flex items-center justify-center transition-colors hover:bg-eco-gold/20"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          <img
            src={lightbox.imageUrl}
            alt={lightbox.title}
            className="max-w-[90vw] max-h-[85vh] rounded-xl border border-eco-gold/15 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="inline-block bg-eco-gold/15 border border-eco-gold/25 px-3 py-1 rounded-full
                            text-[0.65rem] tracking-wider uppercase text-eco-gold mb-1">
              {lightbox.category}
            </div>
            <div className="font-display text-lg text-eco-cream font-semibold">{lightbox.title}</div>
          </div>
        </div>
      )}
    </>
  );
}
