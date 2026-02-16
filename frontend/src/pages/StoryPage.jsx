import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function StoryPage({ data }) {
  const story = data.story || []
  const storyImages = (data.media?.story || []).filter((item) => item.asset_type === 'image')

  return (
    <>
      <PageHero
        eyebrow="Story"
        title="Professional Journey"
        description="Career milestones and transitions that shaped leadership practice and innovation focus."
      />

      <section className="py-5 section-surface" aria-label="Career timeline">
        <div className="container">
          <SectionIntro
            eyebrow="Timeline"
            title="Milestones"
            lead="Major moments, role changes, and development highlights over time."
          />

          {story.length > 0 ? (
            <div className="row g-4">
              {story.map((item, index) => (
                <div className="col-12" key={`${item.year}-${item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      {item.year && <span className="meta-chip">{item.year}</span>}
                      <h3 className="h5 mb-2">{item.title}</h3>
                      <p className="muted-text mb-0">{item.detail}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="🛤️" title="No timeline entries yet" text="Story milestones will be published soon." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Story gallery">
        <div className="container">
          <SectionIntro
            eyebrow="Gallery"
            title="Story Media"
            lead="Images connected to events and milestones."
          />

          {storyImages.length > 0 ? (
            <div className="row g-4">
              {storyImages.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.id} data-aos="fade-up" data-aos-delay={index * 60}>
                  <article className="card profile-card h-100 overflow-hidden">
                    <img src={item.file_url} alt={item.title} className="img-fluid" loading="lazy" />
                    <div className="card-body">
                      <h3 className="h6 mb-2">{item.title}</h3>
                      {item.caption && <p className="muted-text mb-0">{item.caption}</p>}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="🖼️" title="No story images yet" text="Visual assets will appear when they are published." />
          )}
        </div>
      </section>
    </>
  )
}
