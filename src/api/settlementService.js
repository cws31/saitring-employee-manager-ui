import axiosInstance from './axiosInstance';

const API_URL = '/api/settlements';

export const settlementService = {
    getAllSettlements: async () => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    },
    getByEmployee: async (employeeId) => {
        const response = await axiosInstance.get(`${API_URL}/employee/${employeeId}`);
        return response.data;
    },
    createSettlement: async (data) => {
        const response = await axiosInstance.post(API_URL, data);
        return response.data;
    },
    updateSettlement: async (id, data) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data;
    },
    deleteSettlement: async (id) => {
        await axiosInstance.delete(`${API_URL}/${id}`);
    }
};