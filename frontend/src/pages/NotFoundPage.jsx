import { Link } from 'react-router-dom'
import Section from '../components/Section'

export default function NotFoundPage() {
  return (
    <Section title="Page Not Found" subtitle="404">
      <article className="card">
        <p className="muted">The page you requested does not exist in this portal.</p>
        <Link to="/" className="text-link">
          Return to home
        </Link>
      </article>
    </Section>
  )
}
