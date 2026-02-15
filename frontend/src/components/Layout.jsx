import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/education', label: 'Education' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills' },
  { to: '/publications', label: 'Publications' },
  { to: '/ideas', label: 'Ideas' },
  { to: '/contact', label: 'Contact' }
]

export default function Layout({ data, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="page">
      <header className="topbar">
        <nav className="nav">
          <div className="brand-wrap">
            <div className="brand">
              <span className="brand-dot" />
              <span>{data.profile.name}</span>
            </div>
            {data.profile.hero_image_url ? (
              <img className="brand-avatar" src={data.profile.hero_image_url} alt={data.profile.name} />
            ) : null}
          </div>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} {data.profile.name}. Built with Python and React.
        </p>
      </footer>
    </div>
  )
}
