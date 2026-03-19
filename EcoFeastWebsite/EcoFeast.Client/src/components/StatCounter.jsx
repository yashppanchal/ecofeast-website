import { useCounter } from '../hooks/useAnimations';

export default function StatCounter({ label, value, suffix, delay, trigger }) {
  const count = useCounter(value, 2200, trigger);

  return (
    <div
      className="text-center"
      style={{
        animation: trigger ? `fadeSlideUp 0.7s ${delay}s both` : 'none',
        opacity: 0,
      }}
    >
      <div className="font-display text-[3.2rem] font-bold text-eco-gold leading-none">
        {count}{suffix}
      </div>
      <div className="text-[0.85rem] tracking-[0.15em] uppercase text-white/70 mt-1.5 font-medium">
        {label}
      </div>
    </div>
  );
}
