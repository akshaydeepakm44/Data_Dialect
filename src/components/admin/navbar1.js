import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDatabase, faUser, faChartBar } from '@fortawesome/free-solid-svg-icons';
import "./navbar1.css";

const Navbarr = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container">
      <nav className="user-details-navbar">
        <div className="logo">
          <a href="/">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </a>
        </div>

        <div className="navba-toggle" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-item">
            <Link to="/adminhome">
              <FontAwesomeIcon icon={faHome} size="lg" />
              <span>HOME</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/data">
              <FontAwesomeIcon icon={faDatabase} size="lg" />
              <span>DATA</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/user">
              <FontAwesomeIcon icon={faUser} size="lg" />
              <span>USER</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/analysis">
              <FontAwesomeIcon icon={faChartBar} size="lg" />
              <span>ANALYSIS</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbarr;