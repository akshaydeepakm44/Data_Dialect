import React, { useState, useEffect } from 'react';
import './video.css';
import Nav from './nav';
import UserFooter from './userfooter';

const VideoPage = () => {
  const [name, setName] = useState(''); // Initialize with an empty string
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setName(storedUsername);
    }
  }, []);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !category || !videoFile) {
      alert("Please fill all fields and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("submitted_by", name);  // Maps to 'submitted_by' in API
    formData.append("user_input", category); // Maps to 'user_input' in API

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Video submitted successfully!");
      } else {
        alert(result.error || "Failed to upload video.");
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      alert("An error occurred while uploading the video.");
    }
  };

  return (
    <>
      <Nav />
      <div className="video-page">
        <div className="video-card">
          <div className="video-form-section">
            <h2>UPLOAD VIDEO DATA</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  readOnly // Make it non-editable
                />
              </label>
              <label>
                Type of Data:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">-- Select Category --</option>
                  <option value="History">History </option>
                  <option value="cultural-performances">Cultural Performances</option>
                  <option value="local-tours">Local Tours and Guides</option>
                  <option value="food-reviews">Food Preparation and Reviews</option>
                  <option value="festivals">Festival and Celebration Footage</option>
                  <option value="traditional-crops">Traditional Crop Videos</option>
                </select>
              </label>
              <label>
                Upload Video:
                <input type="file" accept="video/*" onChange={handleFileChange} required />
              </label>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
          <div className="video-rules-section">
            <h3>Rules and Constraints</h3>
            <ul>
              <li>Ensure there is no background noise or unrelated visuals.</li>
              <li>Start the video by stating your name and place of origin.</li>
              <li>Maintain a resolution of at least 720p for better quality.</li>
              <li>Keep the video focused on the topic category you selected.</li>
              <li>Avoid any offensive or inappropriate visuals or content.</li>
            </ul>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
};

export default VideoPage;
