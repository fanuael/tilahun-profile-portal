import { useEffect, useRef } from 'react'

// Main Card Component
export function Card({ 
  children, 
  className = '',
  hover = true,
  onClick,
  animated = true,
  delay = 0
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!animated) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeUp')
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animated])

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        rounded-2xl overflow-hidden bg-white/85 backdrop-blur-xl border border-slate-200/80 
        transition-all duration-300 opacity-0 shadow-card
        ${hover ? 'hover:shadow-card-hover hover:border-amber-400/40 hover:bg-white/90 hover:-translate-y-1 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Card Header
export function CardHeader({ children, className = '', icon, title, subtitle }) {
  return (
    <div className={`p-7 md:p-9 pb-5 md:pb-7 border-b border-slate-100/80 ${className}`}>
      {icon && <div className="text-4xl md:text-5xl mb-4">{icon}</div>}
      {title && <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{title}</h3>}
      {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
      {children}
    </div>
  )
}

// Card Content
export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-7 md:p-9 ${className}`}>
      {children}
    </div>
  )
}

// Card Footer
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-7 md:p-9 pt-5 md:pt-7 border-t border-slate-100/80 ${className}`}>
      {children}
    </div>
  )
}

// Stat Card Component
export function StatCard({ icon, label, value, subtitle }) {
  return (
    <Card className="p-6 md:p-8 text-center">
      <div className="text-4xl md:text-5xl mb-4">{icon}</div>
      <p className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">{value}</p>
      <p className="font-semibold text-slate-900 mb-1">{label}</p>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </Card>
  )
}

// Experience/Timeline Card
export function TimelineCard({ 
  icon,
  period,
  title,
  organization,
  description,
  highlights = [],
  location
}) {
  return (
    <Card className="p-6 md:p-8 border-l-4 border-l-amber-500">
      <div className="space-y-4">
        {icon && <div className="text-4xl">{icon}</div>}
        
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              {period}
            </span>
          </div>
          <p className="text-lg font-semibold text-amber-600 mb-1">{organization}</p>
          {location && <p className="text-sm text-slate-500">📍 {location}</p>}
        </div>

        {description && <p className="text-slate-700 leading-relaxed">{description}</p>}

        {highlights.length > 0 && (
          <ul className="space-y-2 pt-4">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="flex gap-3 items-start text-sm text-slate-700">
                <span className="text-amber-500 font-bold flex-shrink-0">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

// Skill Badge Card
export function SkillBadge({ icon, label, level }) {
  return (
    <Card className="p-4 md:p-6 text-center hover:shadow-lg">
      {icon && <div className="text-3xl md:text-4xl mb-3">{icon}</div>}
      <h4 className="font-bold text-slate-900 mb-2">{label}</h4>
      {level && (
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${level}%` }}
          ></div>
        </div>
      )}
    </Card>
  )
}

// Feature Card (for ideas/projects)
export function FeatureCard({ 
  icon, 
  title, 
  description, 
  tags = [],
  image,
  link
}) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl" onClick={() => link && window.open(link)}>
      {image && (
        <div className="h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="space-y-4">
        <div className="flex gap-3 items-start">
          {icon && <div className="text-4xl flex-shrink-0">{icon}</div>}
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Testimonial/Quote Card
export function QuoteCard({ text, author, role }) {
  return (
    <Card className="p-8 bg-gradient-to-br from-amber-50 to-slate-50 border-l-4 border-l-amber-500">
      <p className="text-lg text-slate-800 italic mb-4 leading-relaxed">
        "{text}"
      </p>
      <div>
        <p className="font-bold text-slate-900">{author}</p>
        <p className="text-sm text-slate-600">{role}</p>
      </div>
    </Card>
  )
}

// Publication Card
export function PublicationCard({
  icon,
  title,
  year,
  type,
  status,
  summary,
  tags = [],
  link
}) {
  return (
    <Card className="p-6 md:p-8">
      <div className="space-y-4">
        {icon && <div className="text-3xl">{icon}</div>}
        
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            {type && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                {type}
              </span>
            )}
            {status && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                {status}
              </span>
            )}
          </div>
          {year && <p className="text-sm text-slate-500">Published {year}</p>}
        </div>

        {summary && (
          <p className="text-slate-700 leading-relaxed text-sm">{summary}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {link && (
          <button
            onClick={() => window.open(link)}
            className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Learn More
          </button>
        )}
      </div>
    </Card>
  )
}

export default Card
