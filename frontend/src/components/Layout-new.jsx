import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const footerSectionLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
]

const primaryNavLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/experience', label: 'Experience' },
  { to: '/education', label: 'Education' },
  { to: '/skills', label: 'Skills' }
]

const resumeLinks = [
  { to: '/resume', label: 'Resume' },
  { to: '/passion', label: 'Passion' }
]

const blogLinks = [
  { to: '/work', label: 'News' },
  { to: '/research', label: 'Research and Publication', matchPaths: ['/research', '/publications'] },
  { to: '/articles', label: 'Articles' },
  { to: '/insights', label: 'Insights', matchPaths: ['/insights', '/ideas'] }
]

const moreLinks = [
  { to: '/contact', label: 'Contact' }
]

function getPhoneHref(phone) {
  if (!phone) {
    return ''
  }

  const cleanedPhone = phone.replace(/[^+\d]/g, '')
  return cleanedPhone ? `tel:${cleanedPhone}` : ''
}

export default function Layout({ data, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const phoneHref = getPhoneHref(data.profile.phone)

  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown('')
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!location.hash) {
      return
    }

    const sectionId = location.hash.replace('#', '')
    const timerId = window.setTimeout(() => {
      const target = document.getElementById(sectionId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 120)

    return () => window.clearTimeout(timerId)
  }, [location.pathname, location.hash])

  useEffect(() => {
    let timerId = 0
    let attempts = 0

    const initAos = () => {
      if (window.AOS) {
        window.AOS.init({
          duration: 700,
          once: true,
          easing: 'ease-out-cubic',
          offset: 70
        })
        return
      }

      attempts += 1
      if (attempts < 10) {
        timerId = window.setTimeout(initAos, 140)
      }
    }

    initAos()

    return () => {
      if (timerId) {
        window.clearTimeout(timerId)
      }
    }
  }, [])

  useEffect(() => {
    if (window.AOS) {
      window.AOS.refreshHard()
    }
  }, [location.pathname, location.hash])

  const handleSectionNav = (sectionId) => (event) => {
    event.preventDefault()
    setMenuOpen(false)
    setOpenDropdown('')

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
      return
    }

    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    navigate(`/#${sectionId}`)
  }

  const closeNavigation = () => {
    setMenuOpen(false)
    setOpenDropdown('')
  }

  const handleDropdownToggle = (dropdownName) => (event) => {
    if (window.innerWidth >= 992) {
      return
    }

    event.preventDefault()
    setOpenDropdown((currentOpen) => (currentOpen === dropdownName ? '' : dropdownName))
  }

  const isDropdownActive = (links) =>
    links.some((link) => (link.matchPaths || [link.to]).includes(location.pathname))

  return (
    <div className="site-app min-h-screen bg-slate-50 text-slate-900">
      <header>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top site-navbar" aria-label="Main navigation">
          <div className="container">
            <a className="navbar-brand site-brand d-flex align-items-center gap-2" href="/#hero" onClick={handleSectionNav('hero')}>
              <span className="brand-mark" aria-hidden="true" />
              <span>{data.profile.name}</span>
            </a>

            <button
              className="navbar-toggler"
              type="button"
              aria-controls="siteNavbar"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              onClick={() => {
                setMenuOpen((open) => !open)
                setOpenDropdown('')
              }}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="siteNavbar">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
                {primaryNavLinks.map((link) => (
                  <li className="nav-item" key={`${link.to}-${link.label}`}>
                    <NavLink
                      className={({ isActive }) => `nav-link site-nav-link${isActive ? ' active' : ''}`}
                      to={link.to}
                      end={link.end}
                      onClick={closeNavigation}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}

                <li className="nav-item dropdown site-nav-dropdown">
                  <button
                    type="button"
                    className={`nav-link site-nav-link dropdown-toggle site-dropdown-toggle${
                      isDropdownActive(resumeLinks) ? ' active' : ''
                    }${openDropdown === 'resume' ? ' show' : ''}`}
                    aria-expanded={openDropdown === 'resume'}
                    onClick={handleDropdownToggle('resume')}
                  >
                    Resume
                  </button>
                  <ul className={`dropdown-menu site-dropdown-menu${openDropdown === 'resume' ? ' show' : ''}`}>
                    {resumeLinks.map((link) => (
                      <li key={`${link.to}-${link.label}`}>
                        <NavLink
                          className={({ isActive }) => `dropdown-item site-dropdown-item${isActive ? ' active' : ''}`}
                          to={link.to}
                          onClick={closeNavigation}
                        >
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item dropdown site-nav-dropdown">
                  <button
                    type="button"
                    className={`nav-link site-nav-link dropdown-toggle site-dropdown-toggle${
                      isDropdownActive(blogLinks) ? ' active' : ''
                    }${openDropdown === 'blogs' ? ' show' : ''}`}
                    aria-expanded={openDropdown === 'blogs'}
                    onClick={handleDropdownToggle('blogs')}
                  >
                    Blogs
                  </button>
                  <ul className={`dropdown-menu site-dropdown-menu${openDropdown === 'blogs' ? ' show' : ''}`}>
                    {blogLinks.map((link) => (
                      <li key={`${link.to}-${link.label}`}>
                        <NavLink
                          className={({ isActive }) => `dropdown-item site-dropdown-item${isActive ? ' active' : ''}`}
                          to={link.to}
                          onClick={closeNavigation}
                        >
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item dropdown site-nav-dropdown">
                  <button
                    type="button"
                    className={`nav-link site-nav-link dropdown-toggle site-dropdown-toggle${
                      isDropdownActive(moreLinks) ? ' active' : ''
                    }${openDropdown === 'more' ? ' show' : ''}`}
                    aria-expanded={openDropdown === 'more'}
                    onClick={handleDropdownToggle('more')}
                  >
                    More
                  </button>
                  <ul className={`dropdown-menu site-dropdown-menu${openDropdown === 'more' ? ' show' : ''}`}>
                    {moreLinks.map((link) => (
                      <li key={`${link.to}-${link.label}`}>
                        <NavLink
                          className={({ isActive }) => `dropdown-item site-dropdown-item${isActive ? ' active' : ''}`}
                          to={link.to}
                          onClick={closeNavigation}
                        >
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer py-6">
        <div className="footer-shell">
          <div className="row g-4 footer-top">
            <section className="col-12 col-lg-7 footer-about" aria-label="About">
              <h2 className="footer-title">About</h2>
              <h3 className="h6 mb-1">{data.profile.name}</h3>
              <p className="muted-text mb-0">{data.profile.title}</p>
              {data.summary && <p className="muted-text mt-2 mb-0">{data.summary}</p>}
            </section>

            <div className="col-12 col-lg-5 ms-lg-auto">
              <div className="row g-4 footer-side-cols">
                <nav className="col-12 col-sm-6 footer-nav" aria-label="Footer navigation">
                  <h2 className="footer-title">Navigation</h2>
                  <div className="d-flex flex-column gap-1">
                    {footerSectionLinks.map((link) => (
                      <a className="footer-link" href={`/#${link.id}`} onClick={handleSectionNav(link.id)} key={link.id}>
                        {link.label}
                      </a>
                    ))}
                    <NavLink className="footer-link" to="/research">
                      Research & Publications
                    </NavLink>
                    <NavLink className="footer-link" to="/ideas">
                      Ideas
                    </NavLink>
                  </div>
                </nav>

                <section className="col-12 col-sm-6 footer-contact" aria-label="Contact">
                  <h2 className="footer-title">Contact</h2>
                  <div className="d-flex flex-column gap-1">
                    {data.profile.email && (
                      <a className="footer-link" href={`mailto:${data.profile.email}`}>
                        {data.profile.email}
                      </a>
                    )}
                    {data.profile.phone && phoneHref && (
                      <a className="footer-link" href={phoneHref}>
                        {data.profile.phone}
                      </a>
                    )}
                    {data.profile.location && <p className="muted-text mb-0">{data.profile.location}</p>}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="footer-bottom mt-3 pt-2 d-flex flex-column flex-md-row gap-1 justify-content-between">
            <p className="muted-text mb-0">&copy; {new Date().getFullYear()} {data.profile.name}. All rights reserved.</p>
            <p className="muted-text mb-0">Professional profile website</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
