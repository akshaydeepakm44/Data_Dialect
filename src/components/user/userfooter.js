import React from 'react';
import './userfooter.css'; // Add styles for the footer

const UserFooter = () => {
  return (
    <footer className="userfooter">
      <div className="userfooter-container">
        <div className="userfooter-logo">
          <img src="logo.png" alt="Logo" />
        </div>
        <p>&copy; {new Date().getFullYear()} DATADIALECT. All rights reserved.</p>
        <div className="userfooter-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      
    </footer>
  );
};

export default UserFooter;
