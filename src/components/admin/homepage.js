// import React from "react";
// import "./homepage.css";
// import Navbarr from './navbar1.js';
// import Footerr from './footerr.js';
// const Homepagee = () => {
//   return (
//     <div className="homepagee">
//       <Navbarr/>
      

//       {/* Summary Section */}
//       <div className="summary-section">
//         <h2>Summary of the web</h2>
//         <div className="summary-cards">
//           <div className="card">
//             <i className="fas fa-eye"></i>
//             <h3>2,345</h3>
//             <p>Daily visits</p>
//           </div>
//           <div className="card">
//             <i className="fas fa-tablet-alt"></i>
//             <h3>1,323</h3>
//             <p>Data entered</p>
//           </div>
//           <div className="card">
//             <i className="fas fa-comments"></i>
//             <h3>456</h3>
//             <p>Feedback received</p>
//           </div>
//         </div>
//       </div>

//       {/* Graphs Section */}
//       <div className="graphs-section">
//         <div className="line-graph">
//           <h3>Line graph of user Data</h3>
//           <div className="graph-placeholder">[Line Graph Placeholder]</div>
//         </div>
//         <div className="bar-graph">
//           <h3>Bar graph on type of data</h3>
//           <div className="graph-placeholder">[Bar Graph Placeholder]</div>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footerr/>
//     </div>
//   );
// };

// export default Homepagee;


import React, { useEffect, useState } from "react";
import "./homepage.css";
import Navbarr from "./navbar1.js";
import Footerr from "./footerr.js";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Homepagee = () => {
  const [dailyVisits, setDailyVisits] = useState(0);
  const [totalDataEntered, setTotalDataEntered] = useState(0);
  const [feedbackReceived, setFeedbackReceived] = useState(456); // Placeholder
  const [lineGraphData, setLineGraphData] = useState({ labels: [], data: [] });
  const [barGraphData, setBarGraphData] = useState({ labels: [], data: [] });

  useEffect(() => {
    // Fetch daily visits
    axios.get("http://localhost:5000/count/users-today").then((response) => {
      setDailyVisits(response.data.logged_in_today || 0);
    }).catch(err => console.error("Error fetching daily visits:", err));

    // Fetch total data entered
    axios.get("http://localhost:5000/count/total").then((response) => {
      setTotalDataEntered(response.data.total_count || 0);
    }).catch(err => console.error("Error fetching total data:", err));

    // Fetch line graph data (user logins per day)
    axios.get("http://localhost:5000/count/users-per-day").then((response) => {
      const labels = response.data.map(entry => entry.date);
      const data = response.data.map(entry => entry.count);
      setLineGraphData({ labels, data });
    }).catch(err => console.error("Error fetching line graph data:", err));

    // Fetch bar graph data (video, audio, text counts)
    Promise.all([
      axios.get("http://localhost:5000/count/video"),
      axios.get("http://localhost:5000/count/audio"),
      axios.get("http://localhost:5000/count/text")
    ]).then(([videoRes, audioRes, textRes]) => {
      setBarGraphData({
        labels: ["Video", "Audio", "Text"],
        data: [videoRes.data.count || 0, audioRes.data.count || 0, textRes.data.count || 0],
      });
    }).catch(err => console.error("Error fetching bar graph data:", err));
  }, []);

  return (
    <div className="homepagee">
      <Navbarr />
      
      {/* Summary Section */}
      <div className="summary-section">
        <h2>Summary of the web</h2>
        <div className="summary-cards">
          <div className="card">
            <i className="fas fa-eye"></i>
            <h3>{dailyVisits}</h3>
            <p>Daily visits</p>
          </div>
          <div className="card">
            <i className="fas fa-tablet-alt"></i>
            <h3>{totalDataEntered}</h3>
            <p>Data entered</p>
          </div>
          <div className="card">
            <i className="fas fa-comments"></i>
            <h3>{feedbackReceived}</h3>
            <p>Feedback received</p>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="graphs-section">
        <div className="line-graph">
          <h3>Line graph of user Data</h3>
          <Line
            data={{
              labels: lineGraphData.labels,
              datasets: [
                {
                  label: "Users Logged In",
                  data: lineGraphData.data,
                  borderColor: "#4CAF50",
                  fill: false,
                },
              ],
            }}
          />
        </div>
        <div className="bar-graph">
          <h3>Bar graph on type of data</h3>
          <Bar
            data={{
              labels: barGraphData.labels,
              datasets: [
                {
                  label: "Data Type Count",
                  data: barGraphData.data,
                  backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
                },
              ],
            }}
          />
        </div>
      </div>
      
      <Footerr />
    </div>
  );
};

export default Homepagee;
