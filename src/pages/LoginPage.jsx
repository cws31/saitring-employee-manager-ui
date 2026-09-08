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

    try {
      await authService.login({ username, password });
      setStep(2); 
    } catch (err) {
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

    try {
      const token = await authService.verifyOtp({ username, otp });
      localStorage.setItem('token', token); 
      navigate('/'); 
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Invalid or expired OTP.';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        
        {/* Business branding title */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-medium text-blue-900 tracking-wide">Sonu Saitring</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Management Portal</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-xs mb-4 break-all border border-red-100">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-normal rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending OTP...' : 'Login & Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-xs text-gray-500 mb-4 text-center leading-relaxed">
              A verification code has been sent to your registered admin email.
            </p>
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1 text-center">Enter 6-digit OTP</label>
              <input 
                type="text" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded text-center tracking-[0.3em] text-lg focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-normal rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Enter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;