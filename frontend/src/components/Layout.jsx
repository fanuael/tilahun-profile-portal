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
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const phoneHref = `tel:${(data.profile.phone || '').replace(/\s+/g, '')}`

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-bg selection:bg-gold/30 selection:text-gold-strong">
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-3 bg-white/90 backdrop-blur-md shadow-lg border-b border-gold/10' 
            : 'py-5 bg-white/30 backdrop-blur-sm'
        } px-[5vw]`}
      >
        <nav className="max-w-[1180px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gold to-[#d7af7e] shadow-[0_0_0_5px_rgba(183,134,75,0.16)] group-hover:scale-110 group-hover:shadow-glow transition-all duration-300" />
            </div>
            <span className="font-bold text-ink tracking-tight text-lg">{data.profile.name}</span>
            {data.profile.hero_image_url && (
              <img 
                className="w-11 h-[54px] rounded-lg2 object-cover object-[center_22%] border-2 border-gold-strong/30 hover:scale-110 transition-transform duration-300 shadow-elevation" 
                src={data.profile.hero_image_url} 
                alt={data.profile.name} 
              />
            )}
          </div>

          <button
            className="lg:hidden w-10 h-10 rounded-md2 border border-ink/10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-white hover:shadow-elevation focus-ring"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 rounded-full bg-ink transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 rounded-full bg-ink transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-5 h-0.5 rounded-full bg-ink transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>

          <div className={`
            fixed lg:static inset-x-0 top-[72px] lg:top-auto p-4 lg:p-0
            bg-white/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-b border-ink/5 lg:border-none
            flex flex-col lg:flex-row items-center gap-1 lg:gap-2
            transition-all duration-300 lg:opacity-100
            ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none lg:pointer-events-auto lg:translate-y-0'}
          `}>
            {navLinks.map((link, idx) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: menuOpen ? `${idx * 30}ms` : '0ms' }}
                className={({ isActive }) => `
                  w-full lg:w-auto px-4 py-2.5 rounded-full text-[0.9rem] font-semibold text-center
                  transition-all duration-200 border border-transparent
                  focus-ring
                  ${isActive 
                    ? 'text-gold-strong bg-gradient-to-br from-gold/20 to-teal/10 border-gold/30 shadow-elevation' 
                    : 'text-muted hover:border-gold/40 hover:bg-gold/10 hover:text-ink'
                  }
                `}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="mt-auto">
        <div className="px-[5vw] py-12 md:py-16 bg-gradient-to-br from-wood via-[#4c3627] to-teal border-t border-gold/20">
          <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-start mb-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-2xl text-paper leading-tight">{data.profile.name}</h3>
              <p className="text-sm text-white/80 leading-relaxed">{data.profile.title}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gold uppercase tracking-[0.15em]">Contact</p>
              <a className="text-sm text-paper hover:text-gold transition-colors duration-200" href={`mailto:${data.profile.email}`}>
                {data.profile.email}
              </a>
              <a className="text-sm text-paper hover:text-gold transition-colors duration-200" href={phoneHref}>
                {data.profile.phone}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gold uppercase tracking-[0.15em]">Location</p>
              <p className="text-sm text-paper">{data.profile.location}</p>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1 text-left">
              <p className="text-xs font-bold text-gold uppercase tracking-[0.15em]">Quick Links</p>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="text-sm text-paper hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          <div className="divider-thin" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-paper">&copy; {new Date().getFullYear()} {data.profile.name}. All rights reserved.</p>
            <p className="text-xs text-white/60">Crafted with precision and passion for academic excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
