import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Nanox home">
      NANO<span>O</span>X
    </Link>
  );
}

function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="container nav-wrapper">
          <Logo />
          <button
            className="menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <nav className={`nav ${open ? 'open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h4>Contact</h4>
            <p>Email: <a href="mailto:irankundasteve22@gmail.com">irankundasteve22@gmail.com</a></p>
            <p>Phone: <a href="tel:+25767622353">+25767622353</a></p>
          </div>
          <div>
            <h4>Follow</h4>
            <a href="https://www.facebook.com/profile.php?id=61551810645067" target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
          <div>
            <h4>Legal</h4>
            <p><Link to="/privacy-policy">Privacy Policy</Link></p>
            <p><Link to="/terms-of-service">Terms of Service</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
