import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-mark">
                <span>S</span><span style={{ opacity: 0.7 }}>M</span>
              </div>
              <span className="footer__logo-name">SPOT MICRO</span>
            </div>
            <p className="footer__tagline">
              SPOT MICRO — Not just a robot. A family member.
            </p>
            <p className="footer__desc">
              An AI-powered robotic puppy designed to learn, play, and connect with you every day.
            </p>
          </div>

          {/* Links */}
          {[
            {
              heading: 'Product',
              links: ['Overview', 'Bionics', 'Neural AI', 'Power System', 'Specs'],
            },
            {
              heading: 'Company',
              links: ['About', 'Press', 'Careers', 'Investors', 'Blog'],
            },
            {
              heading: 'Support',
              links: ['Documentation', 'Community', 'Contact', 'Privacy', 'Terms'],
            },
          ].map((col, i) => (
            <div key={i} className="footer__col">
              <h4 className="footer__col-heading">{col.heading}</h4>
              <ul className="footer__col-links">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            Copyright © 2026 Spot Micro Robotics, Inc. All rights reserved.
            Spot Micro Robot Puppy is a trademark of Spot Micro Robotics, Inc.
          </p>
          <div className="footer__bottom-links">
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((l) => (
              <a key={l} href="#" className="footer__bottom-link">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
