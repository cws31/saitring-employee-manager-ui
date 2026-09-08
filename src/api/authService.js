import axiosInstance from './axiosInstance';

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  },

  verifyOtp: async (otpData) => {
    const response = await axiosInstance.post('/api/auth/verify-otp', otpData);
    let token = response.data;
    
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.substring(7);
    }
    
    return token; 
  }
};