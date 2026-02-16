export function Card({ children, className = '', hover = false, premium = false, animated = false, delay = 0 }) {
  const baseClass = premium ? 'card-premium' : 'card-base'
  const hoverClass = hover ? 'card-hover' : ''
  const animClass = animated ? 'animate-fadeUp' : ''
  const style = animated ? { animationDelay: `${delay}ms` } : {}

  return (
    <div className={`${baseClass} ${hoverClass} ${animClass} ${className}`} style={style}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`border-b border-gold/10 pb-4 mb-4 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return <div className={`border-t border-gold/10 pt-4 mt-4 flex gap-3 ${className}`}>{children}</div>
}
