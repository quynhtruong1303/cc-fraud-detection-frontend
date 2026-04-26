import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
}

export default function Panel({ title, subtitle, right, children }: PanelProps) {
  return (
    <section className="panel">
      <header className="panelHeader">
        <div>
          <h2 className="panelTitle">{title}</h2>
          {subtitle ? <p className="panelSubtitle">{subtitle}</p> : null}
        </div>
        {right ? <div className="panelRight">{right}</div> : null}
      </header>
      <div className="panelBody">{children}</div>
    </section>
  )
}