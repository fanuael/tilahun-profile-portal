import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function WorkPage({ data }) {
  const newsItems = data.blogs?.news || []
  const experienceList = data.experience || []
  const educationList = data.education || []
  const competencies = data.competencies || []
  const technical = data.technical || []
  const languages = data.languages || []
  const workDocuments = (data.media?.work || []).filter((item) => item.asset_type === 'document')

  return (
    <>
      <PageHero
        eyebrow="Blogs / News"
        title="News"
        description="Latest backend-managed news updates and related profile references."
      />

      <section className="py-5 section-surface" aria-label="News entries">
        <div className="container">
          <SectionIntro
            eyebrow="Latest News"
            title="Published News"
            lead="This section is connected directly to backend Blogs entries in the News category."
          />

          {newsItems.length > 0 ? (
            <div className="row g-4">
              {newsItems.map((item, index) => (
                <div className="col-12 col-lg-6" key={`${item.id || item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 70}>
                  <article className="card profile-card h-100">
                    <div className="card-body d-flex flex-column">
                      {item.published_on && <span className="meta-chip">{item.published_on}</span>}
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
            <EmptyState icon="📰" title="No news entries yet" text="Add News posts from backend Blogs to display them here." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Work experience overview">
        <div className="container">
          <SectionIntro
            eyebrow="Experience"
            title="Leadership Overview"
            lead="Additional backend-connected profile context."
          />

          {experienceList.length > 0 ? (
            <div className="row g-4">
              {experienceList.map((role, index) => (
                <div className="col-12 col-lg-4" key={`${role.role}-${role.period}-${index}`} data-aos="fade-up" data-aos-delay={index * 70}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      {role.period && <span className="meta-chip">{role.period}</span>}
                      <h3 className="h6 mb-1">{role.role}</h3>
                      <p className="mb-2">{role.organization}</p>
                      {role.description && <p className="muted-text mb-3">{role.description}</p>}
                      {role.highlights?.length > 0 ? (
                        <ul className="list-clean mb-0">
                          {role.highlights.slice(0, 4).map((highlight, highlightIndex) => (
                            <li key={`${highlight}-${highlightIndex}`}>{highlight}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted-text mb-0">Highlights will be updated soon.</p>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="💼" title="No work entries yet" text="Work experience summary will appear here." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface" aria-label="Credentials and expertise">
        <div className="container">
          <SectionIntro
            eyebrow="Credentials"
            title="Education and Skills Snapshot"
            lead="Quick reference for academic and competency profile."
          />

          <div className="row g-4">
            <div className="col-12 col-lg-6" data-aos="fade-up">
              <article className="card profile-card h-100">
                <div className="card-body">
                  <h3 className="h5 mb-3">Education</h3>
                  {educationList.length > 0 ? (
                    <ul className="list-clean mb-0">
                      {educationList.map((item, index) => (
                        <li key={`${item.degree}-${item.institution}-${index}`}>
                          <strong>{item.degree}</strong> - {item.field} ({item.institution})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-text mb-0">No education entries yet.</p>
                  )}
                </div>
              </article>
            </div>

            <div className="col-12 col-lg-6" data-aos="fade-up" data-aos-delay="80">
              <article className="card profile-card h-100">
                <div className="card-body">
                  <h3 className="h5 mb-3">Professional Skills</h3>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {competencies.slice(0, 6).map((item, index) => (
                      <span className="skill-chip" key={`${item}-${index}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {technical.map((item, index) => (
                      <span className="skill-chip" key={`${item}-${index}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {languages.map((item, index) => (
                      <span className="skill-chip" key={`${item}-${index}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Work files">
        <div className="container">
          <SectionIntro
            eyebrow="Documents"
            title="Published Work Files"
            lead="Downloadable files connected to the professional portfolio."
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
            <EmptyState icon="📂" title="No work files yet" text="Documents will be listed once published." />
          )}
        </div>
      </section>
    </>
  )
}
