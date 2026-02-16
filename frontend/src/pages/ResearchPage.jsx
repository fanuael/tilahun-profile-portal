import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function ResearchPage({ data }) {
  const publications = data.publications || []
  const researchAssets = data.media?.research || []

  return (
    <>
      <PageHero
        eyebrow="Research & Publications"
        title="Research and Publications"
        description="Backend-managed research and publication records."
      />

      <section className="py-5 section-surface" aria-label="Research publication list">
        <div className="container">
          <SectionIntro
            eyebrow="Publications"
            title="Research Works"
            lead="Research and publication entries managed from backend."
          />

          {publications.length > 0 ? (
            <div className="row g-4">
              {publications.map((item, index) => (
                <div className="col-12 col-lg-6" key={`${item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {item.year && <span className="meta-chip">{item.year}</span>}
                        {item.type && <span className="meta-chip">{item.type}</span>}
                      </div>
                      <h3 className="h6 mb-2">{item.title}</h3>
                      {item.summary && <p className="muted-text mb-2">{item.summary}</p>}
                      {item.url && (
                        <a className="footer-link" href={item.url} target="_blank" rel="noreferrer">
                          Open Link
                        </a>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📘" title="No research entries yet" text="Publications will be listed here when available." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Research assets">
        <div className="container">
          <SectionIntro
            eyebrow="Assets"
            title="Research Materials"
            lead="Visual and document materials supporting the research portfolio."
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
                      <span className="meta-chip">{item.asset_type}</span>
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
            <EmptyState icon="📁" title="No research assets yet" text="Supporting files will appear here." />
          )}
        </div>
      </section>
    </>
  )
}
