import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { nav, site } from '../../config/site.js';

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const close = () => setOpen(false);

  // Whenever navigating to any page, scroll to top so top-dark-nav is visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* 1. Top Dark Navigation Bar:
             Stays naturally at the top of the page.
             When scrolling down, it smoothly scrolls out of view (hides) with zero flicker/jitter.
             When navigating to any page or scrolling back to top, it shows at the top. */}
      <div className="top-dark-nav">
        <div className="container top-dark-row">
          <div className="top-dark-contact">
            <a href="tel:9305815719" className="top-dark-link">
              <span className="top-icon">📞</span>
              <span>+91 9305815719</span>
            </a>
            <span className="top-divider">|</span>
            <a href="mailto:shailendrayadaw2004@gmail.com" className="top-dark-link">
              <span className="top-icon">✉️</span>
              <span>shailendrayadaw2004@gmail.com</span>
            </a>
          </div>

          <div className="top-dark-admin">
            {admin ? (
              <div className="top-admin-group">
                <Link to="/admin" className="top-admin-link">
                  Dashboard
                </Link>
                <button type="button" className="top-signout-btn" onClick={logout}>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="top-admin-btn">
                <span className="admin-lock-icon">🔒</span>
                <span>Admin login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Cleanly sticks to top: 0) */}
      <header className="header">
        <div className="container header-row">
          <Link to="/" className="brand" onClick={close}>
            <Logo size={38} />
            <span>{site.name}</span>
          </Link>

          <button
            className="menu-btn"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
          </button>

          <nav className={open ? 'nav open' : 'nav'}>
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={close}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
