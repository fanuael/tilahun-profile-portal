import { Link } from 'react-router-dom'
import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function SkillsPage({ data }) {
  const skillCategories = [
    {
      title: 'Core Competencies',
      items: data.competencies || [],
      description: 'Strategic leadership and innovation system capabilities.'
    },
    {
      title: 'Technical Skills',
      items: data.technical || [],
      description: 'Digital, data, and platform-oriented working skills.'
    },
    {
      title: 'Languages',
      items: data.languages || [],
      description: 'Communication readiness across local and international contexts.'
    },
    {
      title: 'Interests',
      items: data.interests || [],
      description: 'Professional focus areas and long-term growth themes.'
    }
  ]

  return (
    <>
      <PageHero
        eyebrow="Skills"
        title="Skills and Expertise"
        description="A structured view of professional, technical, and communication strengths."
        actions={[
          { label: 'Back to Home', to: '/#skills', variant: 'outline' },
          { label: 'Contact', to: '/contact', variant: 'gold' }
        ]}
      />

      <section className="py-5 section-surface" aria-label="Skills categories">
        <div className="container">
          <SectionIntro
            eyebrow="Capability Areas"
            title="Professional Skill Framework"
            lead="Each category is organized with practical focus and execution context."
          />

          <div className="row g-4">
            {skillCategories.map((category, index) => (
              <div className="col-12 col-md-6" key={category.title} data-aos="fade-up" data-aos-delay={index * 80}>
                <article className="card profile-card h-100">
                  <div className="card-body">
                    <h3 className="h5 mb-2">{category.title}</h3>
                    <p className="muted-text mb-3">{category.description}</p>
                    {category.items.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {category.items.map((item, itemIndex) => (
                          <span className="skill-chip" key={`${item}-${itemIndex}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="muted-text mb-0">No entries published yet.</p>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 section-surface-alt" aria-label="Skills summary">
        <div className="container">
          <SectionIntro
            eyebrow="Summary"
            title="Current Skills Snapshot"
            lead="Quick quantitative overview of skill coverage."
          />

          <div className="row g-4">
            {[
              { label: 'Core Competencies', value: data.competencies?.length || 0 },
              { label: 'Technical Skills', value: data.technical?.length || 0 },
              { label: 'Languages', value: data.languages?.length || 0 },
              { label: 'Interests', value: data.interests?.length || 0 }
            ].map((stat, index) => (
              <div className="col-6 col-lg-3" key={stat.label} data-aos="fade-up" data-aos-delay={index * 70}>
                <article className="card profile-card h-100 text-center">
                  <div className="card-body">
                    <p className="display-6 fw-semibold text-warning mb-1">{stat.value}</p>
                    <p className="muted-text mb-0">{stat.label}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="mt-4" data-aos="fade-up">
            <Link className="btn btn-gold" to="/contact">
              Discuss Collaboration
            </Link>
          </div>
        </div>
      </section>

      {skillCategories.every((category) => category.items.length === 0) && (
        <section className="py-5 section-surface" aria-label="No skills data">
          <div className="container">
            <EmptyState icon="🧭" title="Skills will be published soon" text="Please check back for updated capability details." />
          </div>
        </section>
      )}
    </>
  )
}
