
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './adminlogin.css';

const AdminLogin = () => {
    // Predefined Admin Credentials
    const adminEmail = "datadialect@gmail.com";
    const adminPassword = "Data@123";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === adminEmail && password === adminPassword) {
            alert('Admin Login Successful!');
            navigate('/adminhome'); // Redirect to Admin Home Page
        } else {
            setErrorMessage("Invalid Admin Credentials. Please try again.");
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="adminlogin-container">
            <div className="left">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                
                <div className='left_content'>
                    <h2>ADMIN PANEL</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Admin Email" 
                            required 
                        />
                        <div className="password-container">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Password" 
                                required 
                            />
                            <i className={`far fa-eye ${showPassword ? 'active' : ''}`} onClick={togglePassword} id="togglePassword"></i>
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
            <div className="right">
                <h1><strong>Welcome Admin</strong></h1>
                <img src="/welcomeback.svg" alt="Welcome Back" className="bottom-imagee" />
            </div>
        </div>
    );
};

export default AdminLogin;
