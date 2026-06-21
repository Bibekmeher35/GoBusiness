import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="footer-brand">Go Business</span>
        <nav className="footer-nav" aria-label="Footer">
          <a href="#about" className="footer-link">About</a>
          <a href="#contact" className="footer-link">Contact</a>
          <a href="#privacy" className="footer-link">Privacy</a>
          <a href="#terms" className="footer-link">Terms</a>
        </nav>
        <span className="footer-copyright">
          © 2026 Go Business, Inc.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
