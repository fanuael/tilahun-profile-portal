export default function Section({ title, subtitle, children }) {
  return (
    <section className="section">
      <div className="section-shell">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">{subtitle}</p>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="section-body">{children}</div>
      </div>
    </section>
  )
}
