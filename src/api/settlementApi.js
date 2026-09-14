import axiosClient from "./axiosClient";

const settlementApi = {
  create: async (settlement) => {
    const response = await axiosClient.post(
      "/settlements",
      settlement
    );

    return response.data;
  },

  getAll: async () => {
    const response = await axiosClient.get("/settlements");
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await axiosClient.get(
      `/settlements/employee/${employeeId}`
    );

    return response.data;
  },

  update: async (id, settlement) => {
    const response = await axiosClient.put(
      `/settlements/${id}`,
      settlement
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(
      `/settlements/${id}`
    );

    return response.data;
  },
};

export default settlementApi;