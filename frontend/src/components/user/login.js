import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import the CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/login', { email, password });
            
            // Save username and token to localStorage
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user_id);
            
            navigate('/userdashboard'); // Redirect to user dashboard
        } catch (error) {
            console.error(error);
            alert('Invalid credentials. Please try again.');
        }
    };
    

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://localhost:5000/users/forgot-password', { email });
            alert('OTP sent to your email!');
            setIsOtpSent(true);
        } catch (error) {
            console.error(error);
            alert('Error sending OTP. Please try again.');
        }
    };

    const verifyOtp = async () => {
        try {
            await axios.post('http://localhost:5000/users/verify-otp', { email, otp });
            alert('OTP verified! Now reset your password.');
            setIsOtpVerified(true);
        } catch (error) {
            console.error(error);
            alert('Invalid OTP. Please try again.');
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await axios.post('http://localhost:5000/users/reset-password', { email, newPassword });
            alert('Password reset successful! You can now log in.');
            setForgotPassword(false);
            setIsOtpVerified(false);
        } catch (error) {
            console.error(error);
            alert('Error resetting password. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="left">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                
                <div className='left_content'>
                    <h2>LET’S EXPLORE</h2>
                    {!forgotPassword ? (
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email" 
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
                            <button type="submit">Login</button>
                            <p>Forgot your password? <span className="forgot-link" onClick={() => setForgotPassword(true)}>Click here</span></p>
                            <p>Don't have an account? <Link to="/usersignup">Sign Up</Link></p>
                        </form>
                    ) : (
                        <div className="otp-container">
                            <h3>Reset Your Password</h3>
                            
                            {!isOtpVerified ? (
                                <>
                                    <input 
                                        type="text" 
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value)} 
                                        placeholder="Enter OTP" 
                                        required 
                                    />
                                    <button onClick={verifyOtp}>Verify OTP</button>
                                    <button onClick={handleForgotPassword}>Resend OTP</button>
                                    <p onClick={() => setForgotPassword(false)} className="back-to-login">Back to Login</p>
                                </>
                            ) : (
                                <>
                                    <input 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        placeholder="New Password" 
                                        required 
                                    />
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Confirm Password" 
                                        required 
                                    />
                                    <button onClick={handleResetPassword}>Reset Password</button>
                                    <p onClick={() => setForgotPassword(false)} className="back-to-login">Back to Login</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="right">
                <h1><strong>Welcome Back</strong></h1>
                <img src="/welcomeback.svg" alt="Welcome Back" className="bottom-imagee" />
            </div>
        </div>
    );
};

export default Login;