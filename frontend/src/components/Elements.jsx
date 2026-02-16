export function Badge({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-gold/20 text-gold-strong border border-gold/30',
    light: 'bg-teal/10 text-teal border border-teal/30',
    outline: 'border border-gold/40 text-muted hover:text-ink',
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function Stat({ number, label, description, animated = false, delay = 0 }) {
  return (
    <div
      className={`text-center space-y-2 ${animated ? 'animate-fadeUp' : ''}`}
      style={animated ? { animationDelay: `${delay}ms` } : {}}
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
        {number}
      </div>
      <div className="prose-label">{label}</div>
      {description && <p className="prose-description">{description}</p>}
    </div>
  )
}

export function Timeline({ items, animated = false }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold to-transparent" />

      <div className="space-y-8 md:space-y-12 pl-8 md:pl-12">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`relative ${animated ? 'animate-fadeUp' : ''}`}
            style={animated ? { animationDelay: `${idx * 100}ms` } : {}}
          >
            {/* Timeline dot */}
            <div className="absolute -left-6 md:-left-8 top-2 w-4 h-4 rounded-full bg-gold border-4 border-white shadow-lg" />

            {/* Content */}
            <div className="card-base p-4 md:p-6 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 md:justify-between">
                <h3 className="prose-title">{item.title}</h3>
                {item.date && <span className="text-sm text-muted font-medium">{item.date}</span>}
              </div>
              {item.subtitle && <p className="prose-label text-xs">{item.subtitle}</p>}
              {item.description && <p className="prose-description">{item.description}</p>}
              {item.tags && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gold/10">
                  {item.tags.map((tag, i) => (
                    <Badge key={i} variant="light" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GridCard({ icon, title, description, highlight = false, animated = false, delay = 0 }) {
  return (
    <div
      className={`${highlight ? 'card-premium' : 'card-hover'} p-6 md:p-8 space-y-4 ${animated ? 'animate-fadeUp' : ''}`}
      style={animated ? { animationDelay: `${delay}ms` } : {}}
    >
      {icon && (
        <div className="text-4xl md:text-5xl">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="prose-title">{title}</h3>
        <p className="prose-description">{description}</p>
      </div>
    </div>
  )
}

export function Divider({ className = '' }) {
  return <div className={`divider-thin my-8 md:my-12 ${className}`} />
}
