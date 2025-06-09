import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './analysispage.css';
import Navbar1 from './navbar1.js';
import Footerr from './footerr.js';

const AnalysisPage = () => {
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetchLineData();
    fetchBarData();
  }, []);

  const fetchLineData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/count/users-today');
      const formattedData = [{ date: new Date().toLocaleDateString(), users: response.data.logged_in_today }];
      setLineData(formattedData);
    } catch (error) {
      console.error('Error fetching user login data:', error);
    }
  };

  const fetchBarData = async () => {
    try {
      const videoRes = await axios.get('http://localhost:5000/count/video');
      const textRes = await axios.get('http://localhost:5000/count/text');
      const audioRes = await axios.get('http://localhost:5000/count/audio');
      
      const formattedData = [
        { type: 'Video', count: videoRes.data.count },
        { type: 'Text', count: textRes.data.count },
        { type: 'Audio', count: audioRes.data.count }
      ];
      setBarData(formattedData);
    } catch (error) {
      console.error('Error fetching data type count:', error);
    }
  };

  return (
    <div>
      <Navbar1 />
      <div className="content-analysis">
        <div className="graphs-container">
          {/* Line Graph */}
          <div className="graph-card">
            <h2 className="graph-title">User Logins Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Graph */}
          <div className="graph-card">
            <h2 className="graph-title">Data Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footerr />
    </div>
  );
};

export default AnalysisPage;
