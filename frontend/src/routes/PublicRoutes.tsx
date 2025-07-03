import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../stores/Auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../contexts/slices/UserSlice";
import { validateSession } from "../services/Auth.service";
import LoaderComponent from "../components/sharedComponents/LoaderComponent";

interface PublicRouteProps {
  element: JSX.Element;
}

export const PublicRoute = ({ element }: PublicRouteProps) => {
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const dispatch = useDispatch();

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
            setAuthState("authenticated");
            return;
          } else {
            // Session is invalid, clear user data
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
      }
    };

    checkAuthentication();
  }, [dispatch, loggedUser]);

  // Handle session expired state
  useEffect(() => {
    if (sessionExpired) {
      setAuthState("unauthenticated");
    }
  }, [sessionExpired]);

  // Show loading state
  if (authState === "loading") {
    return <LoaderComponent />;
  }

  // If authenticated, redirect to saved path or dashboard
  if (authState === "authenticated") {
    const redirectPath = sessionStorage.getItem("redirectPath") || "/";
    sessionStorage.removeItem("redirectPath"); // Clear the saved path
    return <Navigate to={redirectPath} replace />;
  }

  // If not authenticated, show the public element (login page)
  return element;
};
