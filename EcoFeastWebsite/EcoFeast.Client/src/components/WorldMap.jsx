import { useState } from 'react';

const REGIONS = [
  { name: 'Africa', x: 52, y: 48 },
  { name: 'Middle East', x: 62, y: 40 },
  { name: 'Europe', x: 53, y: 28 },
  { name: 'USA', x: 22, y: 35 },
  { name: 'South America', x: 30, y: 62 },
  { name: 'Asia', x: 72, y: 42 },
  { name: 'India', x: 67, y: 44, home: true },
];

export default function WorldMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <svg viewBox="0 0 100 70" className="w-full max-w-[700px]">
      <g fill="rgba(201,169,110,0.08)" stroke="rgba(201,169,110,0.2)" strokeWidth="0.3">
        <path d="M5,15 Q10,10 20,12 L28,18 Q30,22 28,30 L22,38 Q18,40 14,38 L8,30 Q4,22 5,15Z" />
        <path d="M22,42 Q26,40 30,44 L32,52 Q34,60 30,65 L26,66 Q22,64 20,58 L18,50 Q18,44 22,42Z" />
        <path d="M44,14 Q48,10 54,12 L58,16 Q60,20 58,24 L54,28 Q50,30 46,28 L44,22 Q42,18 44,14Z" />
        <path d="M44,32 Q48,28 54,30 L58,36 Q62,44 60,54 L56,60 Q52,62 48,58 L44,48 Q40,40 44,32Z" />
        <path d="M60,12 Q68,8 78,12 L84,18 Q88,24 86,32 L82,40 Q76,48 68,46 L62,40 Q58,32 58,24 L60,12Z" />
        <path d="M64,34 Q66,32 70,34 L72,40 Q74,46 72,50 L68,52 Q64,50 62,46 L62,40 Q62,36 64,34Z" />
        <path d="M76,52 Q80,48 86,50 L90,54 Q92,58 88,62 L82,64 Q78,62 76,58 L76,52Z" />
      </g>

      {REGIONS.map((r, i) => (
        <g key={r.name} onMouseEnter={() => setHovered(r.name)} onMouseLeave={() => setHovered(null)}>
          {r.home ? (
            <>
              <circle cx={r.x} cy={r.y} r="1.8" fill="#C9A96E" opacity="0.9">
                <animate attributeName="r" values="1.8;3;1.8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={r.x} cy={r.y} r="1" fill="#C9A96E" />
            </>
          ) : (
            <>
              <circle cx={r.x} cy={r.y} r="1.2" fill="rgba(201,169,110,0.6)" opacity="0.7">
                <animate attributeName="r" values="1.2;2.2;1.2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={r.x} cy={r.y} r="0.7" fill="rgba(201,169,110,0.8)" />
              <line x1={67} y1={44} x2={r.x} y2={r.y} stroke="rgba(201,169,110,0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
            </>
          )}
          {hovered === r.name && (
            <g>
              <rect x={r.x - 8} y={r.y - 7} width={16} height={5} rx="1" fill="rgba(0,0,0,0.8)" />
              <text x={r.x} y={r.y - 3.5} textAnchor="middle" fill="#C9A96E" fontSize="2.5" fontWeight="600">
                {r.name}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export { REGIONS };
