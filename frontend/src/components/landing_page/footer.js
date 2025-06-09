import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'; // Ensure you install 'lucide-react'
import './footer.css'; // CSS file for styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faUsers, faLink } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo">
          <img src="/logo.png" alt="Your Logo" className="footer-logo-img" />
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <ul className="footer-links">
           <li>
                     <a href="/">
                       <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px' }} /> Home
                     </a>
                   </li>
                   <li>
                     <a href="/#aboutt">
                       <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '20px' }} /> About
                     </a>
                   </li>
                   <li>
                     <a href="/#team">
                       <FontAwesomeIcon icon={faUsers} style={{ fontSize: '20px' }} /> Team
                     </a>
                     
                   </li>
                   <li>
                   <a href="/#connect">
                       <FontAwesomeIcon icon={faLink} style={{ fontSize: '20px' }} /> Connect
                     </a>
                     </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-social">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook size={28} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={28} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={28} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DATADIALECT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
