import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { CategoryRow } from '../api'

const GROUP_COLORS: Record<string, string> = {
  Food:      '#34d399',
  Transport: '#60a5fa',
  Health:    '#a78bfa',
  Home:      '#f9a8d4',
  Misc:      '#94a3b8',
  Shopping:  '#fbbf24',
  Travel:    '#fb923c',
  Leisure:   '#f472b6',
}

function pct(rate: number) {
  return `${(rate * 100).toFixed(2)}%`
}

type Props = { data: CategoryRow[] }

export default function CategoryChart({ data }: Props) {
  const chartData = data.map(r => ({
    label: r.display_label ?? r.category,
    fraud_rate: parseFloat((r.fraud_rate * 100).toFixed(2)),
    group: r.category_group,
  }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 48, bottom: 4, left: 120 }}
      >
        <XAxis
          type="number"
          tickFormatter={v => `${v}%`}
          tick={{ fill: 'var(--muted-2)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={116}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontSize: 12,
          }}
          formatter={(value: number, _name: string, entry: { payload?: { group?: string } }) => [
            `${value}%`,
            entry.payload?.group ?? 'Fraud rate',
          ]}
        />
        <Bar dataKey="fraud_rate" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={GROUP_COLORS[entry.group] ?? '#94a3b8'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export { pct }
