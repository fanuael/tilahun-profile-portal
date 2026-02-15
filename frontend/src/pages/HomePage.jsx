import { Link } from 'react-router-dom'
import Section from '../components/Section'

const defaultStats = [
  { label: '15+ years', value: 'Leadership in public sector innovation' },
  { label: 'National programs', value: 'Startup and ecosystem coordination' },
  { label: 'Global exposure', value: 'China, United States, UK partnerships' }
]

export default function HomePage({ data }) {
  const stats = data.stats?.length ? data.stats : defaultStats

  return (
    <>
      <header className="hero">
        <div className="hero-grid">
          <div className="hero-text">
            <p className="eyebrow">Innovation and sustainable business</p>
            <h1>{data.profile.name}</h1>
            <p className="title">{data.profile.title}</p>
            <p className="summary">{data.summary}</p>
            <div className="hero-actions">
              <Link className="button primary" to="/contact">
                Start a Conversation
              </Link>
              <Link className="button ghost" to="/story">
                Read My Story
              </Link>
            </div>
            <div className="contact-chip">
              <span>{data.profile.location}</span>
              <span>{data.profile.email}</span>
              <span>{data.profile.phone}</span>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-card floating">
              <h3>Current Focus</h3>
              <p>{data.profile.current_focus}</p>
              <div className="hero-tags">
                {data.competencies.slice(0, 4).map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {data.profile.hero_image_url ? (
              <div className="hero-image-card floating">
                <img src={data.profile.hero_image_url} alt={data.profile.name} />
              </div>
            ) : null}
            <div className="stat-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card floating">
                  <h4>{stat.label}</h4>
                  <p>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <Section title="Portal Overview" subtitle="Quick access">
        <div className="cards">
          <article className="card">
            <h3>Education</h3>
            <p className="muted">Academic background and international training records.</p>
            <Link to="/education" className="text-link">
              Open Education
            </Link>
          </article>
          <article className="card">
            <h3>Experience</h3>
            <p className="muted">Leadership roles, responsibilities, and achievements.</p>
            <Link to="/experience" className="text-link">
              Open Experience
            </Link>
          </article>
          <article className="card">
            <h3>Skills</h3>
            <p className="muted">Core competencies, technical literacy, and languages.</p>
            <Link to="/skills" className="text-link">
              Open Skills
            </Link>
          </article>
          <article className="card">
            <h3>Publications and Ideas</h3>
            <p className="muted">Research outputs and innovation concepts.</p>
            <Link to="/publications" className="text-link">
              Open Publications
            </Link>
          </article>
        </div>
      </Section>
    </>
  )
}
