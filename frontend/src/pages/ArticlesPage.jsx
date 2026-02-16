import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function ArticlesPage({ data }) {
  const articleItems = data.blogs?.articles || []

  return (
    <>
      <PageHero
        eyebrow="Blogs / Articles"
        title="Articles"
        description="Backend-managed article posts from the Blogs section."
      />

      <section className="py-5 section-surface" aria-label="Articles list">
        <div className="container">
          <SectionIntro
            eyebrow="Articles"
            title="Published Articles"
            lead="This page is connected directly to backend Articles entries."
          />

          {articleItems.length > 0 ? (
            <div className="row g-4">
              {articleItems.map((item, index) => (
                <div className="col-12 col-md-6" key={`${item.id || item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {item.published_on && <span className="meta-chip">{item.published_on}</span>}
                        <span className="meta-chip">Article</span>
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
            <EmptyState icon="📝" title="No article entries yet" text="Add entries from backend Articles section." />
          )}
        </div>
      </section>
    </>
  )
}
