import {
  createContext,
  useContext,
  useEffect,
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

    return savedToken;
  });

  useEffect(() => {
    if (!token || !owner?.ownerId) {
      return;
    }

    let objectUrl = null;
    let cancelled = false;

    const loadOwnerLogo = async () => {
      try {
        const logoBlob =
          await authApi.getLogo(
            owner.ownerId
          );

        if (
          !logoBlob ||
          logoBlob.size === 0
        ) {
          return;
        }

        objectUrl =
          URL.createObjectURL(logoBlob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setOwner((currentOwner) => {
          if (!currentOwner) {
            return currentOwner;
          }

          const updatedOwner = {
            ...currentOwner,
            logoUrl: objectUrl,
          };

          localStorage.setItem(
            "owner",
            JSON.stringify(updatedOwner)
          );

          return updatedOwner;
        });
      } catch (error) {
        console.warn(
          "[AUTH CONTEXT] Unable to load owner logo:",
          error?.response?.status ||
            error?.message ||
            error
        );
      }
    };

    loadOwnerLogo();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [token, owner?.ownerId]);
  const login = async (
    identifier,
    password
  ) => {
    try {
      const response =
        await authApi.login({
          identifier,
          password,
        });

      return response;
    } catch (error) {
      console.error(
        "[AUTH CONTEXT] login() failed:",
        error
      );

      throw error;
    }
  };

  const verifyOtp = async (
    identifier,
    otp
  ) => {
    try {
      const response =
        await authApi.verifyOtp({
          identifier,
          otp,
        });

      if (!response?.token) {
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

        email:
          response.email,

        mobileNumber:
          response.mobileNumber,

        logoUrl:
          null,
      };

      localStorage.setItem(
        "ownerToken",
        response.token
      );

      localStorage.setItem(
        "owner",
        JSON.stringify(ownerData)
      );

      setToken(response.token);
      setOwner(ownerData);

      return response;
    } catch (error) {
      console.error(
        "[AUTH CONTEXT] verifyOtp() failed:",
        error
      );

      throw error;
    }
  };

  const updateOwner = async (
    updatedOwner
  ) => {
    if (!updatedOwner) {
      return;
    }

    setOwner((currentOwner) => {
      const newOwner = {
        ...currentOwner,
        ...updatedOwner,
      };

      localStorage.setItem(
        "owner",
        JSON.stringify(newOwner)
      );

      return newOwner;
    });
  };
  const logout = () => {
    localStorage.removeItem(
      "ownerToken"
    );

    localStorage.removeItem(
      "owner"
    );

    setToken(null);
    setOwner(null);
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
        updateOwner,
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