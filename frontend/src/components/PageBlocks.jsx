import { Link } from 'react-router-dom'

function actionClassName(variant) {
  switch (variant) {
    case 'outline':
      return 'btn btn-outline-gold'
    case 'light':
      return 'btn btn-light text-dark rounded-pill px-4'
    default:
      return 'btn btn-gold'
  }
}

function ActionButton({ action }) {
  const className = actionClassName(action.variant)

  if (action.to) {
    return (
      <Link className={className} to={action.to}>
        {action.label}
      </Link>
    )
  }

  return (
    <a
      className={className}
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noreferrer' : undefined}
    >
      {action.label}
    </a>
  )
}

export function PageHero({
  title,
  eyebrow = 'Professional Profile',
  description,
  actions = []
}) {
  return (
    <section className="page-hero section-anchor py-5" aria-label={title}>
      <div className="container py-3 py-lg-4">
        <div className="row justify-content-center">
          <div className="col-xl-9 text-center" data-aos="fade-up">
            <p className="section-eyebrow mb-2">{eyebrow}</p>
            <h1 className="section-title mb-3">{title}</h1>
            {description && <p className="section-lead mx-auto mb-4">{description}</p>}
            {actions.length > 0 && (
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                {actions.map((action, index) => (
                  <ActionButton action={action} key={`${action.label}-${index}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionIntro({ eyebrow, title, lead, centered = false }) {
  const alignClass = centered ? 'text-center mx-auto' : ''

  return (
    <div className={`mb-4 mb-lg-5 ${alignClass}`.trim()} data-aos="fade-up">
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {lead && <p className={`section-lead ${centered ? 'mx-auto' : ''}`}>{lead}</p>}
    </div>
  )
}

export function EmptyState({
  icon = '\u2139\ufe0f',
  title = 'No items available',
  text = 'Content will appear here soon.'
}) {
  return (
    <div className="empty-card p-4 p-lg-5 text-center" data-aos="fade-up">
      <p className="display-6 mb-3" aria-hidden="true">
        {icon}
      </p>
      <h3 className="h5 mb-2">{title}</h3>
      <p className="muted-text mb-0">{text}</p>
    </div>
  )
}
