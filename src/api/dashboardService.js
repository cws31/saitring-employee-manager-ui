import axiosInstance from "./axiosInstance";

const dashboardService = {
    getDashboard: async (year, month) => {
        const response = await axiosInstance.get("/api/dashboard", {
            params: {
                year,
                month
            }
        });

        return response.data;
    }
};

export default dashboardService;