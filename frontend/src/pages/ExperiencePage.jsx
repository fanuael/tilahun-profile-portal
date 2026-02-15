import Section from '../components/Section'

export default function ExperiencePage({ data }) {
  const workDocuments = (data.media?.work ?? []).filter((item) => item.asset_type === 'document')

  return (
    <>
      <Section title="Experience" subtitle="Leadership and implementation roles">
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

      <Section title="Experience Documents" subtitle="Published files from backend">
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
            <p className="muted">No experience documents are published yet.</p>
          </article>
        )}
      </Section>
    </>
  )
}
