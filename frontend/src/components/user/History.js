import React, { useEffect, useState } from "react";
import Nav from "./nav";
import UserFooter from "./userfooter";

const History = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/view-history");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data.records)) {
          setRecords(data.records);
        } else {
          console.error("Invalid data format:", data);
          setRecords([]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav />
      <div style={{ flex: "1", padding: "20px" }} className="history-container">
        <h1>Audio Submission History</h1>
        <table style={{ borderCollapse: "collapse", width: "100%", border: "2px solid black" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Submitted On</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Submission Status</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>User Input</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Audio File</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Transcribed Text</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Predictions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{record.submitted_by || "Unknown"}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{record.submitted_on || "N/A"}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{record.submission_status || "Pending"}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{record.user_input || "No input provided"}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <audio controls>
                    <source src={`data:audio/wav;base64,${record.audio_file}`} type="audio/wav" />
                  </audio>
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{record.transcribed_text || "No transcription available"}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {record.predictions.length > 0
                    ? record.predictions.join(", ")
                    : "No predictions available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFooter />
    </div>
  );
};

export default History;
