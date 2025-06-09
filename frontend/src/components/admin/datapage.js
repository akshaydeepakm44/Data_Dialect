import React, { useState, useEffect } from "react";
import axios from "axios";
import "./datapage.css";
import Navbar1 from './navbar1.js';
import Footerr from './footerr.js';
import {
  FaFont,
  FaHeadphonesAlt,
  FaVideo,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function DataPage() {
  // State to keep track of data counts
  const [dataCounts, setDataCounts] = useState({ text: 0, audio: 0, video: 0 });
  const [approvalStatus, setApprovalStatus] = useState([null, null, null]);
  const [data, setData] = useState({ text: [], audio: [], video: [] });
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState(null); // New state for error
  // State for pending data
  const [pendingData, setPendingData] = useState({ text: [], audio: [], video: [] });

  useEffect(() => {
    const fetchDataCounts = async () => {
      try {
        const textRes = await axios.get("http://localhost:5000/count/text");
        const audioRes = await axios.get("http://localhost:5000/count/audio");
        const videoRes = await axios.get("http://localhost:5000/count/video");
        
        setDataCounts({
          text: textRes.data.count,
          audio: audioRes.data.count,
          video: videoRes.data.count,
        });
      } catch (error) {
        console.error("Error fetching data counts:", error);
      }
    };

    // Fetch pending data from the backend
    const fetchPendingData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pending-submissions");
        setPendingData({
          text: res.data.pending_texts,
          audio: res.data.pending_audios,
          video: res.data.pending_videos,
        });
      } catch (error) {
        console.error("Error fetching pending data:", error);
      }
    };

    fetchDataCounts();
    fetchPendingData();
  }, []);


  const handleApproval = async (type, id, status) => {
    try {
      await axios.put(`http://localhost:5000/data/${type}/${id}/approve`, { status });
      setData((prevData) => ({
        ...prevData,
        [type]: prevData[type].map((item) =>
          item.id === id ? { ...item, submission_status: status === "approved" ? "Processed" : "Pending" } : item
        ),
      }));

      // Update the pending data state after approval
      setPendingData((prevData) => ({
        ...prevData,
        [type]: prevData[type].filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error(`Error approving ${type} data:`, error);
    }
  };

  
  

  const fetchData = async (type) => {
    setLoading(true); // Set loading to true before fetching data
    setError(null); // Reset error state
    try {
      const res = await axios.get(`http://localhost:5000/data/${type}`);
      const updatedData = res.data.map(item => ({
        ...item,
        file_path: item.file_path,
        category: item.category // Include category in the data
      }));
      setData((prevData) => ({ ...prevData, [type]: updatedData }));
      setSelectedType(type);
    } catch (error) {
      setError(`Error fetching ${type} data: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:5000/data/${type}/${id}`);
      setData((prevData) => ({
        ...prevData,
        [type]: prevData[type].filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error(`Error deleting ${type} data:`, error);
    }
  };

  return (
    <div className="page-container">
      <Navbar1 />
      <main className="content">
        <div className="data-section">
          <div className="data-box" onClick={() => fetchData('text')}>
            <FaFont className="icon" />
            <div className="data-number">{dataCounts.text}</div>
            <div className="data-label">Manage text data</div>
          </div>
          <div className="data-box" onClick={() => fetchData('audio')}>
            <FaHeadphonesAlt className="icon" />
            <div className="data-number">{dataCounts.audio}</div>
            <div className="data-label">Manage audio data</div>
          </div>
          <div className="data-box" onClick={() => fetchData('video')}>
            <FaVideo className="icon" />
            <div className="data-number">{dataCounts.video}</div>
            <div className="data-label">Manage video data</div>
          </div>
        </div>

        {loading && <p>Loading data...</p>} {/* Display loading message */}
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}

        {selectedType && !loading && !error && (
          <div className="data-table">
            <h3>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Data</h3>
            {data[selectedType].length > 0 ? (
              <ul>
                {data[selectedType].map((item, index) => (
                  <li key={index}>
                    <strong>ID:</strong> {item.id} <br />
                    <strong>Content:</strong> {selectedType === 'video' ? item.category : item.content || item.file_path} <br />
                    {selectedType === 'audio' && item.file_path && (
                      <audio controls>
                        <source src={`http://localhost:5000${item.file_path}`} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {selectedType === 'video' && item.file_path && (
                      <video width="320" height="240" controls>
                        <source src={`http://localhost:5000${item.file_path}`} type="video/mp4" />
                        Your browser does not support the video element.
                      </video>
                    )}
                    <div>
                      <button onClick={() => handleDelete(selectedType, item.id)}>Delete</button>
                      {item.submission_status === "Pending" && (
                        <>
                          <button onClick={() => handleApproval(selectedType, item.id, "approved")}>Approve</button>
                          <button onClick={() => handleApproval(selectedType, item.id, "rejected")}>Reject</button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No {selectedType} data available</p>
            )}
          </div>
        )}

<div className="approval-section">
          <h3>Approval of Data Pending</h3>
          {['text', 'audio', 'video'].map((type) => (
            <div key={type} className="approval-item">
              <h4>{type.charAt(0).toUpperCase() + type.slice(1)} Submissions</h4>
              {pendingData[type].length > 0 ? (
                <ul>
                  {pendingData[type].map((item) => (
                    <li key={item.id} className="pending-item">
                      <p><strong>ID:</strong> {item.id}</p>
                      <p><strong>Submitted By:</strong> {item.submitted_by}</p>
                      <p><strong>Submission Date:</strong> {new Date(item.submitted_on).toLocaleString()}</p>
                      <p><strong>Content:</strong> {item.user_input || item.transcribed_text}</p>
                      {item.video_file && (
                        <video width="320" height="240" controls>
                          <source src={`http://localhost:5000/static/uploads/${item.video_file}`} type="video/mp4" />
                        </video>
                      )}
                      {item.audio_file && (
                        <audio controls>
                          <source src={`http://localhost:5000/static/uploads/${item.audio_file}`} type="audio/mpeg" />
                        </audio>
                      )}
                      <div className="approval-buttons">
                        <button onClick={() => handleApproval(type, item.id, "approved")}>Approve</button>
                        <button onClick={() => handleApproval(type, item.id, "rejected")}>Reject</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending {type} data for approval.</p>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footerr />
    </div>
  );
}

export default DataPage;

