import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="page-hero py-5 min-vh-100 d-flex align-items-center" aria-label="Not found page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center" data-aos="fade-up">
            <p className="section-eyebrow">Error</p>
            <h1 className="display-2 fw-semibold mb-3">404</h1>
            <h2 className="section-title mb-3">Page Not Found</h2>
            <p className="section-lead mx-auto mb-4">
              The page you requested does not exist or may have been moved.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link className="btn btn-gold" to="/">
                Return Home
              </Link>
              <Link className="btn btn-outline-gold" to="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
