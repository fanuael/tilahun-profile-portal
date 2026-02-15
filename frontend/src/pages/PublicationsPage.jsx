import Section from '../components/Section'

export default function PublicationsPage({ data }) {
  return (
    <Section title="Publications" subtitle="Research writing and policy outputs">
      <div className="cards">
        {data.publications.map((item) => (
          <article key={item.title} className="card subtle">
            <div className="card-header">
              <h4>{item.title}</h4>
              <span>{item.year}</span>
            </div>
            <p className="muted">
              {item.type} - {item.status}
            </p>
            <p>{item.summary}</p>
            <div className="resource-links">
              {item.url ? (
                <a className="text-link" href={item.url} target="_blank" rel="noreferrer">
                  External Link
                </a>
              ) : null}
              {item.document_url ? (
                <a className="text-link" href={item.document_url} target="_blank" rel="noreferrer">
                  Download Document
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
