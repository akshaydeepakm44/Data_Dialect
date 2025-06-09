// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/user/signup';
import Login from './components/user/login';
import './App.css';
import HomePage from './components/landing_page/home';

import AdminLogin from './components/admin/adminlogin';
import UserHome from './components/user/userhome';
import AudioPage from './components/user/audio';
import VideoPage from './components/user/video';
import TextPage from './components/user/text';
import ExploreAndhra from './components/landing_page/map';
import Homepagee from './components/admin/homepage';
import AnalysisPage from './components/admin/analysispage';
import DataPage from './components/admin/datapage';
import UserDetails from './components/admin/user_details';
import MyStats from './components/user/mystats'; // Updated path for MyStats
import Bonus from './components/user/bonus';
import Profile from './components/user/profile';
import History from './components/user/History';
import DistrictData from './components/landing_page/DistrictData'; // Import the new component
// import EventsPage from './components/user/events'; // Import the new component

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>   
                    <Route path="/" element={<HomePage />} />  
                    <Route path="/adminhome" element={<Homepagee />} />       
                    <Route path="/userlogin" element={<Login />} />
                    <Route path="/usersignup" element={<Signup />} />
                    <Route path="/adminlogin" element={<AdminLogin />} />
                    <Route path="/userdashboard" element={<UserHome />} />
                    <Route path="/audio" element={<AudioPage />} />
                    <Route path="/text" element={<TextPage />} />
                    <Route path="/video" element={<VideoPage />} />
                    <Route path="/map" element={<ExploreAndhra />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/data" element={<DataPage />} />
                    <Route path="/user" element={<UserDetails />} />
                    <Route path="/mystats" element={<MyStats />} /> {/* New route */}
                    <Route path="/bonus" element={<Bonus />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/district/:districtName" element={<DistrictData />} />
                    {/* <Route path="/events" element={<EventsPage />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
