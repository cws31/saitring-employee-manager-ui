import axiosClient from "./axiosClient";

const dashboardApi = {
  getDashboard: async (year, month) => {
    const response = await axiosClient.get("/dashboard", {
      params: {
        year,
        month,
      },
    });

    return response.data;
  },
};

export default dashboardApi;