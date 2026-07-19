import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setScrollProgress(docHeight > 0 ? (y / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Bionics', id: 'bionics' },
    { label: 'Neural AI', id: 'neural-ai' },
    { label: 'Power', id: 'power' },
    { label: 'Specs', id: 'specs' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--visible' : ''}`}>
      <div className="navbar__progress" style={{ width: `${scrollProgress}%` }} />
      <div className="navbar__inner container">
        {/* Logo */}
        <div className="navbar__logo">
          <div className="navbar__logo-mark">
            <img src={logo} alt="" />
          </div>


          <span className="navbar__logo-text">SPOT MICRO</span>
        </div>

        {/* Center Links */}
        <ul className="navbar__links">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <button className="navbar__link" onClick={() => scrollTo(id)}>
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button className="navbar__cta" onClick={() => scrollTo('reserve')}>
          <span>Reserve Spot Micro</span>
        </button>

        {/* Hamburger Menu Toggle */}
        <button 
          className={`hamburger ${isMenuOpen ? 'hamburger--open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
        </button>
      </div>

      {/* Mobile Slide-in Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}>
        <ul className="mobile-menu__links">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <button className="mobile-menu__link" onClick={() => scrollTo(id)}>
                {label}
              </button>
            </li>
          ))}
          <li>
            <button className="mobile-menu__cta" onClick={() => scrollTo('reserve')}>
              Reserve Spot Micro
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
