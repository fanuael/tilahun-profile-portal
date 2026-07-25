import { useState } from 'react'
import { apiUrl } from '../api'
import { PageHero, SectionIntro } from '../components/PageBlocks'

const defaultForm = {
  name: '',
  email: '',
  subject: '',
  message: ''
}

function getPhoneHref(phone) {
  if (!phone) {
    return ''
  }
  const cleanedPhone = phone.replace(/[^+\d]/g, '')
  return cleanedPhone ? `tel:${cleanedPhone}` : ''
}

export default function ContactPage({ data, status, source = 'api' }) {
  const [form, setForm] = useState(defaultForm)
  const [formStatus, setFormStatus] = useState('idle')
  const [formErrors, setFormErrors] = useState({})
  const apiFormEnabled = status === 'ready' && source === 'api'
  const phoneHref = getPhoneHref(data.profile.phone)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormErrors({})

    const errors = {}
    if (!form.message.trim()) {
      errors.message = 'Please enter a message.'
    }
    if (!form.email.trim()) {
      errors.email = 'Please provide an email address so we can reply.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please provide a valid email address.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setFormStatus('validation_error')
      return
    }

    if (!apiFormEnabled) {
      const subject = encodeURIComponent(form.subject || 'Profile Portal Contact')
      const messageLines = [`Name: ${form.name}`, `Email: ${form.email}`, '', form.message]
      const body = encodeURIComponent(messageLines.join('\n'))
      window.location.href = `mailto:${data.profile.email}?subject=${subject}&body=${body}`
      setFormStatus('mailto')
      return
    }

    setFormStatus('sending')
    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setFormStatus('success')
      setForm(defaultForm)
    } catch (error) {
      setFormStatus('error')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach out for partnerships, consulting discussions, speaking opportunities, or collaborative projects."
      />

      <section className="py-5 section-surface" aria-label="Contact details and form">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <SectionIntro
                eyebrow="Contact Details"
                title="Connect Directly"
                lead={
                  status === 'error'
                    ? 'Content could not be loaded. Please contact directly by email or phone.'
                    : data.contact_blurb ||
                      'Open to innovation policy, sustainability, and international business collaboration.'
                }
              />

              <div className="d-flex flex-column gap-3">
                <article className="card profile-card" data-aos="fade-up">
                  <div className="card-body">
                    <h3 className="h6 mb-2">Email</h3>
                    <p className="mb-2">{data.profile.email}</p>
                    {data.profile.email && (
                      <a className="footer-link" href={`mailto:${data.profile.email}`}>
                        Send Email
                      </a>
                    )}
                  </div>
                </article>

                {data.profile.phone && (
                  <article className="card profile-card" data-aos="fade-up" data-aos-delay="80">
                    <div className="card-body">
                      <h3 className="h6 mb-2">Phone</h3>
                      <p className="mb-2">{data.profile.phone}</p>
                      {phoneHref && (
                        <a className="footer-link" href={phoneHref}>
                          Call
                        </a>
                      )}
                    </div>
                  </article>
                )}

                {data.profile.location && (
                  <article className="card profile-card" data-aos="fade-up" data-aos-delay="160">
                    <div className="card-body">
                      <h3 className="h6 mb-2">Location</h3>
                      <p className="mb-0">{data.profile.location}</p>
                    </div>
                  </article>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <article className="card profile-card" data-aos="fade-up">
                <div className="card-body p-4 p-lg-5">
                  <h2 className="h4 mb-2">Send a Message</h2>
                  <p className="muted-text mb-4">Use the form below and include enough details for a quick response.</p>

                  <form className="contact-form" onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          className={`form-control${formErrors.email ? ' is-invalid' : ''}`}
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          aria-invalid={!!formErrors.email}
                          aria-describedby={formErrors.email ? 'email-error' : undefined}
                        />
                        {formErrors.email && (
                          <div id="email-error" className="form-text text-danger">
                            {formErrors.email}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label" htmlFor="subject">
                          Subject
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Project or collaboration topic"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label" htmlFor="message">
                          Message
                        </label>
                        <textarea
                          className={`form-control${formErrors.message ? ' is-invalid' : ''}`}
                          id="message"
                          name="message"
                          rows="6"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Share your request or collaboration details"
                          aria-invalid={!!formErrors.message}
                          aria-describedby={formErrors.message ? 'message-error' : undefined}
                        />
                        {formErrors.message && (
                          <div id="message-error" className="form-text text-danger">
                            {formErrors.message}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <button className="btn btn-primary" type="submit" disabled={formStatus === 'sending'}>
                          {formStatus === 'sending'
                            ? 'Sending...'
                            : apiFormEnabled
                              ? 'Submit Message'
                              : 'Open Email App'}
                        </button>
                      </div>
                    </div>
                  </form>

                  {formStatus === 'validation_error' && (
                    <div className="alert alert-warning mt-4 mb-0" role="alert">
                      Please correct the highlighted fields before submitting.
                    </div>
                  )}
                  {formStatus === 'success' && (
                    <div className="alert alert-success mt-4 mb-0" role="status">
                      Message sent successfully. Thank you.
                    </div>
                  )}
                  {formStatus === 'mailto' && (
                    <div className="alert alert-info mt-4 mb-0" role="status">
                      Your email client has been opened with a draft message.
                    </div>
                  )}
                  {formStatus === 'error' && (
                    <div className="alert alert-danger mt-4 mb-0" role="status">
                      Unable to send. Please try again or contact directly.
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
