export default function LeafDecoration({ style }) {
  return (
    <svg
      viewBox="0 0 120 120"
      style={{ width: 120, height: 120, opacity: 0.04, position: 'absolute', ...style }}
    >
      <path d="M60,10 Q90,30 80,60 Q70,90 60,110 Q50,90 40,60 Q30,30 60,10Z" fill="#C9A96E" />
      <path d="M30,40 Q60,50 90,40" fill="none" stroke="#C9A96E" strokeWidth="1" />
      <path d="M35,55 Q60,65 85,55" fill="none" stroke="#C9A96E" strokeWidth="1" />
      <path d="M40,70 Q60,78 80,70" fill="none" stroke="#C9A96E" strokeWidth="1" />
    </svg>
  );
}
