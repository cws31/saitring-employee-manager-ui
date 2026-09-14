import axiosClient from "./axiosClient";

const authApi = {

  login: async (credentials) => {

    const response =
      await axiosClient.post(
        "/owners/login",
        credentials
      );

    return response.data;
  },


  verifyOtp: async (data) => {

    const response =
      await axiosClient.post(
        "/owners/verify-otp",
        data
      );

    return response.data;
  },


  register: async (formData) => {

    const response =
      await axiosClient.post(
        "/owners/register",
        formData
      );

    return response.data;
  },

  getLogo: async (ownerId) => {

    const response =
      await axiosClient.get(
        `/owners/${ownerId}/logo`,
        {
          responseType: "blob",
        }
      );

    return response.data;
  },
};


export default authApi;