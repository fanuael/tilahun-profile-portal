import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function PassionPage({ data }) {
  const passionTitle = (data.passion?.title || 'Passion').trim()
  const paragraphs = (data.passion?.content || data.passion_text || '')
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <>
      <PageHero
        eyebrow="Passion"
        title="Passion"
        description="Personal focus and long-term commitment to innovation-driven enterprise development."
      />

      <section className="py-5 section-surface" aria-label="Passion content">
        <div className="container">
          <SectionIntro
            eyebrow="Commitment"
            title={passionTitle || 'Innovation and Startup Development'}
            lead="This section is editable from backend Passion content."
          />

          {paragraphs.length > 0 ? (
            <article className="card profile-card" data-aos="fade-up">
              <div className="card-body d-flex flex-column gap-3">
                {paragraphs.map((paragraph, index) => (
                  <p className="muted-text mb-0" key={`${paragraph.slice(0, 30)}-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ) : (
            <EmptyState
              icon="💡"
              title="Passion statement not published yet"
              text="Add passion content from backend Site Profile to display it here."
            />
          )}
        </div>
      </section>
    </>
  )
}
