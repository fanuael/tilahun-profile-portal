import Section from '../components/Section'

export default function ResearchPage({ data }) {
  const researchAssets = data.media?.research ?? []

  return (
    <>
      <Section title="Research and Ideas" subtitle="Publications, policy briefs, and concepts">
        <div className="dual-grid">
          <div className="stack">
            <h3>Publications and Writing</h3>
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
          <div className="stack">
            <h3>Innovation Ideas</h3>
            {data.ideas.map((item) => (
              <article key={item.title} className="card subtle">
                <div className="card-header">
                  <h4>{item.title}</h4>
                  <span>{item.stage}</span>
                </div>
                <p>{item.summary}</p>
                <p className="muted">Impact: {item.impact}</p>
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
        </div>
      </Section>

      <Section title="Research Assets" subtitle="Images and files from backend">
        <div className="cards">
          {researchAssets.length ? (
            researchAssets.map((item) => (
              <article key={item.id} className="card subtle">
                <div className="card-header">
                  <h4>{item.title}</h4>
                  <span>{item.asset_type}</span>
                </div>
                {item.asset_type === 'image' ? (
                  <img className="inline-image" src={item.file_url} alt={item.title} loading="lazy" />
                ) : null}
                {item.caption ? <p>{item.caption}</p> : null}
                <a className="text-link" href={item.file_url} target="_blank" rel="noreferrer">
                  Open File
                </a>
              </article>
            ))
          ) : (
            <article className="card subtle">
              <p className="muted">No research assets are published yet.</p>
            </article>
          )}
        </div>
      </Section>
    </>
  )
}
