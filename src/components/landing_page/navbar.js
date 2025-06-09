import React from 'react';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faUsers, faLink } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
  <a href="/adminlogin">
    <img src="/logo.png" alt="Logo" className="responsive-logo" />
  </a>
</div>


      {/* Nav Links - Desktop View */}
      <ul className="navbar-links">
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
      
      {/* Get Started Button */}
      <div className="navbar-button">
        <a href="/map" className="btn">Explore Andhra</a>
      </div>
    </nav>
  );
};

export default Navbar;
