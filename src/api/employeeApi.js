import axiosClient from "./axiosClient";

const employeeApi = {
  getAll: async () => {
    const response = await axiosClient.get("/employees");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/employees/${id}`);
    return response.data;
  },

  create: async (employee) => {
    const response = await axiosClient.post(
      "/employees",
      employee
    );

    return response.data;
  },

  update: async (id, employee) => {
    const response = await axiosClient.put(
      `/employees/${id}`,
      employee
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(
      `/employees/${id}`
    );

    return response.data;
  },

  toggleBlock: async (id) => {
    const response = await axiosClient.patch(
      `/employees/${id}/toggle-block`
    );

    return response.data;
  },
};

export default employeeApi;