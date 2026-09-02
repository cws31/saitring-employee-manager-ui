import axiosInstance from './axiosInstance';

const AdvanceService = {
  recordAdvance: (data) => axiosInstance.post('/advances', data),
  updateAdvance: (id, data) => axiosInstance.put(`/advances/${id}`, data),
  getMonthlyAdvances: (year, month) => axiosInstance.get(`/advances/monthly?year=${year}&month=${month}`),
  deleteAdvance: (id) => axiosInstance.delete(`/advances/${id}`)
};

export default AdvanceService;