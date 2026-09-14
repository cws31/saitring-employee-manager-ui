import {
  createContext,
  useContext,
  useState,
} from "react";

import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [owner, setOwner] = useState(() => {

    const savedOwner =
      localStorage.getItem("owner");

    try {
      return savedOwner
        ? JSON.parse(savedOwner)
        : null;
    } catch (error) {

      console.error(
        "[AUTH CONTEXT] Failed to parse saved owner:",
        error
      );

      return null;
    }
  });


  const [token, setToken] = useState(() => {

    const savedToken =
      localStorage.getItem("ownerToken");

    console.log(
      "[AUTH CONTEXT] Existing token:",
      Boolean(savedToken)
    );

    return savedToken;
  });


  const login = async (
    username,
    password
  ) => {

    console.log(
      "=================================================="
    );

    console.log(
      "[AUTH CONTEXT] login() called"
    );

    console.log(
      "[AUTH CONTEXT] Username:",
      username
    );

    try {

      const response =
        await authApi.login({
          username,
          password,
        });

      console.log(
        "[AUTH CONTEXT] login() API response:",
        response
      );

      console.log(
        "[AUTH CONTEXT] OTP required:",
        response?.otpRequired
      );

      return response;

    } catch (error) {

      console.error(
        "[AUTH CONTEXT] login() failed:",
        error
      );

      console.error(
        "[AUTH CONTEXT] login() response:",
        error?.response
      );

      throw error;
    }
  };


  const verifyOtp = async (
    username,
    otp
  ) => {

    console.log(
      "=================================================="
    );

    console.log(
      "[AUTH CONTEXT] verifyOtp() CALLED"
    );

    console.log(
      "[AUTH CONTEXT] Username:",
      username
    );

    console.log(
      "[AUTH CONTEXT] OTP length:",
      otp?.length
    );

    try {

      console.log(
        "[AUTH CONTEXT] Calling authApi.verifyOtp()..."
      );

      const response =
        await authApi.verifyOtp({
          username,
          otp,
        });

      console.log(
        "[AUTH CONTEXT] verifyOtp() API response:",
        response
      );

      console.log(
        "[AUTH CONTEXT] Token returned:",
        Boolean(response?.token)
      );


      if (!response?.token) {

        console.error(
          "[AUTH CONTEXT] Backend response does not contain token."
        );

        throw new Error(
          "Authentication token was not returned."
        );
      }

      const ownerData = {

        ownerId:
          response.ownerId,

        ownerName:
          response.ownerName,

        organizationName:
          response.organizationName,

        username:
          response.username,

        logoUrl:
          response.logoUrl || null,
      };

      console.log(
        "[AUTH CONTEXT] Owner data:",
        ownerData
      );

      localStorage.setItem(
        "ownerToken",
        response.token
      );

      console.log(
        "[AUTH CONTEXT] JWT saved to localStorage."
      );

      localStorage.setItem(
        "owner",
        JSON.stringify(ownerData)
      );

      console.log(
        "[AUTH CONTEXT] Owner saved to localStorage."
      );


      setToken(response.token);

      setOwner(ownerData);

      console.log(
        "[AUTH CONTEXT] React authentication state updated."
      );

      console.log(
        "[AUTH CONTEXT] isAuthenticated should now be TRUE."
      );

      console.log(
        "=================================================="
      );

      return response;

    } catch (error) {

      console.error(
        "=================================================="
      );

      console.error(
        "[AUTH CONTEXT] verifyOtp() FAILED"
      );

      console.error(
        "[AUTH CONTEXT] Error:",
        error
      );

      console.error(
        "[AUTH CONTEXT] Error message:",
        error?.message
      );

      console.error(
        "[AUTH CONTEXT] HTTP status:",
        error?.response?.status
      );

      console.error(
        "[AUTH CONTEXT] Response data:",
        error?.response?.data
      );

      console.error(
        "=================================================="
      );

      throw error;
    }
  };

  const logout = () => {

    console.log(
      "[AUTH CONTEXT] Logging out..."
    );

    localStorage.removeItem(
      "ownerToken"
    );

    localStorage.removeItem(
      "owner"
    );

    setToken(null);
    setOwner(null);

    console.log(
      "[AUTH CONTEXT] Logout completed."
    );
  };


  const isAuthenticated =
    Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        owner,
        token,
        isAuthenticated,
        login,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}