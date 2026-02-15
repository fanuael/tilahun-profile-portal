import Section from '../components/Section'

function FileCard({ item }) {
  return (
    <article className="card subtle">
      <div className="card-header">
        <h4>{item.title}</h4>
        <span>{item.section}</span>
      </div>
      {item.caption ? <p>{item.caption}</p> : null}
      <a className="text-link" href={item.file_url} target="_blank" rel="noreferrer">
        Open File
      </a>
    </article>
  )
}

export default function LibraryPage({ data }) {
  const images = data.media?.images ?? []
  const documents = data.media?.documents ?? []

  return (
    <>
      <Section title="Media Gallery" subtitle="Backend-managed assets">
        {images.length ? (
          <div className="media-grid">
            {images.map((item) => (
              <figure key={item.id} className="media-card">
                <img src={item.file_url} alt={item.title} loading="lazy" />
                <figcaption>
                  <strong>{item.title}</strong>
                  {item.caption ? <span>{item.caption}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <article className="card subtle">
            <p className="muted">No gallery items published yet.</p>
          </article>
        )}
      </Section>

      <Section title="Document Center" subtitle="Reports, CVs, and downloadable files">
        {documents.length ? (
          <div className="cards">
            {documents.map((item) => (
              <FileCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <article className="card subtle">
            <p className="muted">No documents published yet.</p>
          </article>
        )}
      </Section>
    </>
  )
}
