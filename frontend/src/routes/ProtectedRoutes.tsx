import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/Auth";
import { loginSuccess, logOut } from "../contexts/slices/UserSlice";
import { validateSession } from "@/services/Auth.service";
import LoaderComponent from "../components/sharedComponents/LoaderComponent";
import toast from "react-hot-toast";

interface ProtectedRoutesProps {
  element: JSX.Element;
  requiredPrivileges?: number[];
}

export const ProtectRoutes = ({
  element,
  requiredPrivileges,
}: ProtectedRoutesProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const [hasPrivileges, setHasPrivileges] = useState<boolean>(true);

  const loggedUser = useSelector(
    (state: RootState) => state.loggedUserInfo.loggedUser
  );
  const sessionExpired = useSelector(
    (state: RootState) => state.loggedUserInfo.sessionExpired
  );

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // If user is already in Redux state, validate the session
        if (loggedUser) {
          const response = await validateSession();
          if (response.status === 1) {
            // Session is valid, check privileges
            if (requiredPrivileges && loggedUser.privileges) {
              const hasRequiredPrivileges = requiredPrivileges.every(
                (privilege) => loggedUser.privileges.includes(privilege)
              );
              setHasPrivileges(hasRequiredPrivileges);
            }
            setAuthState("authenticated");
            return;
          } else {
            // Session is invalid, clear user data
            dispatch(logOut());
            sessionStorage.removeItem("loggedUser");
            sessionStorage.removeItem("userPriv");
            setAuthState("unauthenticated");
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

              // Check privileges
              if (requiredPrivileges && userData.privileges) {
                const hasRequiredPrivileges = requiredPrivileges.every(
                  (privilege) => userData.privileges.includes(privilege)
                );
                setHasPrivileges(hasRequiredPrivileges);
              }

              setAuthState("authenticated");
              return;
            } else {
              // Clear invalid session data
              sessionStorage.removeItem("loggedUser");
              sessionStorage.removeItem("userPriv");
              setAuthState("unauthenticated");
              return;
            }
          } catch (error) {
            console.error("Error parsing saved user data:", error);
            sessionStorage.removeItem("loggedUser");
            sessionStorage.removeItem("userPriv");
            setAuthState("unauthenticated");
            return;
          }
        }

        // No valid authentication found
        setAuthState("unauthenticated");
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthState("unauthenticated");
        toast.error("Authentication check failed. Please login again.");
      }
    };

    checkAuthentication();
  }, [dispatch, loggedUser, requiredPrivileges]);

  // Handle session expired state
  useEffect(() => {
    if (sessionExpired) {
      setAuthState("unauthenticated");
      toast.error("Session expired. Please login again.");
    }
  }, [sessionExpired]);

  // Save current path for redirect after login
  useEffect(() => {
    if (authState === "unauthenticated") {
      sessionStorage.setItem("redirectPath", location.pathname);
    }
  }, [authState, location.pathname]);

  // Show loading state
  if (authState === "loading") {
    return <LoaderComponent />;
  }

  // Redirect to unauthorized if user doesn't have required privileges
  if (authState === "authenticated" && !hasPrivileges) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect to login if not authenticated
  if (authState === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return element;
};
