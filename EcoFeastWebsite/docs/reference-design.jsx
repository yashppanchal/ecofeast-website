import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG / DATA ───────────────────────────────────────────────
const STATS = [
  { label: "Trades Completed", value: 150, suffix: "+" },
  { label: "Happy Buyers", value: 45, suffix: "+" },
  { label: "Countries Served", value: 12, suffix: "" },
  { label: "Products Exported", value: 11, suffix: "" },
];

const PRODUCTS = [
  { name: "Fresh Onions", hs: "07031019", category: "Fresh Vegetables", emoji: "🧅" },
  { name: "Alphonso Mangoes", hs: "08045021", category: "Fresh Fruits", emoji: "🥭" },
  { name: "Pomegranates", hs: "08109010", category: "Fresh Fruits", emoji: "🍎" },
  { name: "Fresh Grapes", hs: "08061000", category: "Fresh Fruits", emoji: "🍇" },
  { name: "Fresh Bananas", hs: "08039010", category: "Fresh Fruits", emoji: "🍌" },
  { name: "Green Chilly", hs: "07096010", category: "Fresh Vegetables", emoji: "🌶️" },
  { name: "Basmati Rice", hs: "10063020", category: "Cereals", emoji: "🍚" },
  { name: "Chilly Powder", hs: "09042211", category: "Spices", emoji: "🫙" },
  { name: "Ladoos", hs: "21069099", category: "Processed Foods", emoji: "🍬" },
  { name: "Sweet Corn Frozen", hs: "07104000", category: "Frozen", emoji: "🌽" },
  { name: "Mix Vegetables Frozen", hs: "07109000", category: "Frozen", emoji: "🥦" },
];

const STRENGTHS = [
  { title: "Established Supplier", desc: "Proven track record in fresh onion exports with consistent domestic and international supply chain." },
  { title: "Pan-India Sourcing", desc: "Strong procurement network across major agricultural belts — Maharashtra, Gujarat, Karnataka, and more." },
  { title: "Quality & Safety", desc: "FSSAI licensed, APEDA registered, with lab testing and inspections per destination country standards." },
  { title: "Logistics Excellence", desc: "End-to-end export documentation, FOB/CIF/CFR support, and a reliable freight partner network." },
  { title: "Custom Packaging", desc: "Bulk packing in 10kg, 25kg, 50kg bags with custom labeling options for buyer specifications." },
  { title: "Long-term Partners", desc: "We build relationships, not transactions. Flexible planning, repeat supply, and after-sales coordination." },
];

const CERTIFICATIONS = ["FSSAI Central License", "APEDA Registration (RCMC)", "Import Export Code (IEC)", "GST Registration", "PAN & Statutory Registrations"];

const REGIONS = [
  { name: "Africa", x: 52, y: 48 },
  { name: "Middle East", x: 62, y: 40 },
  { name: "Europe", x: 53, y: 28 },
  { name: "USA", x: 22, y: 35 },
  { name: "South America", x: 30, y: 62 },
  { name: "Asia", x: 72, y: 42 },
  { name: "India", x: 67, y: 44, home: true },
];

// ─── ANIMATED COUNTER HOOK ──────────────────────────────────────
function useCounter(end, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, duration]);
  return count;
}

// ─── INTERSECTION OBSERVER HOOK ─────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── STAT COUNTER COMPONENT ────────────────────────────────────
function StatCounter({ label, value, suffix, delay, trigger }) {
  const count = useCounter(value, 2200, trigger);
  return (
    <div
      className="text-center"
      style={{ animation: trigger ? `fadeSlideUp 0.7s ${delay}s both` : "none", opacity: 0 }}
    >
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.2rem", fontWeight: 700, color: "#C9A96E", lineHeight: 1.1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginTop: 6, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ──────────────────────────────────────────────
function ProductCard({ product, index, inView }) {
  const categoryColors = {
    "Fresh Vegetables": { bg: "#1a3a1a", border: "#2d5a2d" },
    "Fresh Fruits": { bg: "#3a2a1a", border: "#5a4a2a" },
    "Cereals": { bg: "#2a2a1a", border: "#4a4a2a" },
    "Spices": { bg: "#3a1a1a", border: "#5a2a2a" },
    "Processed Foods": { bg: "#2a1a2a", border: "#4a2a4a" },
    "Frozen": { bg: "#1a2a3a", border: "#2a4a5a" },
  };
  const colors = categoryColors[product.category] || categoryColors["Fresh Vegetables"];
  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: "24px 20px",
        animation: inView ? `fadeSlideUp 0.6s ${0.05 * index}s both` : "none",
        opacity: 0,
        cursor: "default",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ fontSize: "2.4rem", marginBottom: 10 }}>{product.emoji}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: "#E8E0D0", marginBottom: 4 }}>
        {product.name}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#C9A96E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>
        {product.category}
      </div>
      <div style={{
        display: "inline-block",
        background: "rgba(201,169,110,0.12)",
        border: "1px solid rgba(201,169,110,0.25)",
        borderRadius: 8,
        padding: "4px 10px",
        fontSize: "0.75rem",
        color: "#C9A96E",
        fontFamily: "monospace",
      }}>
        HS: {product.hs}
      </div>
    </div>
  );
}

// ─── WORLD MAP SVG ─────────────────────────────────────────────
function WorldMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  return (
    <svg viewBox="0 0 100 70" style={{ width: "100%", maxWidth: 700 }}>
      {/* Simplified continents as paths */}
      <g fill="rgba(201,169,110,0.08)" stroke="rgba(201,169,110,0.2)" strokeWidth="0.3">
        {/* North America */}
        <path d="M5,15 Q10,10 20,12 L28,18 Q30,22 28,30 L22,38 Q18,40 14,38 L8,30 Q4,22 5,15Z"/>
        {/* South America */}
        <path d="M22,42 Q26,40 30,44 L32,52 Q34,60 30,65 L26,66 Q22,64 20,58 L18,50 Q18,44 22,42Z"/>
        {/* Europe */}
        <path d="M44,14 Q48,10 54,12 L58,16 Q60,20 58,24 L54,28 Q50,30 46,28 L44,22 Q42,18 44,14Z"/>
        {/* Africa */}
        <path d="M44,32 Q48,28 54,30 L58,36 Q62,44 60,54 L56,60 Q52,62 48,58 L44,48 Q40,40 44,32Z"/>
        {/* Asia */}
        <path d="M60,12 Q68,8 78,12 L84,18 Q88,24 86,32 L82,40 Q76,48 68,46 L62,40 Q58,32 58,24 L60,12Z"/>
        {/* India */}
        <path d="M64,34 Q66,32 70,34 L72,40 Q74,46 72,50 L68,52 Q64,50 62,46 L62,40 Q62,36 64,34Z"/>
        {/* Australia */}
        <path d="M76,52 Q80,48 86,50 L90,54 Q92,58 88,62 L82,64 Q78,62 76,58 L76,52Z"/>
      </g>
      {/* Animated pulse dots for each region */}
      {REGIONS.map((r, i) => (
        <g key={r.name} onMouseEnter={() => setHoveredRegion(r.name)} onMouseLeave={() => setHoveredRegion(null)}>
          {r.home ? (
            <>
              <circle cx={r.x} cy={r.y} r="1.8" fill="#C9A96E" opacity="0.9">
                <animate attributeName="r" values="1.8;3;1.8" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={r.x} cy={r.y} r="1" fill="#C9A96E"/>
            </>
          ) : (
            <>
              <circle cx={r.x} cy={r.y} r="1.2" fill="rgba(201,169,110,0.6)" opacity="0.7">
                <animate attributeName="r" values="1.2;2.2;1.2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={r.x} cy={r.y} r="0.7" fill="rgba(201,169,110,0.8)"/>
              {/* Connection lines from India */}
              <line x1={67} y1={44} x2={r.x} y2={r.y} stroke="rgba(201,169,110,0.15)" strokeWidth="0.2" strokeDasharray="1 1"/>
            </>
          )}
          {hoveredRegion === r.name && (
            <g>
              <rect x={r.x - 8} y={r.y - 7} width={16} height={5} rx="1" fill="rgba(0,0,0,0.8)"/>
              <text x={r.x} y={r.y - 3.5} textAnchor="middle" fill="#C9A96E" fontSize="2.5" fontWeight="600">{r.name}</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

// ─── LEAF DECORATION SVG ───────────────────────────────────────
function LeafDecoration({ style }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, opacity: 0.04, position: "absolute", ...style }}>
      <path d="M60,10 Q90,30 80,60 Q70,90 60,110 Q50,90 40,60 Q30,30 60,10Z" fill="#C9A96E"/>
      <path d="M30,40 Q60,50 90,40" fill="none" stroke="#C9A96E" strokeWidth="1"/>
      <path d="M35,55 Q60,65 85,55" fill="none" stroke="#C9A96E" strokeWidth="1"/>
      <path d="M40,70 Q60,78 80,70" fill="none" stroke="#C9A96E" strokeWidth="1"/>
    </svg>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────
export default function EcoFeastWebsite() {
  const [heroRef, heroInView] = useInView(0.3);
  const [prodRef, prodInView] = useInView(0.15);
  const [strRef, strInView] = useInView(0.15);
  const [mapRef, mapInView] = useInView(0.2);
  const [certRef, certInView] = useInView(0.2);
  const [contactRef, contactInView] = useInView(0.2);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Products", id: "products" },
    { label: "Strengths", id: "strengths" },
    { label: "Global Reach", id: "global" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div style={{ background: "#0C1A0A", color: "#E8E0D0", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 20px rgba(201,169,110,0.15); } 50% { box-shadow: 0 0 40px rgba(201,169,110,0.3); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(201,169,110,0.3); color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0C1A0A; }
        ::-webkit-scrollbar-thumb { background: #2B3A1B; border-radius: 3px; }
        input, textarea { font-family: inherit; }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 60 ? "rgba(12,26,10,0.95)" : "transparent",
        backdropFilter: scrollY > 60 ? "blur(12px)" : "none",
        borderBottom: scrollY > 60 ? "1px solid rgba(201,169,110,0.1)" : "none",
        transition: "all 0.4s",
        padding: "0 clamp(16px, 4vw, 60px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#C9A96E",
              letterSpacing: "0.02em",
            }}>
              EF
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#E8E0D0", lineHeight: 1.2 }}>EcoFeast</div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(201,169,110,0.7)", textTransform: "uppercase" }}>Nutrients Pvt. Ltd.</div>
            </div>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {navLinks.map(l => (
              <span
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{ fontSize: "0.85rem", color: "rgba(232,224,208,0.7)", cursor: "pointer", letterSpacing: "0.05em", transition: "color 0.3s", fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = "#C9A96E"}
                onMouseLeave={e => e.target.style.color = "rgba(232,224,208,0.7)"}
              >
                {l.label}
              </span>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              style={{
                background: "linear-gradient(135deg, #C9A96E, #A88B4A)",
                color: "#0C1A0A",
                border: "none",
                borderRadius: 8,
                padding: "10px 22px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 4px 20px rgba(201,169,110,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
            >
              Get in Touch
            </button>
          </div>

          {/* Mobile hamburger */}
          <div
            style={{ display: "none", cursor: "pointer", padding: 8 }}
            className="mobile-menu-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <div style={{ width: 24, height: 2, background: "#C9A96E", marginBottom: 5, transition: "0.3s", transform: mobileMenu ? "rotate(45deg) translateY(7px)" : "none" }}/>
            <div style={{ width: 24, height: 2, background: "#C9A96E", marginBottom: 5, opacity: mobileMenu ? 0 : 1, transition: "0.3s" }}/>
            <div style={{ width: 24, height: 2, background: "#C9A96E", transition: "0.3s", transform: mobileMenu ? "rotate(-45deg) translateY(-7px)" : "none" }}/>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{
            position: "absolute", top: 70, left: 0, right: 0,
            background: "rgba(12,26,10,0.98)",
            backdropFilter: "blur(20px)",
            padding: "20px 30px",
            borderBottom: "1px solid rgba(201,169,110,0.15)",
          }}>
            {navLinks.map(l => (
              <div
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{ padding: "14px 0", fontSize: "1rem", color: "rgba(232,224,208,0.8)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                {l.label}
              </div>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .strengths-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .section-title { font-size: 2rem !important; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .hero-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ═══ HERO SECTION ═══ */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          padding: "120px clamp(20px, 5vw, 60px) 80px",
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 20%, rgba(43,58,27,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(201,169,110,0.06) 0%, transparent 50%)",
          zIndex: 0,
        }}/>
        <LeafDecoration style={{ top: "10%", left: "5%", transform: "rotate(-30deg)" }}/>
        <LeafDecoration style={{ bottom: "15%", right: "8%", transform: "rotate(45deg)" }}/>
        <LeafDecoration style={{ top: "40%", right: "3%", transform: "rotate(15deg)", width: 80, height: 80 }}/>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
          {/* Logo Mark */}
          <div style={{
            animation: heroInView ? "fadeSlideUp 0.8s both" : "none",
            opacity: 0,
            marginBottom: 24,
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "2px solid rgba(201,169,110,0.3)",
              fontSize: "2rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: "#C9A96E",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}>
              EF
            </div>
          </div>

          {/* Eyebrow */}
          <div style={{
            animation: heroInView ? "fadeSlideUp 0.8s 0.15s both" : "none",
            opacity: 0,
            fontSize: "0.8rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: 16,
            fontWeight: 500,
          }}>
            EcoFeast Nutrients Pvt. Ltd.
          </div>

          {/* Headline */}
          <h1
            className="section-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#E8E0D0",
              lineHeight: 1.15,
              marginBottom: 20,
              animation: heroInView ? "fadeSlideUp 0.8s 0.3s both" : "none",
              opacity: 0,
            }}
          >
            Premium by Nature.
            <br/>
            <span style={{ color: "#C9A96E" }}>Powerful by Supply.</span>
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            color: "rgba(232,224,208,0.6)",
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto 48px",
            animation: heroInView ? "fadeSlideUp 0.8s 0.45s both" : "none",
            opacity: 0,
          }}>
            India's trusted exporter of premium agricultural commodities and food products.
            From farm to port — quality, reliability, and consistency you can count on.
          </p>

          {/* ── Stats Counters ── */}
          <div
            className="hero-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 40,
              maxWidth: 700,
              margin: "0 auto",
              padding: "36px 0",
              borderTop: "1px solid rgba(201,169,110,0.15)",
              borderBottom: "1px solid rgba(201,169,110,0.15)",
            }}
          >
            {STATS.map((s, i) => (
              <StatCounter key={s.label} {...s} delay={0.6 + i * 0.15} trigger={heroInView} />
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{
            marginTop: 48,
            animation: heroInView ? "fadeIn 1s 1.5s both" : "none",
            opacity: 0,
          }}>
            <div style={{
              width: 24, height: 40, borderRadius: 12,
              border: "1.5px solid rgba(201,169,110,0.3)",
              display: "flex", justifyContent: "center", paddingTop: 8,
              margin: "0 auto",
            }}>
              <div style={{
                width: 3, height: 8, borderRadius: 2,
                background: "#C9A96E",
                animation: "float 2s ease-in-out infinite",
              }}/>
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(201,169,110,0.4)", marginTop: 8, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Scroll to explore
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <section id="about" style={{ padding: "100px clamp(20px, 5vw, 60px)", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 16, fontWeight: 500 }}>
            Who We Are
          </div>
          <h2
            className="section-title"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: "#E8E0D0", marginBottom: 32, lineHeight: 1.2 }}
          >
            Built on Trust.{" "}
            <span style={{ color: "#C9A96E" }}>Driven by Quality.</span>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(232,224,208,0.6)", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>
            EcoFeast Nutrients is an export-focused food and agri-commodities company based in Mumbai, India.
            We specialize in sourcing, processing, and supplying high-quality agricultural and food products to
            domestic and international markets. With a strong foundation in the Indian agri-supply chain and an
            established presence in fresh onions, we are expanding our portfolio across spices, cereals, fresh
            fruits, and value-added food products to serve global buyers with confidence.
          </p>
        </div>
      </section>

      {/* ═══ MARQUEE DIVIDER ═══ */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(201,169,110,0.08)", borderBottom: "1px solid rgba(201,169,110,0.08)", padding: "14px 0" }}>
        <div style={{ display: "flex", animation: "marquee 30s linear infinite", width: "max-content" }}>
          {[...Array(2)].map((_, k) => (
            <div key={k} style={{ display: "flex", gap: 48, whiteSpace: "nowrap", paddingRight: 48 }}>
              {["Fresh Onions", "Basmati Rice", "Alphonso Mangoes", "Pomegranates", "Chilly Powder", "Green Chilly", "Grapes", "Ladoos", "Bananas"].map(p => (
                <span key={p + k} style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,169,110,0.25)", fontWeight: 500 }}>
                  {p}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PRODUCTS SECTION ═══ */}
      <section id="products" ref={prodRef} style={{ padding: "100px clamp(20px, 5vw, 60px)", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 16, fontWeight: 500 }}>
              Our Portfolio
            </div>
            <h2
              className="section-title"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: "#E8E0D0", lineHeight: 1.2 }}
            >
              From India's Farms to{" "}
              <span style={{ color: "#C9A96E" }}>Your Markets</span>
            </h2>
          </div>
          <div
            className="products-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.name} product={p} index={i} inView={prodInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STRENGTHS SECTION ═══ */}
      <section
        id="strengths"
        ref={strRef}
        style={{ padding: "100px clamp(20px, 5vw, 60px)", background: "linear-gradient(180deg, rgba(43,58,27,0.15) 0%, transparent 100%)" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 16, fontWeight: 500 }}>
              Why EcoFeast
            </div>
            <h2
              className="section-title"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: "#E8E0D0", lineHeight: 1.2 }}
            >
              Our Competitive{" "}
              <span style={{ color: "#C9A96E" }}>Edge</span>
            </h2>
          </div>
          <div
            className="strengths-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 20,
            }}
          >
            {STRENGTHS.map((s, i) => (
              <div
                key={s.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(201,169,110,0.1)",
                  borderRadius: 14,
                  padding: "28px 24px",
                  animation: strInView ? `fadeSlideUp 0.6s ${i * 0.08}s both` : "none",
                  opacity: 0,
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.1)"}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#C9A96E",
                  marginBottom: 16,
                  boxShadow: "0 0 12px rgba(201,169,110,0.4)",
                }}/>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#E8E0D0", marginBottom: 8 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: "0.88rem", color: "rgba(232,224,208,0.5)", lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS ═══ */}
      <section ref={certRef} style={{ padding: "80px clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 16, fontWeight: 500 }}>
            Compliance
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, color: "#E8E0D0", marginBottom: 36 }}>
            Quality & Regulatory Certifications
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {CERTIFICATIONS.map((c, i) => (
              <div
                key={c}
                style={{
                  background: "rgba(201,169,110,0.08)",
                  border: "1px solid rgba(201,169,110,0.15)",
                  borderRadius: 10,
                  padding: "12px 20px",
                  fontSize: "0.85rem",
                  color: "#C9A96E",
                  fontWeight: 500,
                  animation: certInView ? `fadeSlideUp 0.5s ${i * 0.1}s both` : "none",
                  opacity: 0,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GLOBAL REACH ═══ */}
      <section
        id="global"
        ref={mapRef}
        style={{ padding: "100px clamp(20px, 5vw, 60px)", background: "linear-gradient(180deg, transparent 0%, rgba(43,58,27,0.12) 100%)" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 16, fontWeight: 500 }}>
            Our Reach
          </div>
          <h2
            className="section-title"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: "#E8E0D0", marginBottom: 16, lineHeight: 1.2 }}
          >
            Connecting Indian Farms to{" "}
            <span style={{ color: "#C9A96E" }}>Global Tables</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(232,224,208,0.5)", marginBottom: 48, maxWidth: 550, margin: "0 auto 48px" }}>
            Currently serving domestic markets with active expansion into Africa, the Middle East, Europe, USA, South America, and Asia.
          </p>
          <div style={{
            animation: mapInView ? "fadeSlideUp 0.8s both" : "none",
            opacity: 0,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(201,169,110,0.08)",
            borderRadius: 20,
            padding: "40px 20px",
          }}>
            <WorldMap />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, marginTop: 32 }}>
            {REGIONS.filter(r => !r.home).map(r => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A96E", opacity: 0.6 }}/>
                <span style={{ fontSize: "0.8rem", color: "rgba(232,224,208,0.5)", letterSpacing: "0.08em" }}>{r.name}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A96E" }}/>
              <span style={{ fontSize: "0.8rem", color: "#C9A96E", fontWeight: 600, letterSpacing: "0.08em" }}>India (Home)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT / CTA ═══ */}
      <section id="contact" ref={contactRef} style={{ padding: "100px clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 16, fontWeight: 500 }}>
              Let's Connect
            </div>
            <h2
              className="section-title"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: "#E8E0D0", lineHeight: 1.2 }}
            >
              Ready to Partner{" "}
              <span style={{ color: "#C9A96E" }}>With Us?</span>
            </h2>
          </div>

          <div
            className="contact-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}
          >
            {/* Contact Info */}
            <div style={{
              animation: contactInView ? "fadeSlideUp 0.6s both" : "none",
              opacity: 0,
            }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: "0.75rem", color: "#C9A96E", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>
                  Contact Person
                </div>
                <div style={{ fontSize: "1.2rem", fontFamily: "'Playfair Display', serif", color: "#E8E0D0", fontWeight: 600 }}>
                  Kaustubh Chavan
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(232,224,208,0.5)" }}>Director</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Phone", value: "+91 96531 56090", icon: "tel" },
                  { label: "Email", value: "ecofeastnutrients@gmail.com", icon: "mail" },
                  { label: "Address", value: "B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81", icon: "loc" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "rgba(201,169,110,0.08)",
                      border: "1px solid rgba(201,169,110,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", color: "#C9A96E", flexShrink: 0,
                    }}>
                      {c.icon === "tel" ? "Ph" : c.icon === "mail" ? "Em" : "Ad"}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#C9A96E", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2, fontWeight: 500 }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "rgba(232,224,208,0.7)", lineHeight: 1.5 }}>
                        {c.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Packaging info */}
              <div style={{
                marginTop: 32,
                background: "rgba(201,169,110,0.06)",
                border: "1px solid rgba(201,169,110,0.1)",
                borderRadius: 12,
                padding: "20px",
              }}>
                <div style={{ fontSize: "0.75rem", color: "#C9A96E", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>
                  Packaging & Logistics
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(232,224,208,0.55)", lineHeight: 1.7 }}>
                  Bulk packing: 10 kg, 25 kg, 50 kg bags. Custom packing and export-ready labeling. FOB / CIF / CFR shipment support.
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{
              animation: contactInView ? "fadeSlideUp 0.6s 0.2s both" : "none",
              opacity: 0,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,169,110,0.1)",
              borderRadius: 16,
              padding: 32,
            }}>
              {formSent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>&#10003;</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#C9A96E", marginBottom: 8 }}>
                    Message Sent!
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "rgba(232,224,208,0.5)" }}>
                    We'll get back to you within 24 hours.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#E8E0D0", marginBottom: 24 }}>
                    Send us an Inquiry
                  </div>
                  {[
                    { key: "name", label: "Full Name", type: "text", ph: "Your name" },
                    { key: "email", label: "Email", type: "email", ph: "you@company.com" },
                    { key: "company", label: "Company", type: "text", ph: "Company name" },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#C9A96E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontWeight: 500 }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        value={formData[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                        placeholder={f.ph}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(201,169,110,0.15)",
                          borderRadius: 8,
                          padding: "12px 16px",
                          color: "#E8E0D0",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(201,169,110,0.4)"}
                        onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#C9A96E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontWeight: 500 }}>
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      placeholder="Tell us about your requirements..."
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(201,169,110,0.15)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: "#E8E0D0",
                        fontSize: "0.9rem",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(201,169,110,0.4)"}
                      onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #C9A96E, #A88B4A)",
                      color: "#0C1A0A",
                      border: "none",
                      borderRadius: 10,
                      padding: "14px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => { e.target.style.transform = "scale(1.02)"; e.target.style.boxShadow = "0 6px 30px rgba(201,169,110,0.35)"; }}
                    onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
                  >
                    Send Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        borderTop: "1px solid rgba(201,169,110,0.08)",
        padding: "40px clamp(20px, 5vw, 60px)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#C9A96E",
            marginBottom: 6,
          }}>
            EcoFeast Nutrients
          </div>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(232,224,208,0.3)", textTransform: "uppercase", marginBottom: 20 }}>
            Premium by Nature. Powerful by Supply.
          </div>
          <div style={{ fontSize: "0.78rem", color: "rgba(232,224,208,0.25)" }}>
            &copy; {new Date().getFullYear()} EcoFeast Nutrients Pvt. Ltd. All rights reserved. &middot; Mumbai, India
          </div>
        </div>
      </footer>
    </div>
  );
}
