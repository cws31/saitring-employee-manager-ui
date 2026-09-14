import axiosClient from "./axiosClient";

const advanceApi = {
  create: async (advance) => {
    const response = await axiosClient.post(
      "/advances",
      advance
    );

    return response.data;
  },

  update: async (id, advance) => {
    const response = await axiosClient.put(
      `/advances/${id}`,
      advance
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(
      `/advances/${id}`
    );

    return response.data;
  },

  getMonthly: async (year, month) => {
    const response = await axiosClient.get(
      "/advances/monthly",
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

export default advanceApi;