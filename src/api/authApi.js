import axiosClient from "./axiosClient";

const authApi = {
  login: async (credentials) => {
    const response = await axiosClient.post(
      "/owners/login",
      credentials
    );

    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await axiosClient.post(
      "/owners/verify-otp",
      data
    );

    return response.data;
  },

  register: async (formData) => {
    const response = await axiosClient.post(
      "/owners/register",
      formData
    );

    return response.data;
  },

  getLogo: async (ownerId) => {
    const response = await axiosClient.get(
      `/owners/${ownerId}/logo`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get(
      "/owners/profile"
    );

    return response.data;
  },

  updateProfile: async (profileData, logoFile) => {
    const formData = new FormData();

    formData.append(
      "request",
      new Blob(
        [JSON.stringify(profileData)],
        {
          type: "application/json",
        }
      )
    );

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const response = await axiosClient.put(
      "/owners/profile",
      formData
    );

    return response.data;
  },

  deleteLogo: async () => {
    await axiosClient.delete(
      "/owners/profile/logo"
    );
  },
};

export default authApi;