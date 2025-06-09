import React, { useState, useEffect } from 'react';
import './about.css';
import { CSSTransition } from 'react-transition-group';
import Roadmap from './roadmap';

const About = () => {
  const [activeTab, setActiveTab] = useState('whatWeDo');
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    setShowContent(false);
    const timeout = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  return (
    <>
    <div className="about-section" id="about">
      <h2 className="section-titlee">About Us</h2>

      {/* Tab Navigation */}
      <div className="tabs-container">
        {['whatWeDo', 'missionAndVision', 'howItWorks'].map((tab) => (
          <div
            key={tab}
            className={`tab-heading ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'whatWeDo' && 'What We Do'}
            {tab === 'missionAndVision' && 'Mission & Vision'}
            {tab === 'howItWorks' && 'How It Works'}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        <CSSTransition
          in={showContent}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <div className="tab-content animated-card">
            {activeTab === 'whatWeDo' && (
              <div className="content-card full-width-card">
                <h3>What We Do</h3>
                <p>
  At <strong>Data Dialect</strong>, we actively celebrate and preserve <strong>cultural diversity</strong> by collecting and preserving <strong>local folklore</strong> and <strong>traditions</strong> that reflect the unique heritage of different communities. We showcase <strong>regional music</strong> and <strong>folk songs</strong>, bringing traditional sounds to the forefront. Our platform also highlights <strong>famous landmarks</strong> and <strong>places</strong>, offering insights into the <strong>history</strong> and <strong>significance</strong> of these locations. We document and share <strong>traditional cuisine</strong> and <strong>recipes</strong>, keeping culinary traditions alive. Additionally, we aim to preserve and share <strong>cultural stories</strong> and <strong>experiences</strong>, ensuring they are passed down for future generations.
</p>
</div>
            )}
            {activeTab === 'missionAndVision' && (
              <div className="content-card full-width-card">
                <h3>Mission & Vision</h3>
   <div>
    <h4>Vision</h4>
    <p>
      At Data Dialect, our vision is to celebrate and preserve cultural diversity, making it accessible to all. We aim to showcase the richness of regional stories and traditions. Our goal is to foster cross-cultural understanding and appreciation globally.
    </p>
  
    <h4>Mission</h4>
    <p>
      Our mission is to collect, curate, and share regional stories, traditions, and experiences through innovative technologies. We aim to empower individuals to preserve their cultural heritage. By leveraging text, audio, and video data, we promote cross-cultural understanding.
    </p>
  </div>


              </div>
            )}
            {activeTab === 'howItWorks' && (
              <div className="content-card full-width-card">
                <h3>How It Works</h3>
<div>
  <h4><strong>Users:</strong></h4>
  <ul>
    <li><strong>Share regional stories, songs & traditions</strong>: Upload local folklore and traditions.</li>
    <li><strong>Preserve cultural heritage</strong>: Contribute to maintaining cultural legacies.</li>
    <li><strong>Earn rewards</strong>: Get rewarded for your contributions to the platform.</li>
  </ul>

  <h4><strong>Admins:</strong></h4>
  <ul>
    <li><strong>Access curated cultural database</strong>: Manage and organize the uploaded data.</li>
    <li><strong>Gain regional insights</strong>: Analyze trends and patterns in the data.</li>
    <li><strong>Utilize data for research & education</strong>: Use the data for research and educational purposes.</li>
  </ul>
</div>


</div>            )}
          </div>
        </CSSTransition>
      </div>
      
    </div>
  </>
  );
};

export default About;
