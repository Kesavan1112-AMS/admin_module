import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/Auth";
import { loginSuccess, logOut } from "../contexts/slices/UserSlice";
import { validateSession } from "../services/Auth.service";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const loggedUser = useSelector(
    (state: RootState) => state.loggedUserInfo.loggedUser
  );
  const sessionExpired = useSelector(
    (state: RootState) => state.loggedUserInfo.sessionExpired
  );
  const isError = useSelector(
    (state: RootState) => state.loggedUserInfo.isError
  );

  const isAuthenticated = !!loggedUser && !sessionExpired;

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // If user is already in Redux state, validate the session
        if (loggedUser) {
          const response = await validateSession();
          if (response.status === 1) {
            // Session is valid
            setIsInitialized(true);
            return;
          } else {
            // Session is invalid, clear user data
            dispatch(logOut());
            sessionStorage.removeItem("loggedUser");
            sessionStorage.removeItem("userPriv");
            setIsInitialized(true);
            return;
          }
        }

        // Check sessionStorage for saved user data
        const savedUser = sessionStorage.getItem("loggedUser");
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            const response = await validateSession();

            if (response.status === 1) {
              // Restore user data to Redux
              dispatch(loginSuccess(userData));
              setIsInitialized(true);
              return;
            } else {
              // Clear invalid session data
              sessionStorage.removeItem("loggedUser");
              sessionStorage.removeItem("userPriv");
              setIsInitialized(true);
              return;
            }
          } catch (error) {
            console.error("Error parsing saved user data:", error);
            sessionStorage.removeItem("loggedUser");
            sessionStorage.removeItem("userPriv");
            setIsInitialized(true);
            return;
          }
        }

        // No valid authentication found
        setIsInitialized(true);
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        setIsInitialized(true);
        toast.error("Authentication check failed. Please login again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, loggedUser]);

  // Handle session expired
  useEffect(() => {
    if (sessionExpired) {
      toast.error("Session expired. Please login again.");
    }
  }, [sessionExpired]);

  // Handle authentication errors
  useEffect(() => {
    if (isError) {
      toast.error(isError);
    }
  }, [isError]);

  const logout = () => {
    dispatch(logOut());
    sessionStorage.removeItem("loggedUser");
    sessionStorage.removeItem("userPriv");
    sessionStorage.removeItem("redirectPath");
    toast.success("Logged out successfully");
  };

  const hasPrivilege = (requiredPrivileges: number[]): boolean => {
    if (!isAuthenticated || !loggedUser?.privileges) {
      return false;
    }

    return requiredPrivileges.every((privilege) =>
      loggedUser.privileges.includes(privilege)
    );
  };

  const hasAnyPrivilege = (requiredPrivileges: number[]): boolean => {
    if (!isAuthenticated || !loggedUser?.privileges) {
      return false;
    }

    return requiredPrivileges.some((privilege) =>
      loggedUser.privileges.includes(privilege)
    );
  };

  return {
    user: loggedUser,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    sessionExpired,
    isError,
    logout,
    hasPrivilege,
    hasAnyPrivilege,
  };
};
