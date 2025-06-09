import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Datanav from "./datanav";
import districtImages from "./imageData";
import ImageSlider from "./ImageSlider";
import "./DistrictData.css";
import Footer from "./footer";
const DistrictData = () => {
  const { districtName } = useParams();
  const [data, setData] = useState({ audio: [], video: [], text: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("text");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/districts/${districtName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [districtName]);

  if (loading) return <p>Loading data for {districtName}...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const renderTextData = () => (
    <div className="text-data">
      {data.text.length > 0 ? (
        data.text.map((item, index) => (
          <div key={index} className="text-card">
            <h3>Category:{item.category}</h3>
            <p>{item.content}</p>
          </div>
        ))
      ) : (
        <p>No text data available</p>
      )}
    </div>
  );

  const renderAudioData = () => (
    <div className="audio-data">
      {data.audio.length > 0 ? (
        data.audio.map((item, index) => (
          <div key={index} className="audio-card">
            <strong>Category:</strong> {item.category} <br />
            {item.file_path ? (
              <audio controls>
                <source src={`http://localhost:5000/static/uploads/${item.file_path}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>Audio file not available</p>
            )}
          </div>
        ))
      ) : (
        <p>No audio data available</p>
      )}
    </div>
  );

  const renderVideoData = () => (
    <div className="video-data">
      {data.video.length > 0 ? (
        <div className="video-slider">
          {data.video.map((item, index) => (
            <div key={index} className="video-card">
              <strong>Category:</strong> {item.category} <br />
              {item.file_path ? (
                <video width="320" height="240" controls>
                  <source src={`http://localhost:5000/static/uploads/${item.file_path}`} type="video/mp4"/>
                  Your browser does not support the video element.
                </video>
              ) : (
                <p>Video file not available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No video data available</p>
      )}
    </div>
  );

  return (
    <>
    <div className="hi">
      <Datanav districtName={districtName} />
      <ImageSlider images={districtImages[districtName] || []} />
      <button className="excitement-button" onClick={() => {/* Add excitement animation logic here */}}>
        Excited
      </button>
      <div className="filter-section">
        {/* <img src="/dataserach.svg" alt="Constant" /> */}
        <div className="filter-options">
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
          {/* Add more filter options if needed */}
        </div>
      </div>
      <div className="data-cards">
        {category === "text" && renderTextData()}
        {category === "audio" && renderAudioData()}
        {category === "video" && renderVideoData()}
      </div>
      
    </div>
    <Footer/>
    </>
  );
};

export default DistrictData;
