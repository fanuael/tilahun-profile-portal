export default function Section({ title, subtitle, children }) {
  return (
    <section className="px-[5vw] py-8">
      <div className="max-w-[1180px] mx-auto p-8 md:p-12 rounded-xl2 bg-white/70 backdrop-blur-sm border border-ink/5 shadow-soft">
        <div className="mb-10">
          <p className="text-muted text-xs uppercase tracking-[0.2em] mb-2">{subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">{title}</h2>
          <div className="w-24 h-1 rounded-full bg-gradient-to-r from-gold to-teal/50" />
        </div>
        <div className="animate-fadeUp">{children}</div>
      </div>
    </section>
  )
}

export function SectionHeader({ label, title, description, animated = false }) {
  return (
    <div className={`max-w-[1180px] mx-auto mb-12 md:mb-16 space-y-4 ${animated ? 'animate-fadeUp' : ''}`}>
      {label && (
        <p className="prose-label">
          {label}
        </p>
      )}
      {title && (
        <h2 className="prose-heading">
          {title}
        </h2>
      )}
      <div className="accent-line" />
      {description && (
        <p className="prose-description max-w-2xl text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export function SectionContainer({ children, className = '' }) {
  return (
    <section className={`section-padding ${className}`}>
      {children}
    </section>
  )
}

export function Container({ children, className = '' }) {
  return (
    <div className={`max-w-[1180px] mx-auto w-full ${className}`}>
      {children}
    </div>
  )
}
