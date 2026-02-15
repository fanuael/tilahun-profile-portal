import Section from '../components/Section'

export default function StoryPage({ data }) {
  const storyImages = (data.media?.story ?? []).filter((item) => item.asset_type === 'image')

  return (
    <>
      <Section title="Story and Journey" subtitle="Professional narrative">
        <div className="timeline">
          {data.story.map((item) => (
            <div key={`${item.year}-${item.title}`} className="timeline-item">
              <div className="timeline-year">{item.year}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Story Gallery" subtitle="Images published from admin">
        {storyImages.length ? (
          <div className="media-grid">
            {storyImages.map((item) => (
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
            <p className="muted">No story images published yet.</p>
          </article>
        )}
      </Section>
    </>
  )
}
