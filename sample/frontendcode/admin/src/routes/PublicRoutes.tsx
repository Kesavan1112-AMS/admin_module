import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../stores/Auth";
import { useDispatch, useSelector } from "react-redux";
import { jwtVerification } from "../utils/Validation.utils";
import { loginSuccess } from "../contexts/slices/UserSlice";

export const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const loggedUser = useSelector(
    (state: RootState) => state.loggedUserInfo.loggedUser
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = () => {
      if (loggedUser) {
        const isValid = jwtVerification(loggedUser.sessionId);
        if (isValid) {
          setIsAuthorized(true);
          return;
        }
      }

      const localData = sessionStorage.getItem("loggedUser");
      if (localData) {
        const userData = JSON.parse(localData);
        const isValid = jwtVerification(userData.sessionId);

        if (isValid) {
          dispatch(loginSuccess(userData));
          setIsAuthorized(true);
          return;
        }
      }

      setIsAuthorized(false);
    };

    checkAuth();
  }, [dispatch, loggedUser]);

  if (isAuthorized === null) {
    return null;
  }

  const redirectPath = sessionStorage.getItem("reqPath") || "/";
  return isAuthorized ? <Navigate to={redirectPath} replace /> : element;
};
