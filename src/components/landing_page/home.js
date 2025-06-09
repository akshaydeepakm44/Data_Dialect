import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import Navbar from './navbar';
import About from './about';
import Team from './team';
import Roadmap from './roadmap';
import Footer from './footer';
import ContactUs from './contact';
const HomePage = () => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const text =
      "........Hear It from Local Voices: Discover the Essence of Andhra Pradesh. Dive into the vibrant culture, heritage, and stories of Andhra Pradesh through the voices of its people. Our mission is to collect, preserve, and analyze local narratives with cutting-edge AI.";
    let index = 0;

    const typingEffect = () => {
      if (index < text.length) {
        setTypedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    };

    const interval = setInterval(typingEffect, 50);

    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("aboutt");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container" id="home">
        <div className="left-side">
          <div className="matter">
            <h1>Welcome to</h1>
            <h2 className="highlight-text">DATA DIALECT</h2>
            <div className="animated-matter">
              <p>{typedText}</p>
            </div>
            <button className="know-more" onClick={scrollToAbout}>
              Know More
            </button>
          </div>
        </div>
        <div className="right-side">
          <img src="home.png" alt="Home" className="responsive-image" />
        </div>
      </div>
      <div className="down" id="aboutt">
        <About />
      </div>
      <div>
        <Roadmap />
      </div>
      <div className="down1" id="team">
        <Team />
      </div>
      <div className="join-us-wrapper">
        <Link to="/userlogin" className="join-us-link">
          Join Us
        </Link>
      </div>
      <div>
        <ContactUs/>
      </div>
      
      <div>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
