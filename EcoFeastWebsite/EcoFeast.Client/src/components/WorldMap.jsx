import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const REGIONS = [
  { name: 'Africa', coordinates: [20, 5] },
  { name: 'Middle East', coordinates: [48, 28] },
  { name: 'Europe', coordinates: [15, 50] },
  { name: 'USA', coordinates: [-95, 40] },
  { name: 'South America', coordinates: [-58, -15] },
  { name: 'Asia', coordinates: [105, 35] },
  { name: 'India', coordinates: [78, 22], home: true },
];

const INDIA_COORDS = [78, 22];

export default function WorldMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 148,
        center: [35, 22],
      }}
      width={800}
      height={450}
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Country shapes */}
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="rgba(201,169,110,0.1)"
              stroke="rgba(201,169,110,0.22)"
              strokeWidth={0.5}
              style={{
                default: { outline: 'none' },
                hover: { fill: 'rgba(201,169,110,0.15)', outline: 'none' },
                pressed: { outline: 'none' },
              }}
            />
          ))
        }
      </Geographies>

      {/* Dashed lines from India to each target region */}
      {REGIONS.filter(r => !r.home).map(r => (
        <Line
          key={r.name}
          from={INDIA_COORDS}
          to={r.coordinates}
          stroke={hovered === r.name ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.22)'}
          strokeWidth={1.2}
          strokeDasharray="6 3"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s' }}
        />
      ))}

      {/* Region markers */}
      {REGIONS.map(r => (
        <Marker
          key={r.name}
          coordinates={r.coordinates}
          onMouseEnter={() => setHovered(r.name)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
        >
          {r.home ? (
            <>
              {/* Pulsing ring for India */}
              <circle r={10} fill="rgba(201,169,110,0.12)" stroke="rgba(201,169,110,0.35)" strokeWidth={1}>
                <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle r={5.5} fill="#C9A96E" />
              {/* Always-visible label for India */}
              <text
                textAnchor="middle"
                y={-14}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  fill: '#C9A96E',
                }}
              >
                India
              </text>
            </>
          ) : (
            <>
              {/* Hover glow */}
              <circle
                r={hovered === r.name ? 12 : 8}
                fill={hovered === r.name ? 'rgba(201,169,110,0.2)' : 'rgba(201,169,110,0.06)'}
                stroke={hovered === r.name ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.15)'}
                strokeWidth={0.8}
                style={{ transition: 'all 0.3s' }}
              />
              {/* Dot */}
              <circle r={4.5} fill="rgba(201,169,110,0.75)" />
              {/* Tooltip on hover */}
              {hovered === r.name && (
                <>
                  <rect
                    x={-34} y={-28}
                    width={68} height={20}
                    rx={5}
                    fill="rgba(12,26,10,0.94)"
                    stroke="rgba(201,169,110,0.3)"
                    strokeWidth={0.6}
                  />
                  <text
                    textAnchor="middle"
                    y={-14}
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 10,
                      fontWeight: 600,
                      fill: '#C9A96E',
                    }}
                  >
                    {r.name}
                  </text>
                </>
              )}
            </>
          )}
        </Marker>
      ))}
    </ComposableMap>
  );
}

export { REGIONS };
