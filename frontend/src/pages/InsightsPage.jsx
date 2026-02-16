import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function InsightsPage({ data }) {
  const insightItems = data.blogs?.insights || []

  return (
    <>
      <PageHero
        eyebrow="Blogs / Insights"
        title="Insights"
        description="Backend-managed thoughts, commentary, and perspective posts."
      />

      <section className="py-5 section-surface" aria-label="Insights list">
        <div className="container">
          <SectionIntro
            eyebrow="Insights"
            title="Thoughts and Commentary"
            lead="This page is connected directly to backend Insights entries."
          />

          {insightItems.length > 0 ? (
            <div className="row g-4">
              {insightItems.map((item, index) => (
                <div className="col-12 col-md-6" key={`${item.id || item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {item.published_on && <span className="meta-chip">{item.published_on}</span>}
                        <span className="meta-chip">Insight</span>
                      </div>
                      <h3 className="h5 mb-2">{item.title}</h3>
                      {item.summary && <p className="muted-text mb-2">{item.summary}</p>}
                      {item.content && <p className="muted-text mb-3">{item.content}</p>}
                      {item.url && (
                        <div className="mt-auto">
                          <a className="btn btn-outline-gold" href={item.url} target="_blank" rel="noreferrer">
                            Open Link
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="💡" title="No insight entries yet" text="Add entries from backend Insights section." />
          )}
        </div>
      </section>
    </>
  )
}
