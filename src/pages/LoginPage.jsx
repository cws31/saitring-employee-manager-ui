import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log("Frontend: Submitting login for username:", username);

    try {
      const response = await authService.login({ username, password });
      console.log("Frontend: Login response received successfully:", response);
      setStep(2); 
    } catch (err) {
      console.error("Frontend: Login request failed:", err);
      const errorMsg = err.response?.data || err.message || 'Network error or backend unreachable.';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log("Frontend: Submitting OTP verification...");

    try {
      const token = await authService.verifyOtp({ username, otp });
      console.log("Frontend: OTP verified successfully. Token received.");
      // FIXED: Changed from 'jwt_token' to 'token' to match axiosInstance.js
      localStorage.setItem('token', token); 
      navigate('/'); 
    } catch (err) {
      console.error("Frontend: OTP verification failed:", err);
      const errorMsg = err.response?.data || err.message || 'Invalid or expired OTP.';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f8' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
        
        {error && (
          <div style={{ background: '#ffe6e6', color: '#d9534f', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '15px', wordBreak: 'break-all' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {loading ? 'Sending OTP...' : 'Login & Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', textAlign: 'center' }}>
              A verification code has been sent to your registered admin email.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Enter 6-digit OTP</label>
              <input 
                type="text" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {loading ? 'Verifying...' : 'Verify OTP & Enter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;