import { EmptyState, PageHero, SectionIntro } from '../components/PageBlocks'
import { API_BASE } from '../api'

const SECTION_LABELS = {
  short_term: 'Short-term',
  long_term: 'Long-term',
  professional: 'Professional',
  academic: 'Academic',
  other: 'Other'
}

export default function CertificatesPage({ data }) {
  const certificates = data.certificates || []
  const grouped = certificates.reduce((acc, item) => {
    const section = item.section || 'other'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(item)
    return acc
  }, {})

  const sectionKeys = Object.keys(SECTION_LABELS).filter((key) => grouped[key]?.length > 0)

  const normalizeMediaUrl = (url) => {
    if (!url) return ''
    try {
      const parsed = new URL(url)
      const mediaIndex = parsed.pathname.indexOf('/media/')
      if (mediaIndex >= 0) {
        return `${parsed.pathname.slice(mediaIndex)}${parsed.search}`
      }
    } catch {
      // ignore invalid URLs
    }
    if (url.includes('/media/')) {
      return url.slice(url.indexOf('/media/'))
    }
    return url
  }

  return (
    <>
      <PageHero
        eyebrow="Certificates"
        title="Certifications & Credentials"
        description="Upload and manage certificates from the backend, organized by short-term, long-term, academic, and professional categories."
      />

      <section className="py-5 section-surface" aria-label="Certificates">
        <div className="container">
          <SectionIntro
            eyebrow="Credentials"
            title="Verified Certificates"
            lead="Each certificate is managed from the backend and displayed in section cards for easy review."
          />

          {sectionKeys.length > 0 ? (
            sectionKeys.map((sectionKey) => (
              <div className="mb-5" key={sectionKey}>
                <h2 className="h4 mb-4">{SECTION_LABELS[sectionKey]}</h2>
                <div className="row g-4">
                  {grouped[sectionKey].map((item, index) => (
                    <div className="col-12 col-md-6" key={`${item.id || item.title}-${index}`} data-aos="fade-up" data-aos-delay={index * 60}>
                      <article className="card profile-card certificate-card h-100">
                        <div className="card-body d-flex flex-column">
                          <div className="mb-3">
                            <span className="meta-chip">{item.issuer || 'Issuer'}</span>
                            {item.issued_on && <span className="meta-chip ms-2">Issued: {item.issued_on}</span>}
                            {item.expires_on && <span className="meta-chip ms-2">Expires: {item.expires_on}</span>}
                          </div>
                          <h3 className="h5 mb-2">{item.title}</h3>
                          {item.summary && <p className="muted-text mb-3">{item.summary}</p>}
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="certificate-preview-image rounded mb-3"
                              loading="lazy"
                            />
                          ) : item.document_url ? (
                            <div className="document-preview rounded mb-3">
                              <div className="document-preview-label">Certificate document</div>
                              <iframe
                                src={normalizeMediaUrl(item.document_url)}
                                title={item.title}
                                className="document-preview-iframe"
                              />
                            </div>
                          ) : null}
                          <div className="mt-auto d-flex flex-wrap gap-2 certificate-card-actions" />
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon="📜" title="No certificates yet" text="Add certificates in the backend to display them here." />
          )}
        </div>
      </section>

    </>
  )
}
