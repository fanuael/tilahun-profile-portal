import Section from '../components/Section'

export default function EducationPage({ data }) {
  return (
    <>
      <Section title="Education" subtitle="Academic background">
        <div className="cards">
          {data.education.map((item) => (
            <article key={`${item.degree}-${item.field}`} className="card">
              <h3>
                {item.degree} - {item.field}
              </h3>
              <p className="muted">{item.institution}</p>
              {item.year ? <p className="muted">{item.year}</p> : null}
            </article>
          ))}
        </div>
      </Section>

      <Section title="International Programs" subtitle="Training and international exposure">
        <div className="cards">
          {data.programs.map((item, index) => (
            <article key={`${item.title ?? item}-${index}`} className="card subtle">
              <h4>{item.title ?? item}</h4>
              {item.organization ? <p className="muted">{item.organization}</p> : null}
              {item.period ? <p className="muted">{item.period}</p> : null}
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
