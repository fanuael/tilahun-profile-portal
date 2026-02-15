import Section from '../components/Section'

export default function WorkPage({ data }) {
  const workDocuments = (data.media?.work ?? []).filter((item) => item.asset_type === 'document')

  return (
    <>
      <Section title="Leadership Experience" subtitle="National programs and coordination">
        <div className="cards">
          {data.experience.map((role) => (
            <article key={`${role.role}-${role.period}`} className="card">
              <div className="card-header">
                <h3>{role.role}</h3>
                <span>{role.period}</span>
              </div>
              <p className="muted">{role.organization}</p>
              {role.location ? <p className="muted">{role.location}</p> : null}
              {role.description ? <p>{role.description}</p> : null}
              <ul>
                {role.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Credentials" subtitle="Education, programs, and competencies">
        <div className="split">
          <div className="stack">
            <h3>Education</h3>
            {data.education.map((item) => (
              <article key={`${item.degree}-${item.field}`} className="card">
                <h4>
                  {item.degree} - {item.field}
                </h4>
                <p className="muted">
                  {item.institution}
                  {item.year ? ` - ${item.year}` : ''}
                </p>
              </article>
            ))}
          </div>
          <div className="stack">
            <h3>International Programs</h3>
            <div className="cards">
              {data.programs.map((item, index) => (
                <article key={`${item.title ?? item}-${index}`} className="card subtle">
                  <h4>{item.title ?? item}</h4>
                  {item.organization ? <p className="muted">{item.organization}</p> : null}
                  {item.period ? <p className="muted">{item.period}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="matrix">
          <div>
            <h3>Core Competencies</h3>
            <div className="pill-grid">
              {data.competencies.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Technical Literacy</h3>
            <div className="pill-grid">
              {data.technical.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
            <h3 className="spaced">Languages</h3>
            <div className="pill-grid">
              {data.languages.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Professional Interests</h3>
            <div className="pill-grid">
              {data.interests.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Work Documents" subtitle="Published files from backend">
        {workDocuments.length ? (
          <div className="cards">
            {workDocuments.map((item) => (
              <article key={item.id} className="card subtle">
                <div className="card-header">
                  <h4>{item.title}</h4>
                  <span>{item.section}</span>
                </div>
                {item.caption ? <p>{item.caption}</p> : null}
                <a className="text-link" href={item.file_url} target="_blank" rel="noreferrer">
                  Open Document
                </a>
              </article>
            ))}
          </div>
        ) : (
          <article className="card subtle">
            <p className="muted">No work documents are published yet.</p>
          </article>
        )}
      </Section>
    </>
  )
}
