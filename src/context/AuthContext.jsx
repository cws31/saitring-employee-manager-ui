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

    console.log(
      "[AUTH CONTEXT] Existing token:",
      Boolean(savedToken)
    );

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

        console.log(
          "[AUTH CONTEXT] Loading actual owner logo. ownerId:",
          owner.ownerId
        );

        const logoBlob =
          await authApi.getLogo(owner.ownerId);

        if (
          !logoBlob ||
          logoBlob.size === 0
        ) {

          console.log(
            "[AUTH CONTEXT] No logo found for owner."
          );

          return;
        }

        console.log(
          "[AUTH CONTEXT] Logo received successfully."
        );

        console.log(
          "[AUTH CONTEXT] Logo size:",
          logoBlob.size
        );

        console.log(
          "[AUTH CONTEXT] Logo type:",
          logoBlob.type
        );


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

          return {
            ...currentOwner,
            logoUrl: objectUrl,
          };
        });


        console.log(
          "[AUTH CONTEXT] Actual uploaded logo loaded."
        );

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

    console.log(
      "=================================================="
    );

    console.log(
      "[AUTH CONTEXT] login() called"
    );

    console.log(
      "[AUTH CONTEXT] Identifier:",
      identifier
    );

    try {

      const response =
        await authApi.login({
          identifier,
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
    identifier,
    otp
  ) => {

    console.log(
      "=================================================="
    );

    console.log(
      "[AUTH CONTEXT] verifyOtp() CALLED"
    );

    console.log(
      "[AUTH CONTEXT] Identifier:",
      identifier
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
          identifier,
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

        email:
          response.email,

        mobileNumber:
          response.mobileNumber,

        logoUrl:
          null,
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
        "[AUTH CONTEXT] Logo will now be loaded from backend."
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