import axiosInstance from './axiosInstance';

export const monthClosingService = {
    previewMonthClosing: async (closingData) => {
        const response = await axiosInstance.post('/month-closings/preview', closingData);
        return response.data;
    },

    closeMonth: async (closingData) => {
        const response = await axiosInstance.post('/month-closings', closingData);
        return response.data;
    },

    getAllMonthClosings: async () => {
        const response = await axiosInstance.get('/month-closings');
        return response.data;
    },

    getMonthClosingById: async (id) => {
        const response = await axiosInstance.get(`/month-closings/${id}`);
        return response.data;
    },

    getMonthClosingByYearAndMonth: async (year, month) => {
        const response = await axiosInstance.get(`/month-closings/search?year=${year}&month=${month}`);
        return response.data;
    },

   
    toggleHisabComplete: async (detailId, completed) => {
        const response = await axiosInstance.put(`/month-closings/detail/${detailId}/complete?completed=${completed}`);
        return response.data;
    }
};