import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './datanav.css';

const Datanav = ({ districtName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const speakText = `Welcome to ${districtName}`;
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(speakText);
      speech.lang = 'en-IN'; // Change to 'te-IN' for Telugu
      speech.rate = 1; // Adjust speech speed
      speech.volume = 1; // Ensure volume is max
      speech.pitch = 1; // Normal pitch
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      window.speechSynthesis.speak(speech);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  }, [districtName]);

  return (
    <nav className="Datanav">
      <div className="datanav-logo">
        <img src="/logo.png" alt="Logo" className="responsive-logo" />
      </div>
      <div className="datanav-title">Welcome to {districtName}</div>
      <div className="datanavnav-icon" onClick={() => navigate('/map')}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
    </nav>
  );
};

export default Datanav;
