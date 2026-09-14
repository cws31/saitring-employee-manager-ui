import axiosClient from "./axiosClient";

const monthClosingApi = {
  getAll: async () => {
    const response = await axiosClient.get("/month-closings");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/month-closings/${id}`);
    return response.data;
  },

  getByYearMonth: async (year, month) => {
    const response = await axiosClient.get(
      `/month-closings/year/${year}/month/${month}`
    );
    return response.data;
  },

  search: async (year, month) => {
    const response = await axiosClient.get("/month-closings/search", {
      params: {
        year,
        month,
      },
    });

    return response.data;
  },

  markDetailCompleted: async (detailId, completed) => {
    const response = await axiosClient.put(
      `/month-closings/detail/${detailId}/complete`,
      null,
      {
        params: {
          completed,
        },
      }
    );

    return response.data;
  },
};

export default monthClosingApi;