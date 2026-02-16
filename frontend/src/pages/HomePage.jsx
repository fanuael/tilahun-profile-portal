import { Link } from 'react-router-dom'
import { SectionIntro } from '../components/PageBlocks'

function getPhoneHref(phone) {
  if (!phone) {
    return ''
  }
  const cleanedPhone = phone.replace(/[^+\d]/g, '')
  return cleanedPhone ? `tel:${cleanedPhone}` : ''
}

export default function HomePage({ data }) {
  const stats = data.stats || []
  const summary = data.summary || ''
  const phoneHref = getPhoneHref(data.profile.phone)

  const skillGroups = [
    { title: 'Core Skills', items: data.competencies || [] },
    { title: 'Technical Skills', items: data.technical || [] },
    { title: 'Languages', items: data.languages || [] },
    { title: 'Interests', items: data.interests || [] }
  ]

  const education = data.education || []
  const experience = data.experience || []

  return (
    <>
      <section id="hero" className="hero-section vh-100 d-flex align-items-center section-anchor" aria-label="Hero">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7" data-aos="fade-up">
              <p className="section-eyebrow">Executive Profile</p>
              <h1 className="display-5 fw-semibold mb-3">{data.profile.name}</h1>
              <p className="hero-subtitle fs-5 mb-3">{data.profile.title}</p>
              {summary ? (
                <p className="section-lead mb-4">{summary}</p>
              ) : (
                <p className="section-lead mb-4">Profile summary will be updated soon.</p>
              )}
              <div className="d-flex flex-wrap gap-3">
                <a className="btn btn-gold" href="#contact">
                  Contact Me
                </a>
                <Link className="btn btn-outline-gold" to="/contact">
                  Send Message
                </Link>
                <Link className="btn btn-outline-light rounded-pill px-4" to="/work">
                  View Full Profile
                </Link>
              </div>
            </div>

            <div className="col-lg-5" data-aos="fade-left">
              <article className="card profile-card h-100">
                <div className="card-body">
                  {data.profile.hero_image_url ? (
                    <img
                      className="hero-image rounded-3 mb-3"
                      src={data.profile.hero_image_url}
                      alt={data.profile.name}
                      loading="lazy"
                    />
                  ) : null}
                  {data.profile.current_focus && <p className="mb-2 fw-medium">{data.profile.current_focus}</p>}
                  {data.profile.location && <p className="muted-text mb-1">{data.profile.location}</p>}
                  {data.profile.nationality && <p className="muted-text mb-0">Nationality: {data.profile.nationality}</p>}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="highlights" className="py-5 section-surface section-anchor" aria-label="Highlights">
        <div className="container">
          <SectionIntro
            eyebrow="Highlights"
            title="Key Professional Highlights"
            lead="Core milestones and strengths that define the profile."
          />
          {stats.length > 0 ? (
            <div className="row g-4">
              {stats.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={`${item.label}-${index}`} data-aos="fade-up" data-aos-delay={index * 80}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      <span className="meta-chip">Highlight {index + 1}</span>
                      <h3 className="h5 mb-2">{item.label}</h3>
                      <p className="muted-text mb-0">{item.value}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-card p-4 text-center">Highlights will appear when published from backend.</div>
          )}
        </div>
      </section>

      <section id="skills" className="py-5 section-surface-alt section-anchor" aria-label="Skills">
        <div className="container">
          <SectionIntro
            eyebrow="Skills"
            title="Capability Framework"
            lead="Competencies grouped into practical domains for leadership and execution."
          />
          <div className="row g-4">
            {skillGroups.map((group, index) => (
              <div className="col-12 col-md-6" key={group.title} data-aos="fade-up" data-aos-delay={index * 80}>
                <article className="card profile-card h-100">
                  <div className="card-body">
                    <h3 className="h5 mb-3">{group.title}</h3>
                    {group.items.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {group.items.slice(0, 8).map((item, itemIndex) => (
                          <span className="skill-chip" key={`${item}-${itemIndex}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="muted-text mb-0">Content will be added soon.</p>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="py-5 section-surface section-anchor" aria-label="Education">
        <div className="container">
          <SectionIntro
            eyebrow="Education"
            title="Academic Credentials"
            lead="Formal education and advanced training background."
          />
          <div className="row g-4">
            {education.length > 0 ? (
              education.map((item, index) => (
                <div className="col-12 col-md-6" key={`${item.degree}-${item.institution}-${index}`} data-aos="fade-up" data-aos-delay={index * 70}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      {item.year && <span className="meta-chip">{item.year}</span>}
                      <h3 className="h5 mb-1">{item.degree}</h3>
                      <p className="mb-2">{item.field}</p>
                      <p className="muted-text mb-0">{item.institution}</p>
                    </div>
                  </article>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="empty-card p-4 text-center">Education details will appear here.</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="experience" className="py-5 section-surface-alt section-anchor" aria-label="Experience">
        <div className="container">
          <SectionIntro
            eyebrow="Experience"
            title="Leadership Experience"
            lead="Roles, responsibilities, and measurable areas of impact."
          />
          <div className="row g-4">
            {experience.length > 0 ? (
              experience.map((item, index) => (
                <div className="col-12 col-lg-4" key={`${item.role}-${item.period}-${index}`} data-aos="fade-up" data-aos-delay={index * 80}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      {item.period && <span className="meta-chip">{item.period}</span>}
                      <h3 className="h5 mb-1">{item.role}</h3>
                      <p className="mb-2">{item.organization}</p>
                      {item.description && <p className="muted-text mb-3">{item.description}</p>}
                      {item.highlights?.length > 0 ? (
                        <ul className="list-clean mb-0">
                          {item.highlights.slice(0, 4).map((highlight, highlightIndex) => (
                            <li key={`${highlight}-${highlightIndex}`}>{highlight}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted-text mb-0">Details available on the full Experience page.</p>
                      )}
                    </div>
                  </article>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="empty-card p-4 text-center">Experience details will appear here.</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="py-5 section-surface section-anchor" aria-label="Contact">
        <div className="container">
          <SectionIntro
            eyebrow="Contact"
            title="Let’s Connect"
            lead="Open to collaborations, consulting discussions, and strategic partnerships."
          />
          <div className="row g-4">
            <div className="col-12 col-md-4" data-aos="fade-up">
              <article className="card profile-card h-100">
                <div className="card-body">
                  <h3 className="h6 text-uppercase text-warning mb-3">Email</h3>
                  <p className="mb-2">{data.profile.email || 'Not available'}</p>
                  {data.profile.email && (
                    <a className="footer-link" href={`mailto:${data.profile.email}`}>
                      Send Email
                    </a>
                  )}
                </div>
              </article>
            </div>
            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="80">
              <article className="card profile-card h-100">
                <div className="card-body">
                  <h3 className="h6 text-uppercase text-warning mb-3">Phone</h3>
                  <p className="mb-2">{data.profile.phone || 'Not available'}</p>
                  {phoneHref && (
                    <a className="footer-link" href={phoneHref}>
                      Call Now
                    </a>
                  )}
                </div>
              </article>
            </div>
            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="160">
              <article className="card profile-card h-100">
                <div className="card-body">
                  <h3 className="h6 text-uppercase text-warning mb-3">More Pages</h3>
                  <div className="d-flex flex-column gap-2">
                    <Link className="footer-link" to="/story">
                      Read Story
                    </Link>
                    <Link className="footer-link" to="/research">
                      Research & Publications
                    </Link>
                    <Link className="footer-link" to="/contact">
                      Open Contact Form
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
