import { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function WorldMap({ countries = [] }) {
  const [hovered, setHovered] = useState(null);

  // Derive home country (first isHome=true) and targets (everything else)
  const { home, targets } = useMemo(() => {
    const active = countries.filter(c => c.isActive !== false);
    const h = active.find(c => c.isHome) || null;
    const t = active.filter(c => !c.isHome);
    return { home: h, targets: t };
  }, [countries]);

  const homeCoords = home ? [home.longitude, home.latitude] : null;

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

      {/* Dashed lines from home to each target */}
      {homeCoords && targets.map(r => (
        <Line
          key={`line-${r.id ?? r.name}`}
          from={homeCoords}
          to={[r.longitude, r.latitude]}
          stroke={hovered === r.name ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.22)'}
          strokeWidth={1.2}
          strokeDasharray="6 3"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s' }}
        />
      ))}

      {/* Target markers */}
      {targets.map(r => (
        <Marker
          key={`marker-${r.id ?? r.name}`}
          coordinates={[r.longitude, r.latitude]}
          onMouseEnter={() => setHovered(r.name)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
        >
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
                x={-(Math.max(68, r.name.length * 6.5)) / 2}
                y={-28}
                width={Math.max(68, r.name.length * 6.5)}
                height={20}
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
        </Marker>
      ))}

      {/* Home marker (rendered last so its pulse sits on top) */}
      {home && (
        <Marker
          coordinates={homeCoords}
          onMouseEnter={() => setHovered(home.name)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
        >
          <circle r={10} fill="rgba(201,169,110,0.12)" stroke="rgba(201,169,110,0.35)" strokeWidth={1}>
            <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r={5.5} fill="#C9A96E" />
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
            {home.name}
          </text>
        </Marker>
      )}
    </ComposableMap>
  );
}
