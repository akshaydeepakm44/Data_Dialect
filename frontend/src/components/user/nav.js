import React, { useState, useEffect } from 'react';
import './nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faGift, faUser, faCalendarAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchStreak = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/user/details?user_id=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setStreak(data.user.streak_count);
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };

    fetchStreak();
  }, []);

  return (
    <nav className="navba">
  <div className="navba-logo">
    <Link to="/">
      <img src="/logo.png" alt="Logo" />
    </Link>
  </div>

  <ul className={`navba-links ${isMenuOpen ? 'active' : ''}`}>
    <li><Link to="/userdashboard"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
    <li><Link to="/mystats"><FontAwesomeIcon icon={faChartLine} /> My Stats</Link></li>
    <li><Link to="/bonus"><FontAwesomeIcon icon={faGift} /> Bonus</Link></li>
    <li><Link to="/profile"><FontAwesomeIcon icon={faUser} /> Profile</Link></li>
    {/* <li><Link to="/events"><FontAwesomeIcon icon={faCalendarAlt} /> Events</Link></li> */}

    {/* Mobile Streak Display */}
    <li className="mobile-streak">
      <span className="emoji">🔮</span>
      <span>{streak} Days</span>
    </li>
  </ul>

  {/* Toggle Button for Mobile */}
  <div className="navba-toggle" onClick={toggleMenu}>
    <FontAwesomeIcon icon={faBars} />
  </div>

  {/* Desktop Streak Display */}
  <div className="navba-streak desktop-streak">
    <span className="emoji">🔮</span>
    <span>{streak} Days</span>
  </div>
</nav>
  );
};

export default Nav;
