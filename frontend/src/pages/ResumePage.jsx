import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'

export default function ResumePage({ data }) {
  const resumeTitle = (data.resume?.title || 'Resume').trim()
  const resumeText = (data.resume?.content || data.resume_text || '').trim()

  return (
    <>
      <PageHero
        eyebrow="Resume"
        title="Professional Resume"
        description="Complete resume profile editable from backend content settings."
      />

      <section className="py-5 section-surface" aria-label="Resume content">
        <div className="container">
          <SectionIntro
            eyebrow="Profile"
            title={resumeTitle}
            lead="This section reflects your latest backend Resume content."
          />

          {resumeText ? (
            <article className="card profile-card" data-aos="fade-up">
              <div className="card-body">
                <div className="resume-pre mb-0">{resumeText}</div>
              </div>
            </article>
          ) : (
            <EmptyState
              icon="📄"
              title="Resume not published yet"
              text="Add resume text from backend Resume content to display it here."
            />
          )}
        </div>
      </section>
    </>
  )
}
