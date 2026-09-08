import axiosInstance from './axiosInstance';

const AdvanceService = {
  recordAdvance: (data) => axiosInstance.post('/api/advances', data),
  updateAdvance: (id, data) => axiosInstance.put(`/api/advances/${id}`, data),
  getMonthlyAdvances: (year, month) => axiosInstance.get(`/api/advances/monthly?year=${year}&month=${month}`),
  deleteAdvance: (id) => axiosInstance.delete(`/api/advances/${id}`)
};

export default AdvanceService;