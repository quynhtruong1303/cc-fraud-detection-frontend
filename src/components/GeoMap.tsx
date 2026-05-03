import { useEffect, useMemo, useState } from 'react'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { GeoRow } from '../api'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
const W = 800
const H = 500

const LEGEND = [
  { color: '#34d399', label: '< 4%' },
  { color: '#fbbf24', label: '4 - 8%' },
  { color: '#f97316', label: '8 - 15%' },
  { color: '#ef4444', label: '> 15%' },
]

function fraudColor(rate: number) {
  if (rate >= 0.15) return '#ef4444'
  if (rate >= 0.08) return '#f97316'
  if (rate >= 0.04) return '#fbbf24'
  return '#34d399'
}

type Props = { data: GeoRow[] }

export default function GeoMap({ data }: Props) {
  const [paths, setPaths] = useState<string[]>([])
  const projection = useMemo(() => geoAlbersUsa().scale(1000).translate([W / 2, H / 2]), [])

  useEffect(() => {
    const path = geoPath(projection)
    fetch(GEO_URL)
      .then(r => r.json())
      .then((topo: Topology) => {
        const states = feature(topo, topo.objects.states as GeometryCollection)
        const statePaths = (states.features as GeoJSON.Feature[]).map(f => path(f) ?? '')
        setPaths(statePaths)
      })
  }, [projection])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="var(--surface-2)" stroke="var(--border-2)" strokeWidth={0.5} />
      ))}
      {data.map(row => {
        const coords = projection([row.long, row.lat])
        if (!coords) return null
        const [x, y] = coords
        return (
          <circle
            key={`${row.state}-${row.city}`}
            cx={x}
            cy={y}
            r={Math.max(2, Math.sqrt(row.total_transactions) * 0.18)}
            fill={fraudColor(row.fraud_rate)}
            fillOpacity={0.75}
          >
            <title>{row.city}, {row.state} - fraud rate: {(row.fraud_rate * 100).toFixed(1)}%</title>
          </circle>
        )
      })}

      <g transform={`translate(${W - 130}, ${H - 90})`}>
        <rect x={-10} y={-14} width={128} height={86} rx={6} fill="#111418" fillOpacity={0.85} stroke="rgba(148,163,184,0.18)" strokeWidth={1} />
        <text x={0} y={0} fontSize={10} fontWeight={700} fill="#64748b" letterSpacing="0.08em" textAnchor="start" style={{ textTransform: 'uppercase' }}>Fraud Rate</text>
        {LEGEND.map(({ color, label }, i) => (
          <g key={label} transform={`translate(0, ${16 + i * 16})`}>
            <circle cx={5} cy={0} r={5} fill={color} fillOpacity={0.85} />
            <text x={16} y={4} fontSize={11} fill="#94a3b8">{label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}
