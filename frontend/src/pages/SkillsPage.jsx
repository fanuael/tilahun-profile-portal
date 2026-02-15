import Section from '../components/Section'

export default function SkillsPage({ data }) {
  return (
    <Section title="Skills" subtitle="Core, technical, and language profile">
      <div className="matrix">
        <div>
          <h3>Core Competencies</h3>
          <div className="pill-grid">
            {data.competencies.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3>Technical Literacy</h3>
          <div className="pill-grid">
            {data.technical.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
          <h3 className="spaced">Languages</h3>
          <div className="pill-grid">
            {data.languages.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3>Professional Interests</h3>
          <div className="pill-grid">
            {data.interests.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
