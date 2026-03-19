export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-eco-dark flex flex-col items-center justify-center">
      <div
        className="w-16 h-16 rounded-full border-2 border-eco-gold/20 border-t-eco-gold"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <div className="mt-6 font-display text-eco-gold text-lg">EcoFeast Nutrients</div>
      <div className="mt-2 text-[0.75rem] text-eco-cream/40 tracking-[0.2em] uppercase">Loading...</div>
    </div>
  );
}
