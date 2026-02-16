import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function ExperiencePage({ data }) {
  const experienceList = data.experience || []
  const workDocuments = (data.media?.work || []).filter((item) => item.asset_type === 'document')

  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Professional Experience"
        description="Leadership roles, strategic responsibilities, and program delivery outcomes across institutions."
        actions={[{ label: 'Back to Home', to: '/#experience', variant: 'outline' }]}
      />

      <section className="py-5 section-surface" aria-label="Experience timeline">
        <div className="container">
          <SectionIntro
            eyebrow="Career"
            title="Role History"
            lead="Major positions and representative highlights from each assignment."
          />

          {experienceList.length > 0 ? (
            <div className="row g-4">
              {experienceList.map((role, index) => (
                <div className="col-12" key={`${role.role}-${role.period}-${index}`} data-aos="fade-up" data-aos-delay={index * 70}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      {role.period && <span className="meta-chip">{role.period}</span>}
                      <h3 className="h5 mb-1">{role.role}</h3>
                      <p className="mb-3">{role.organization}</p>
                      {role.location && <p className="muted-text mb-3">{role.location}</p>}
                      {role.description && <p className="muted-text mb-3">{role.description}</p>}
                      {role.highlights?.length > 0 ? (
                        <ul className="list-clean mb-0">
                          {role.highlights.map((highlight, highlightIndex) => (
                            <li key={`${highlight}-${highlightIndex}`}>{highlight}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted-text mb-0">Detailed highlights will be updated.</p>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="💼" title="No experience entries yet" text="Experience details will be published soon." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Supporting materials">
        <div className="container">
          <SectionIntro
            eyebrow="Documents"
            title="Supporting Materials"
            lead="Published references, files, and evidence from project work."
          />

          {workDocuments.length > 0 ? (
            <div className="row g-4">
              {workDocuments.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.id} data-aos="fade-up" data-aos-delay={index * 70}>
                  <article className="card profile-card h-100">
                    <div className="card-body d-flex flex-column">
                      <span className="meta-chip">{item.section || 'Work'}</span>
                      <h3 className="h6 mb-2">{item.title}</h3>
                      {item.caption && <p className="muted-text mb-3">{item.caption}</p>}
                      <div className="mt-auto">
                        <a className="btn btn-outline-gold" href={item.file_url} target="_blank" rel="noreferrer">
                          Open Document
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📄" title="No documents published yet" text="Supporting work files will appear here as they are added." />
          )}
        </div>
      </section>
    </>
  )
}
