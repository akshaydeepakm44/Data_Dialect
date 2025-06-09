// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'; // Import the CSS

const Signup = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const normalizedUsername = username.replace(/\s+/g, '');
            // Check if username or email already exists
            const checkResponse = await axios.post('http://localhost:5000/check-user', { username: normalizedUsername, email });
            if (checkResponse.data.exists) {
                if (checkResponse.data.usernameExists && checkResponse.data.emailExists) {
                    alert('Username and Email already exist.');
                } else if (checkResponse.data.usernameExists) {
                    alert('Username already exists.');
                } else if (checkResponse.data.emailExists) {
                    alert('Email already exists.');
                }
                return;
            }

            await axios.post('http://localhost:5000/register/users', { username: normalizedUsername, email, password });
            alert('Account created successfully! Please log in.');
            navigate('/userlogin'); // Redirect to login page
        } catch (error) {
            console.error(error);
            alert('Error creating account. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <div className="left">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <div className='left_content'>
                    <h2>Create Your Account</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={username} onChange={(e) => setName(e.target.value)} placeholder="UserName" required />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                        <button type="submit">Create Account</button>
                        <p>Already have an account? <Link to="/userlogin">Login</Link></p>
                    </form>
                </div>
            </div>
            <div className="right">
                <div className='h'>
                    <h1><strong>Explore Us</strong></h1>
                </div>
                <img src="/welcome.svg" alt="Explore Us" className="bottom-image" />
            </div>
        </div>
    );
};

export default Signup;