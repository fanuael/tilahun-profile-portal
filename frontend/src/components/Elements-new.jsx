// Utility Component Elements for the redesigned portfolio

// Badge Component
export function Badge({ 
  children, 
  variant = 'default',
  icon = null,
  size = 'md'
}) {
  const variants = {
    default: 'bg-slate-100/80 text-slate-700 border border-slate-300 hover:bg-slate-100 hover:shadow-card',
    primary: 'bg-amber-100/90 text-amber-700 border border-amber-300 hover:bg-amber-100 hover:shadow-card',
    success: 'bg-green-100/90 text-green-700 border border-green-300 hover:bg-green-100 hover:shadow-card',
    warning: 'bg-orange-100/90 text-orange-700 border border-orange-300 hover:bg-orange-100 hover:shadow-card',
    accent: 'bg-gradient-to-r from-amber-100/90 to-orange-100/90 text-amber-800 border border-amber-300 hover:from-amber-100 hover:to-orange-100 hover:shadow-card'
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  return (
    <span className={`
      inline-flex items-center gap-2 rounded-full font-semibold
      transition-all duration-300
      ${variants[variant]} ${sizes[size]}
    `}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </span>
  )
}

// Stats Display Component
export function StatsCount({ 
  number, 
  label, 
  suffix = '',
  icon = null,
  color = 'amber'
}) {
  const colorClasses = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    red: 'text-red-600'
  }

  return (
    <div className="text-center">
      {icon && <div className="text-4xl mb-3">{icon}</div>}
      <div className={`text-4xl md:text-5xl font-bold ${colorClasses[color]} mb-2`}>
        {number}{suffix}
      </div>
      <p className="text-slate-600 font-medium">{label}</p>
    </div>
  )
}

// Timeline Dot Component
export function TimelineDot({ 
  icon = null, 
  label = null,
  variant = 'default',
  size = 'md'
}) {
  const variants = {
    default: 'bg-slate-200 border-slate-300',
    active: 'bg-amber-500 border-amber-600 shadow-lg shadow-amber-500/50',
    completed: 'bg-green-500 border-green-600'
  }

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`
        ${sizes[size]} rounded-full border-2 flex items-center justify-center
        transition-all duration-300 ${variants[variant]}
      `}>
        {icon && <span className="text-sm">{icon}</span>}
      </div>
      {label && <p className="text-xs mt-2 font-semibold text-slate-700">{label}</p>}
    </div>
  )
}

// Timeline Connector
export function TimelineConnector({ 
  orientation = 'vertical',
  variant = 'default',
  dashed = false
}) {
  const strokeClass = dashed ? 'stroke-dasharray: 4' : ''
  
  return (
    <div className={`
      ${orientation === 'vertical' ? 'w-1 h-12 mx-auto' : 'h-1 w-12'}
      ${variant === 'active' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-slate-200'}
      transition-all duration-300
    `} />
  )
}

// Divider Component
export function Divider({ 
  variant = 'default',
  withText = null,
  className = ''
}) {
  const variants = {
    default: 'border-slate-200',
    accent: 'border-amber-300',
    gradient: 'bg-gradient-to-r from-transparent via-slate-300 to-transparent border-0'
  }

  if (withText) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className={`flex-1 h-0.5 ${variants[variant]}`}></div>
        <span className="text-slate-600 font-medium text-sm">{withText}</span>
        <div className={`flex-1 h-0.5 ${variants[variant]}`}></div>
      </div>
    )
  }

  return (
    <div className={`h-0.5 border-t ${variants[variant]} ${className}`}></div>
  )
}

// Tag/Keyword Component
export function Tag({ 
  children, 
  icon = null,
  onClose = null,
  variant = 'default'
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    primary: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    dark: 'bg-slate-800 text-white hover:bg-slate-700'
  }

  return (
    <span className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
      transition-all duration-200 ${variants[variant]}
    `}>
      {icon && <span>{icon}</span>}
      {children}
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-1 hover:opacity-60"
        >
          ✕
        </button>
      )}
    </span>
  )
}

// Progress Bar
export function ProgressBar({ 
  value = 0, 
  max = 100,
  label = null,
  showValue = false,
  color = 'amber',
  size = 'md'
}) {
  const percentage = (value / max) * 100

  const colors = {
    amber: 'from-amber-500 to-amber-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showValue && <span className="text-sm font-bold text-amber-600">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

// Icon Badge (for highlighting features)
export function IconBadge({ 
  icon, 
  title,
  description = null,
  size = 'md'
}) {
  const sizes = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  }

  return (
    <div className="text-center">
      <div className={`
        mx-auto ${sizes[size]} rounded-full bg-gradient-to-br from-amber-100 to-amber-50
        border-2 border-amber-300 flex items-center justify-center mb-3
        transition-transform duration-300 hover:scale-110
      `}>
        {icon}
      </div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
  )
}

// Alert Component
export function Alert({ 
  type = 'info',
  title = null,
  children,
  icon = null,
  dismissible = false,
  onDismiss = null
}) {
  const types = {
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    error: 'bg-red-50 border-red-300 text-red-800'
  }

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕'
  }

  return (
    <div className={`
      p-4 rounded-lg border ${types[type]}
      flex gap-3 items-start
    `}>
      <span className="text-xl flex-shrink-0">{icon || icons[type]}</span>
      <div className="flex-1">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <p className="text-sm">{children}</p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-xl hover:opacity-60 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// Button Variants
export function Button({ 
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  href = null
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md',
    secondary: 'bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 hover:shadow-card active:shadow-none',
    outline: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  }

  const baseClasses = `
    inline-flex items-center gap-2 rounded-lg font-semibold
    transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
    ${variants[variant]} ${sizes[size]}
  `

  if (href) {
    return (
      <a 
        href={href}
        className={`${baseClasses} ${className}`}
        onClick={onClick}
      >
        {loading ? <span className="animate-spin">⌛</span> : icon && <span>{icon}</span>}
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${className}`}
    >
      {loading ? <span className="animate-spin">⌛</span> : icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

// Form Input Wrapper
export function FormGroup({ 
  label,
  id,
  error = null,
  required = false,
  children,
  helperText = null,
  className = ''
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={error ? 'opacity-100' : ''}>
        {children}
      </div>
      {error && <p className="text-sm text-red-600 font-medium animate-slideInDown">{error}</p>}
      {helperText && !error && <p className="text-sm text-slate-500 font-medium">{helperText}</p>}
    </div>
  )
}

// Tooltip
export function Tooltip({ 
  text, 
  children,
  position = 'top'
}) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div className="relative inline-block group">
      {children}
      <div className={`
        absolute ${positions[position]} px-3 py-2 bg-slate-900 text-white text-xs rounded
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        whitespace-nowrap z-10
      `}>
        {text}
        <div className="absolute w-2 h-2 bg-slate-900" 
          style={{
            [position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : 'auto']: '-4px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        ></div>
      </div>
    </div>
  )
}

// Breadcrumb
export function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <span className="text-slate-400">/</span>}
          {item.href ? (
            <a href={item.href} className="text-amber-600 hover:text-amber-700 font-medium">
              {item.label}
            </a>
          ) : (
            <span className="text-slate-600">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default {
  Badge,
  StatsCount,
  TimelineDot,
  TimelineConnector,
  Divider,
  Tag,
  ProgressBar,
  IconBadge,
  Alert,
  Button,
  FormGroup,
  Tooltip,
  Breadcrumbs
}
