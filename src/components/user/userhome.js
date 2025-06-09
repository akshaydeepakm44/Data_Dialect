import React, { useState, useEffect } from 'react';
import Nav from './nav'; // Import Navbar
import UserFooter from './userfooter';
import { Link } from 'react-router-dom';
import './userhome.css';

const UserHome = () => {
  const [userName, setUserName] = useState("User");

  // Retrieve username from localStorage when component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  return (
    <>
      <Nav />

      <div className="userhomepage-container">
        {/* Welcome Message */}
        <h1>Welcome, {userName}!</h1>
        <h2>Choose the input type</h2>
        
        {/* Cards Layout */}
        <div className="userhomepage-content">
          <Link to="/text" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="userhomepage-card">
              <img src="/text.svg" alt="NLP" className="userhomepage-card-img" />
              <p>Our NLP website operates by collecting text data from various sources...</p>
            </div>
          </Link>

          <Link to="/audio" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="userhomepage-card">
              <img src="/audio.svg" alt="Voice Data" className="userhomepage-card-img" />
              <p>For voice data, our platform captures audio inputs...</p>
            </div>
          </Link>

          <Link to="/video" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="userhomepage-card">
              <img src="/video.svg" alt="Video Data" className="userhomepage-card-img" />
              <p>When it comes to video data, our site analyzes audiovisual content...</p>
            </div>
          </Link>
        </div>
      </div>
      
      <UserFooter />
    </>
  );
};

export default UserHome;
