type PlaceholderProps = {
  height?: number
  label?: string
}

export default function Placeholder({ height = 220, label }: PlaceholderProps) {
  return (
    <div className="placeholder" style={{ height }}>
      <div className="placeholderInner">
        <div className="placeholderTitle">{label ?? 'Chart placeholder'}</div>
        <div className="placeholderText">
          Replace with Superset embed or a real chart component later.
        </div>
      </div>
    </div>
  )
}