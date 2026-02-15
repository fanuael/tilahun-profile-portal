import { useState } from 'react'
import { apiUrl, hasBackendApi } from '../api'
import Section from '../components/Section'

const defaultForm = {
  name: '',
  email: '',
  subject: '',
  message: ''
}

export default function ContactPage({ data, status }) {
  const [form, setForm] = useState(defaultForm)
  const [formStatus, setFormStatus] = useState('idle')
  const apiFormEnabled = hasBackendApi && status === 'ready'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!apiFormEnabled) {
      const subject = encodeURIComponent(form.subject || 'Profile Portal Contact')
      const messageLines = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        '',
        form.message
      ]
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
    <Section title="Contact" subtitle="Start a collaboration">
      <div className="contact-grid">
        <div>
          <h3>Let us work together</h3>
          <p>
            {status === 'error'
              ? 'Content could not be loaded. Please contact directly by email or phone.'
              : status === 'snapshot'
                ? 'The public portal is running in private-backend mode. Use this form to open your email app.'
                : data.contact_blurb ||
                  'Open to partnerships in innovation policy, sustainable entrepreneurship, and international business.'}
          </p>
          <div className="contact-details">
            <div>
              <span className="label">Email</span>
              <span>{data.profile.email}</span>
            </div>
            <div>
              <span className="label">Phone</span>
              <span>{data.profile.phone}</span>
            </div>
            <div>
              <span className="label">Location</span>
              <span>{data.profile.location}</span>
            </div>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>
          </div>
          <label>
            Subject
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Collaboration opportunity"
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Share a quick summary of your project or request."
              rows="5"
              required
            />
          </label>
          <button className="button primary" type="submit" disabled={formStatus === 'sending'}>
            {formStatus === 'sending'
              ? 'Sending...'
              : apiFormEnabled
                ? 'Send Message'
                : 'Open Email App'}
          </button>
          {formStatus === 'success' && (
            <p className="form-status success">Thank you. Your message has been received.</p>
          )}
          {formStatus === 'mailto' && (
            <p className="form-status success">
              Email draft opened. Send it from your mail app to complete contact.
            </p>
          )}
          {formStatus === 'error' && (
            <p className="form-status error">Unable to send. Please try again shortly.</p>
          )}
        </form>
      </div>
    </Section>
  )
}
