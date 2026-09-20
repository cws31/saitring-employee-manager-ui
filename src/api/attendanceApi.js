import axiosClient from "./axiosClient";

const attendanceApi = {
  create: async (attendance) => {
    const response = await axiosClient.post(
      "/attendance",
      attendance
    );

    return response.data;
  },

  bulkCreate: async (attendance) => {
    const response = await axiosClient.post(
      "/attendance/bulk",
      attendance
    );

    return response.data;
  },

  getMonthly: async (year, month) => {
    const response = await axiosClient.get(
      "/attendance/month",
      {
        params: {
          year,
          month,
        },
      }
    );

    return response.data;
  },

  getEmployeeMonthly: async (employeeId, year, month) => {
    const response = await axiosClient.get(
      `/attendance/employee/${employeeId}`,
      {
        params: {
          year,
          month,
        },
      }
    );

    return response.data;
  },

  getDailySummary: async (date) => {
    const response = await axiosClient.get(
      "/attendance/summary/day",
      {
        params: {
          date,
        },
      }
    );
    return response.data;
  },

  getMonthlySummary: async (year, month) => {
    const response = await axiosClient.get(
      "/attendance/summary/month",
      {
        params: {
          year,
          month,
        },
      }
    );
    return response.data;
  },
};

export default attendanceApi;