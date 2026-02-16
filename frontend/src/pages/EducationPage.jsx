import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function EducationPage({ data }) {
  const educationList = data.education || []
  const programs = data.programs || []

  return (
    <>
      <PageHero
        eyebrow="Education"
        title="Education and Professional Training"
        description="Academic credentials and international development programs supporting long-term leadership growth."
        actions={[{ label: 'Back to Home', to: '/#education', variant: 'outline' }]}
      />

      <section className="py-5 section-surface" aria-label="Academic education">
        <div className="container">
          <SectionIntro
            eyebrow="Degrees"
            title="Academic Credentials"
            lead="Formal education profile across policy, management, and international business tracks."
          />

          {educationList.length > 0 ? (
            <div className="row g-4">
              {educationList.map((item, index) => (
                <div className="col-12 col-md-6" key={`${item.degree}-${item.institution}-${index}`} data-aos="fade-up" data-aos-delay={index * 70}>
                  <article className="card profile-card h-100">
                    <div className="card-body">
                      {item.year && <span className="meta-chip">{item.year}</span>}
                      <h3 className="h5 mb-1">{item.degree}</h3>
                      <p className="mb-2">{item.field}</p>
                      <p className="muted-text mb-0">{item.institution}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="🎓" title="No education entries yet" text="Academic credentials will be published soon." />
          )}
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Training programs">
        <div className="container">
          <SectionIntro
            eyebrow="Programs"
            title="International Programs and Certifications"
            lead="Supplementary learning pathways focused on innovation, sustainability, and systems development."
          />

          {programs.length > 0 ? (
            <div className="row g-4">
              {programs.map((program, index) => {
                const title = program.title || program
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={`${title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                    <article className="card profile-card h-100">
                      <div className="card-body">
                        <span className="meta-chip">Program</span>
                        <h3 className="h6 mb-2">{title}</h3>
                        {program.organization && <p className="muted-text mb-1">{program.organization}</p>}
                        {program.period && <p className="muted-text mb-0">{program.period}</p>}
                        {program.description && <p className="muted-text mb-0 mt-2">{program.description}</p>}
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState icon="🌐" title="No program entries yet" text="Training and exchange programs will appear here." />
          )}
        </div>
      </section>
    </>
  )
}
