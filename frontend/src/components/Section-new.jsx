import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Main Container Component
export function Container({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

// Section Wrapper with Animation
export function Section({ children, className = '', id = '' }) {
  const ref = useRef(null)

  useEffect(() => {
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
  }, [])

  return (
    <section 
      id={id}
      ref={ref}
      className={`py-16 md:py-24 lg:py-32 scroll-mt-20 opacity-0 ${className}`}
    >
      {children}
    </section>
  )
}

// Hero Section Component
export function HeroSection({ 
  title, 
  subtitle, 
  description, 
  backgroundImage,
  overlayIntensity = 0.7,
  gradient = true,
  actions = [],
  features = [],
  badge
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          <img 
            src={backgroundImage} 
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          {gradient && (
            <>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900"
                style={{ opacity: overlayIntensity }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
            </>
          )}
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-slate-900"></div>

      <Container className="relative z-10 py-20 md:py-32 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slideInLeft opacity-0">
            {badge && (
              <div className="inline-block animate-fadeIn">
                <span className="px-4 py-2.5 bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-full border border-amber-500/40 shadow-lg shadow-amber-500/10">
                  {badge}
                </span>
              </div>
            )}

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-2xl md:text-3xl text-amber-300 font-semibold leading-snug">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-lg md:text-xl text-slate-200/95 leading-relaxed max-w-2xl font-medium">
                {description}
              </p>
            )}

            {/* Action Buttons */}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {actions.map((action, idx) => {
                  const isLink = action.to
                  const buttonClasses = `
                    px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center
                    ${action.variant === 'primary'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-2xl hover:scale-105'
                      : 'bg-white/20 text-white border border-white/40 hover:bg-white/30 hover:border-white/60'
                    }
                  `
                  
                  if (isLink) {
                    return (
                      <Link
                        key={idx}
                        to={action.to}
                        className={buttonClasses}
                      >
                        {action.label}
                      </Link>
                    )
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={action.onClick}
                      className={buttonClasses}
                    >
                      {action.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Features/Pills */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm hover:bg-white/20 transition-colors">
                    <span className="text-lg">{feature.icon}</span>
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Image/Visual */}
          <div className="hidden lg:block">
            <div className="animate-float opacity-0 [animation-delay:300ms]">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-500/20 to-slate-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-white/80 font-semibold">Professional Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

// Section Header with Icon/Badge
export function SectionHeader({ 
  label, 
  icon,
  title, 
  subtitle,
  centered = true,
  badge
}) {
  return (
    <div className={`space-y-4 ${centered ? 'text-center' : ''} mb-14 md:mb-16 lg:mb-20`}>
      {badge && (
        <div className="inline-block animate-fadeIn">
          <span className="px-4 py-2 bg-amber-100/90 text-amber-800 font-semibold text-xs uppercase tracking-wider rounded-full shadow-card hover:shadow-card-hover transition-shadow duration-300">
            {badge}
          </span>
        </div>
      )}

      {icon && <div className="text-5xl md:text-6xl animate-scaleIn">{icon}</div>}

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  )
}

// Grid Section for Cards/Items
export function GridSection({ children, columns = 3 }) {
  const colMap = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${colMap[columns]} gap-6 md:gap-8`}>
      {children}
    </div>
  )
}

// Content Section (text + visual)
export function ContentSection({ 
  badge,
  title, 
  description,
  content, 
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  features = []
}) {
  const leftContent = (
    <div className="space-y-6 animate-slideInLeft opacity-0 [animation-delay:100ms]">
      {badge && (
        <div className="inline-block">
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-full border border-amber-500/30">
            {badge}
          </span>
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h2>
      
      {description && (
        <p className="text-lg text-amber-400/90 leading-relaxed">
          {description}
        </p>
      )}

      {content}

      {features.length > 0 && (
        <ul className="space-y-3 pt-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className="text-amber-400 font-bold text-xl mt-1">✓</span>
              <span className="text-slate-200">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const imageContent = imageSrc && (
    <div className="animate-slideInRight opacity-0 [animation-delay:200ms]">
      <img 
        src={imageSrc} 
        alt={imageAlt}
        className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
      />
    </div>
  )

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {imagePosition === 'left' ? (
        <>
          {imageContent}
          {leftContent}
        </>
      ) : (
        <>
          {leftContent}
          {imageContent}
        </>
      )}
    </div>
  )
}

// Stats Display
export function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:shadow-lg transition-shadow animate-fadeUp opacity-0" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">
            {stat.value}
          </div>
          <p className="text-sm md:text-base text-slate-600">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Section
