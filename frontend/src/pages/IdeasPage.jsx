import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function IdeasPage({ data }) {
  const insightItems = data.blogs?.insights || []
  const ideas = data.ideas || []
  const researchAssets = data.media?.research || []

  return (
    <>
      <PageHero
        eyebrow="Blogs / Insights"
        title="Insights"
        description="Backend-managed thoughts, ideas, and commentary."
      />

      <section className="py-5 section-surface" aria-label="Insights list">
        <div className="container">
          <SectionIntro
            eyebrow="Insights"
            title="Thoughts and Commentary"
            lead="This section reads directly from backend Blogs entries in the Insights category."
          />

          {insightItems.length > 0 ? (
            <div className="row g-4">
              {insightItems.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={`${item.id || item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {item.published_on && <span className="meta-chip">{item.published_on}</span>}
                        <span className="meta-chip">Insight</span>
                      </div>
                      <h3 className="h6 mb-2">{item.title}</h3>
                      {item.summary && <p className="muted-text mb-3">{item.summary}</p>}
                      {item.content && <p className="muted-text mb-3">{item.content}</p>}
                      <div className="mt-auto d-flex flex-wrap gap-2">
                        {item.url && (
                          <a className="btn btn-outline-gold" href={item.url} target="_blank" rel="noreferrer">
                            Open Link
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="💡" title="No insight entries yet" text="Add Insights in backend Blogs to display them here." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Ideas list">
        <div className="container">
          <SectionIntro
            eyebrow="Concepts"
            title="Innovation Concepts"
            lead="Structured idea entries from backend innovation records."
          />

          {ideas.length > 0 ? (
            <div className="row g-4">
              {ideas.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={`${item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {item.stage && <span className="meta-chip">{item.stage}</span>}
                        {item.impact && <span className="meta-chip">Impact: {item.impact}</span>}
                      </div>
                      <h3 className="h6 mb-2">{item.title}</h3>
                      {item.summary && <p className="muted-text mb-3">{item.summary}</p>}
                      <div className="mt-auto d-flex flex-wrap gap-2">
                        {item.url && (
                          <a className="btn btn-outline-gold" href={item.url} target="_blank" rel="noreferrer">
                            Open Link
                          </a>
                        )}
                        {item.document_url && (
                          <a className="btn btn-outline-gold" href={item.document_url} target="_blank" rel="noreferrer">
                            View File
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="🧪" title="No idea entries yet" text="New initiatives and concepts will appear here." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface" aria-label="Idea assets">
        <div className="container">
          <SectionIntro
            eyebrow="Assets"
            title="Supporting Materials"
            lead="Related files and visuals connected to research and idea development."
          />

          {researchAssets.length > 0 ? (
            <div className="row g-4">
              {researchAssets.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.id} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100 overflow-hidden">
                    {item.asset_type === 'image' && item.file_url && (
                      <img src={item.file_url} alt={item.title} className="img-fluid" loading="lazy" />
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span className="meta-chip">{item.asset_type}</span>
                      </div>
                      <h3 className="h6 mb-2">{item.title}</h3>
                      {item.caption && <p className="muted-text mb-3">{item.caption}</p>}
                      {item.file_url && (
                        <div className="mt-auto">
                          <a className="btn btn-outline-gold" href={item.file_url} target="_blank" rel="noreferrer">
                            Open File
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📎" title="No supporting files yet" text="Assets will appear after publication." />
          )}
        </div>
      </section>
    </>
  )
}
